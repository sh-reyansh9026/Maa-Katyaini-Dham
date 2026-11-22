import mongoose from 'mongoose'
import Availability from './model.js'
import Room from '../rooms/model.js'
import Hall from '../halls/model.js'
import { getDatesInRange, startOfDay, endOfDay } from '../../utils/dates.js'
import logger from '../../utils/logger.js'

/**
 * Availability Service - Handles inventory management with atomic operations
 */

/**
 * Initialize availability for a resource (called when room/hall is created)
 */
export const initializeAvailability = async (resourceId, resourceType, totalUnits) => {
  try {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Get the resource to verify it exists
      const resource = resourceType === 'room' 
        ? await Room.findById(resourceId).session(session)
        : await Hall.findById(resourceId).session(session)

      if (!resource) {
        throw new Error('Resource not found')
      }

      // Initialize availability for next 365 days
      const today = new Date()
      const dates = getDatesInRange(today, new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000))

      const availabilityDocs = []

      if (resourceType === 'room') {
        // For rooms, create one record per date with slot NONE
        for (const date of dates) {
          availabilityDocs.push({
            resourceId,
            resourceType,
            date: startOfDay(date),
            slot: 'NONE',
            totalUnits,
            bookedUnits: 0,
            isManuallyBlocked: false,
          })
        }
      } else {
        // For halls, create records for each slot per date
        const slots = ['MORNING', 'EVENING', 'FULL_DAY']
        for (const date of dates) {
          for (const slot of slots) {
            availabilityDocs.push({
              resourceId,
              resourceType,
              date: startOfDay(date),
              slot,
              totalUnits,
              bookedUnits: 0,
              isManuallyBlocked: false,
            })
          }
        }
      }

      // Bulk insert with upsert to handle existing records
      const operations = availabilityDocs.map(doc => ({
        updateOne: {
          filter: {
            resourceId,
            resourceType,
            date: doc.date,
            slot: doc.slot,
          },
          update: { $setOnInsert: doc },
          upsert: true,
        }
      }))

      await Availability.bulkWrite(operations, { session })

      await session.commitTransaction()
      logger.info(`Initialized availability for ${resourceType} ${resourceId}`)
      return true
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  } catch (error) {
    logger.error('Error initializing availability:', error)
    throw error
  }
}

/**
 * Check availability for a resource
 */
export const checkAvailability = async (resourceId, resourceType, checkIn, checkOut, slot) => {
  try {
    const startDate = startOfDay(new Date(checkIn))
    const endDate = checkOut ? endOfDay(new Date(checkOut)) : endOfDay(new Date(checkIn))

    const dates = getDatesInRange(startDate, new Date(endDate))

    const query = {
      resourceId,
      resourceType,
      date: { $in: dates },
      isManuallyBlocked: false,
    }

    if (resourceType === 'hall' && slot) {
      query.slot = slot
    } else if (resourceType === 'room') {
      query.slot = 'NONE'
    }

    const availabilityRecords = await Availability.find(query).lean()

    // Check if all dates have availability
    const unavailableDates = availabilityRecords
      .filter(record => record.bookedUnits >= record.totalUnits)
      .map(record => record.date)

    if (unavailableDates.length > 0) {
      return {
        available: false,
        unavailableDates,
        message: 'Resource not available for requested dates',
      }
    }

    return {
      available: true,
      availabilityRecords,
      message: 'Resource available',
    }
  } catch (error) {
    logger.error('Error checking availability:', error)
    throw error
  }
}

/**
 * Reserve inventory atomically - uses findOneAndUpdate with conditions
 */
export const reserveInventory = async (resourceId, resourceType, checkIn, checkOut, slot, session) => {
  try {
    const startDate = startOfDay(new Date(checkIn))
    const endDate = checkOut ? endOfDay(new Date(checkOut)) : endOfDay(new Date(checkIn))

    const dates = getDatesInRange(startDate, new Date(endDate))

    const reservedRecords = []

    for (const date of dates) {
      const query = {
        resourceId,
        resourceType,
        date,
        isManuallyBlocked: false,
      }

      if (resourceType === 'hall' && slot) {
        query.slot = slot
      } else if (resourceType === 'room') {
        query.slot = 'NONE'
      }

      // Use findOneAndUpdate with condition to ensure atomicity
      const result = await Availability.findOneAndUpdate(
        query,
        {
          $inc: { bookedUnits: 1 },
        },
        {
          new: true,
          session,
        }
      )
      
      if (!result) {
        logger.warn(`Inventory not found for ${resourceType} ${resourceId} on ${date}`)
        throw new Error('Inventory not available for requested dates')
      }

      // Check if the increment pushed us over capacity
      if (result.bookedUnits > result.totalUnits) {
        // Rollback the increment
        await Availability.findByIdAndUpdate(
          result._id,
          {
            $inc: { bookedUnits: -1 },
          },
          { session }
        )
        logger.warn(`No capacity available for ${resourceType} ${resourceId} on ${date}`)
        throw new Error('Inventory not available for requested dates')
      }

      reservedRecords.push(result)
    }

    return reservedRecords
  } catch (error) {
    logger.error('Error reserving inventory:', error)
    throw error
  }
}

/**
 * Release inventory atomically
 */
export const releaseInventory = async (resourceId, resourceType, checkIn, checkOut, slot, session) => {
  try {
    const startDate = startOfDay(new Date(checkIn))
    const endDate = checkOut ? endOfDay(new Date(checkOut)) : endOfDay(new Date(checkIn))

    const dates = getDatesInRange(startDate, new Date(endDate))

    for (const date of dates) {
      const query = {
        resourceId,
        resourceType,
        date,
      }

      if (resourceType === 'hall' && slot) {
        query.slot = slot
      } else if (resourceType === 'room') {
        query.slot = 'NONE'
      }

      // Use a single update operation to avoid conflicts
      const result = await Availability.findOneAndUpdate(
        query,
        {
          $inc: { bookedUnits: -1 },
        },
        {
          new: true,
          session,
        }
      )

      // Ensure bookedUnits doesn't go below 0
      if (result && result.bookedUnits < 0) {
        // Fix negative values
        await Availability.findByIdAndUpdate(
          result._id,
          {
            $set: { bookedUnits: 0 },
          },
          { session }
        )
      }
    }

    logger.info(`Released inventory for ${resourceType} ${resourceId}`)
    return true
  } catch (error) {
    logger.error('Error releasing inventory:', error)
    throw error
  }
}

/**
 * Manually block availability
 */
export const blockAvailability = async (resourceId, resourceType, dates, slot) => {
  try {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      for (const date of dates) {
        // Handle both Date objects and strings
        const dateObj = date instanceof Date ? date : new Date(date)
        
        const query = {
          resourceId,
          resourceType,
          date: startOfDay(dateObj),
        }

        if (resourceType === 'hall' && slot) {
          query.slot = slot
        } else if (resourceType === 'room') {
          query.slot = 'NONE'
        }

        await Availability.findOneAndUpdate(
          query,
          { isManuallyBlocked: true },
          { upsert: true, session }
        )
      }

      await session.commitTransaction()
      logger.info(`Blocked availability for ${resourceType} ${resourceId}`)
      return true
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  } catch (error) {
    logger.error('Error blocking availability:', error)
    throw error
  }
}

/**
 * Unblock availability
 */
export const unblockAvailability = async (resourceId, resourceType, dates, slot) => {
  try {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      for (const date of dates) {
        // Handle both Date objects and strings
        const dateObj = date instanceof Date ? date : new Date(date)
        
        const query = {
          resourceId,
          resourceType,
          date: startOfDay(dateObj),
        }

        if (resourceType === 'hall' && slot) {
          query.slot = slot
        } else if (resourceType === 'room') {
          query.slot = 'NONE'
        }

        await Availability.findOneAndUpdate(
          query,
          { isManuallyBlocked: false },
          { session }
        )
      }

      await session.commitTransaction()
      logger.info(`Unblocked availability for ${resourceType} ${resourceId}`)
      return true
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  } catch (error) {
    logger.error('Error unblocking availability:', error)
    throw error
  }
}

/**
 * Get availability calendar for admin
 */
export const getAvailabilityCalendar = async (resourceId, resourceType, startDate, endDate) => {
  try {
    // Handle both Date objects and strings
    const start = startDate ? (startDate instanceof Date ? startDate : new Date(startDate)) : new Date()
    const end = endDate ? (endDate instanceof Date ? endDate : new Date(endDate)) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Get the resource to know total units
    const Resource = resourceType === 'room' 
      ? (await import('../rooms/model.js')).default
      : (await import('../halls/model.js')).default
    
    const resource = await Resource.findById(resourceId).lean()
    if (!resource) {
      throw new Error('Resource not found')
    }

    const totalUnits = resource.totalUnits || 1

    // Fetch bookings for this resource within the date range
    const Booking = (await import('../bookings/model.js')).default
    const bookingQuery = {
      resourceId,
      resourceType,
      status: { $in: ['PENDING', 'CONFIRMED'] },
    }

    if (resourceType === 'room') {
      // For rooms, find bookings that overlap with the date range
      bookingQuery.$or = [
        { checkIn: { $gte: startOfDay(start), $lte: endOfDay(end) } },
        { checkOut: { $gte: startOfDay(start), $lte: endOfDay(end) } },
        { checkIn: { $lte: startOfDay(start) }, checkOut: { $gte: endOfDay(end) } },
      ]
    } else {
      // For halls, find bookings on the check-in date
      bookingQuery.checkIn = { $gte: startOfDay(start), $lte: endOfDay(end) }
    }

    const bookings = await Booking.find(bookingQuery)
      .select('bookingId userName status checkIn checkOut slot guests')
      .lean()

    // Generate calendar data for each date in range
    const calendarData = []
    const currentDate = new Date(startOfDay(start))
    const finalDate = endOfDay(end)

    // Get availability records for checking manual blocks
    const availabilityRecords = await Availability.find({
      resourceId,
      resourceType,
      date: { $gte: startOfDay(start), $lte: endOfDay(end) },
    }).lean()

    // Create a map for quick lookup
    const availabilityMap = {}
    availabilityRecords.forEach(record => {
      const dateKey = record.date.toISOString()
      availabilityMap[`${dateKey}-${record.slot}`] = record
    })

    while (currentDate <= finalDate) {
      const dateKey = currentDate.toISOString()
      const dateStr = startOfDay(currentDate).toISOString()

      if (resourceType === 'hall') {
        // For halls, create entries for each slot
        const slots = ['MORNING', 'EVENING', 'FULL_DAY']
        slots.forEach(slot => {
          const availKey = `${dateStr}-${slot}`
          const availabilityRecord = availabilityMap[availKey]
          
          // Count bookings for this date and slot
          const dateBookings = bookings.filter(b => {
            const bookingDate = startOfDay(new Date(b.checkIn)).toISOString()
            return bookingDate === dateStr && b.slot === slot
          })

          const bookedUnits = dateBookings.length
          const isManuallyBlocked = availabilityRecord?.isManuallyBlocked || false

          calendarData.push({
            date: new Date(currentDate),
            slot,
            totalUnits,
            bookedUnits,
            isManuallyBlocked,
            bookings: dateBookings,
          })
        })
      } else {
        // For rooms, count all bookings that overlap with this date
        const dateBookings = bookings.filter(b => {
          const bookingCheckIn = startOfDay(new Date(b.checkIn))
          const bookingCheckOut = startOfDay(new Date(b.checkOut))
          const currentDay = startOfDay(currentDate)
          
          return currentDay >= bookingCheckIn && currentDay < bookingCheckOut
        })

        const bookedUnits = dateBookings.length
        const availabilityRecord = availabilityMap[`${dateStr}-NONE`]
        const isManuallyBlocked = availabilityRecord?.isManuallyBlocked || false

        calendarData.push({
          date: new Date(currentDate),
          slot: 'NONE',
          totalUnits,
          bookedUnits,
          isManuallyBlocked,
          bookings: dateBookings,
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return calendarData
  } catch (error) {
    logger.error('Error getting availability calendar:', error)
    throw error
  }
}

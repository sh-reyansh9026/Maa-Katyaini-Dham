import mongoose from 'mongoose'
import Booking from './model.js'
import Room from '../rooms/model.js'
import Hall from '../halls/model.js'
import Settings from '../settings/model.js'
import { reserveInventory, releaseInventory, checkAvailability } from '../availability/service.js'
import { generateBookingId } from '../../utils/idGenerator.js'
import { getDatesInRange } from '../../utils/dates.js'
import { env } from '../../config/env.js'
import logger from '../../utils/logger.js'

/**
 * Booking Service - Handles booking creation with MongoDB transactions
 */

/**
 * Calculate total amount server-side
 */
const calculateTotalAmount = async (resourceId, resourceType, checkIn, checkOut, slot, guests) => {
  try {
    if (resourceType === 'room') {
      const room = await Room.findById(resourceId)
      if (!room) {
        throw new Error('Room not found')
      }

      const dates = getDatesInRange(new Date(checkIn), new Date(checkOut))
      const nights = dates.length - 1 // Number of nights

      return room.price * nights
    } else if (resourceType === 'hall') {
      const hall = await Hall.findById(resourceId)
      if (!hall) {
        throw new Error('Hall not found')
      }

      let price = 0
      if (slot === 'MORNING') {
        price = hall.priceMorning
      } else if (slot === 'EVENING') {
        price = hall.priceEvening
      } else if (slot === 'FULL_DAY') {
        price = hall.priceFullDay
      }

      return price
    }

    throw new Error('Invalid resource type')
  } catch (error) {
    logger.error('Error calculating total amount:', error)
    throw error
  }
}

/**
 * Calculate advance amount
 */
const calculateAdvanceAmount = (totalAmount, advancePercentage) => {
  return Math.round((totalAmount * advancePercentage) / 100)
}

/**
 * Generate WhatsApp message
 */
const generateWhatsAppMessage = (booking, advanceAmount) => {
  const settings = {
    whatsappOwnerNumber: env.WHATSAPP_OWNER_NUMBER,
  }

  const message = `
Hello! I would like to confirm my booking.

Booking ID: ${booking.bookingId}
Name: ${booking.userName}
Email: ${booking.userEmail}
Phone: ${booking.userPhone}

${booking.resourceType === 'room' ? 
  `Room: ${booking.resourceName}
Check-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}
Check-out: ${new Date(booking.checkOut).toLocaleDateString('en-IN')}
Guests: ${booking.guests}` : 
  `Hall: ${booking.resourceName}
Date: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}
Slot: ${booking.slot}
Guests: ${booking.guests}`}

Total Amount: ₹${booking.totalAmount}
Advance Due: ₹${advanceAmount}

Please confirm and share UPI details for payment.
  `.trim()

  return {
    phoneNumber: settings.whatsappOwnerNumber,
    message: encodeURIComponent(message),
    url: `https://wa.me/${settings.whatsappOwnerNumber}?text=${encodeURIComponent(message)}`,
  }
}

/**
 * Create booking with transaction
 */
export const createBooking = async (bookingData, userId) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Check for idempotency
    if (bookingData.idempotencyKey) {
      const existingBooking = await Booking.findOne({ 
        idempotencyKey: bookingData.idempotencyKey 
      }).session(session)

      if (existingBooking) {
        await session.commitTransaction()
        return {
          booking: existingBooking,
          whatsapp: generateWhatsAppMessage(existingBooking, existingBooking.advanceAmount),
          isDuplicate: true,
        }
      }
    }

    // Get settings for hold duration and advance percentage
    const settings = await Settings.getSettings()
    const holdDurationMinutes = parseInt(env.BOOKING_HOLD_DURATION_MINUTES) || settings.bookingHoldDurationMinutes
    const advancePercentage = parseInt(env.ADVANCE_PAYMENT_PERCENTAGE) || settings.advancePaymentPercentage

    // Verify resource exists and is active
    const resource = bookingData.resourceType === 'room'
      ? await Room.findById(bookingData.resourceId).session(session)
      : await Hall.findById(bookingData.resourceId).session(session)

    if (!resource || !resource.isActive) {
      throw new Error('Resource not found or inactive')
    }

    // Calculate total amount server-side
    const totalAmount = await calculateTotalAmount(
      bookingData.resourceId,
      bookingData.resourceType,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.slot,
      bookingData.guests
    )

    // Calculate advance amount
    const advanceAmount = calculateAdvanceAmount(totalAmount, advancePercentage)

    // Check availability first
    const availabilityCheck = await checkAvailability(
      bookingData.resourceId,
      bookingData.resourceType,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.slot
    )

    if (!availabilityCheck.available) {
      throw new Error(availabilityCheck.message)
    }

    // Reserve inventory atomically
    await reserveInventory(
      bookingData.resourceId,
      bookingData.resourceType,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.slot,
      session
    )

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + holdDurationMinutes * 60 * 1000)

    // Create booking
    const booking = await Booking.create([{
      bookingId: generateBookingId(),
      userId,
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      userPhone: bookingData.userPhone,
      resourceType: bookingData.resourceType,
      resourceId: bookingData.resourceId,
      resourceName: resource.name,
      checkIn: new Date(bookingData.checkIn),
      checkOut: bookingData.checkOut ? new Date(bookingData.checkOut) : undefined,
      slot: bookingData.slot,
      guests: bookingData.guests,
      totalAmount,
      advanceAmount,
      status: 'PENDING',
      expiresAt,
      idempotencyKey: bookingData.idempotencyKey,
      statusHistory: [{
        status: 'PENDING',
        actor: 'user',
        actorId: userId,
        timestamp: new Date(),
      }],
    }], { session })

    await session.commitTransaction()

    logger.info(`Booking created: ${booking[0].bookingId}`)

    return {
      booking: booking[0],
      whatsapp: generateWhatsAppMessage(booking[0], advanceAmount),
      isDuplicate: false,
    }
  } catch (error) {
    await session.abortTransaction()
    logger.error('Error creating booking:', error)
    throw error
  } finally {
    session.endSession()
  }
}

/**
 * Confirm booking (admin only)
 */
export const confirmBooking = async (bookingId, upiReference, advanceReceived, notes, adminId) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const booking = await Booking.findOne({ bookingId }).session(session)

    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status !== 'PENDING') {
      throw new Error('Booking is not in PENDING status')
    }

    // Check if booking has expired
    if (new Date() > booking.expiresAt) {
      throw new Error('Booking has expired')
    }

    // Update booking - inventory is already reserved from booking creation
    booking.status = 'CONFIRMED'
    booking.upiReference = upiReference
    booking.advanceReceived = advanceReceived
    
    // Only add to status history if status is actually changing
    const lastStatus = booking.statusHistory[booking.statusHistory.length - 1]
    if (!lastStatus || lastStatus.status !== 'CONFIRMED') {
      booking.statusHistory.push({
        status: 'CONFIRMED',
        actor: 'admin',
        actorId: adminId,
        timestamp: new Date(),
        notes,
      })
    }

    await booking.save({ session })

    await session.commitTransaction()

    logger.info(`Booking confirmed: ${bookingId}`)
    return booking
  } catch (error) {
    await session.abortTransaction()
    logger.error('Error confirming booking:', error)
    throw error
  } finally {
    session.endSession()
  }
}

/**
 * Reject booking (admin only)
 */
export const rejectBooking = async (bookingId, notes, adminId) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const booking = await Booking.findOne({ bookingId }).session(session)

    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status !== 'PENDING') {
      throw new Error('Booking is not in PENDING status')
    }

    // Release inventory
    await releaseInventory(
      booking.resourceId,
      booking.resourceType,
      booking.checkIn,
      booking.checkOut,
      booking.slot,
      session
    )

    // Update booking
    booking.status = 'REJECTED'
    
    // Only add to status history if status is actually changing
    const lastStatus = booking.statusHistory[booking.statusHistory.length - 1]
    if (!lastStatus || lastStatus.status !== 'REJECTED') {
      booking.statusHistory.push({
        status: 'REJECTED',
        actor: 'admin',
        actorId: adminId,
        timestamp: new Date(),
        notes,
      })
    }

    await booking.save({ session })

    await session.commitTransaction()

    logger.info(`Booking rejected: ${bookingId}`)
    return booking
  } catch (error) {
    await session.abortTransaction()
    logger.error('Error rejecting booking:', error)
    throw error
  } finally {
    session.endSession()
  }
}

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId, actorId, actor = 'user') => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const booking = await Booking.findOne({ bookingId }).session(session)

    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status === 'CANCELLED' || booking.status === 'EXPIRED') {
      throw new Error('Booking is already cancelled or expired')
    }

    // Only release inventory if booking was CONFIRMED or PENDING
    if (booking.status === 'CONFIRMED' || booking.status === 'PENDING') {
      await releaseInventory(
        booking.resourceId,
        booking.resourceType,
        booking.checkIn,
        booking.checkOut,
        booking.slot,
        session
      )
    }

    // Update booking
    booking.status = 'CANCELLED'
    
    // Only add to status history if status is actually changing
    const lastStatus = booking.statusHistory[booking.statusHistory.length - 1]
    if (!lastStatus || lastStatus.status !== 'CANCELLED') {
      booking.statusHistory.push({
        status: 'CANCELLED',
        actor,
        actorId,
        timestamp: new Date(),
      })
    }

    await booking.save({ session })

    await session.commitTransaction()

    logger.info(`Booking cancelled: ${bookingId}`)
    return booking
  } catch (error) {
    await session.abortTransaction()
    logger.error('Error cancelling booking:', error)
    throw error
  } finally {
    session.endSession()
  }
}

/**
 * Expire booking (internal function)
 */
const expireBooking = async (bookingId, session) => {
  try {
    const booking = await Booking.findOne({ bookingId }).session(session)

    if (!booking || booking.status !== 'PENDING') {
      return
    }

    // Release inventory
    await releaseInventory(
      booking.resourceId,
      booking.resourceType,
      booking.checkIn,
      booking.checkOut,
      booking.slot,
      session
    )

    // Update booking
    booking.status = 'EXPIRED'
    
    // Only add to status history if status is actually changing
    const lastStatus = booking.statusHistory[booking.statusHistory.length - 1]
    if (!lastStatus || lastStatus.status !== 'EXPIRED') {
      booking.statusHistory.push({
        status: 'EXPIRED',
        actor: 'system',
        actorId: 'system',
        timestamp: new Date(),
      })
    }

    await booking.save({ session })

    logger.info(`Booking expired: ${bookingId}`)
  } catch (error) {
    logger.error('Error expiring booking:', error)
    throw error
  }
}

/**
 * Get user bookings
 */
export const getUserBookings = async (userId, query = {}) => {
  try {
    const { status, page = 1, limit = 10 } = query

    const filter = { userId }
    if (status) {
      filter.status = status
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await Booking.countDocuments(filter)

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    logger.error('Error getting user bookings:', error)
    throw error
  }
}

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId, userId) => {
  try {
    const booking = await Booking.findOne({ bookingId }).lean()

    if (!booking) {
      throw new Error('Booking not found')
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== userId) {
      throw new Error('Access denied')
    }

    // Lazy expiry check
    if (booking.status === 'PENDING' && new Date() > booking.expiresAt) {
      // Expire the booking
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        await expireBooking(bookingId, session)
        await session.commitTransaction()
        // Fetch updated booking
        const updatedBooking = await Booking.findOne({ bookingId }).lean()
        session.endSession()
        return updatedBooking
      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
      }
    }

    return booking
  } catch (error) {
    logger.error('Error getting booking by ID:', error)
    throw error
  }
}

/**
 * Get all bookings (admin)
 */
export const getAllBookings = async (query = {}) => {
  try {
    const { status, resourceId, resourceType, startDate, endDate, page = 1, limit = 10 } = query

    const filter = {}
    if (status) filter.status = status
    if (resourceId) filter.resourceId = resourceId
    if (resourceType) filter.resourceType = resourceType
    if (startDate || endDate) {
      filter.checkIn = {}
      if (startDate) filter.checkIn.$gte = new Date(startDate)
      if (endDate) filter.checkIn.$lte = new Date(endDate)
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await Booking.countDocuments(filter)

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    logger.error('Error getting all bookings:', error)
    throw error
  }
}

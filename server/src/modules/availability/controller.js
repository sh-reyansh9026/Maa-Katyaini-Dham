import { checkAvailability, blockAvailability, unblockAvailability, getAvailabilityCalendar } from './service.js'
import logger from '../../utils/logger.js'

/**
 * Availability Controller - Handles HTTP requests for availability
 */

/**
 * Check availability for a resource
 */
export const checkAvailabilityController = async (req, res, next) => {
  try {
    const { resourceId, resourceType, checkIn, checkOut, slot } = req.query

    const result = await checkAvailability(resourceId, resourceType, checkIn, checkOut, slot)

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    })
  } catch (error) {
    logger.error('Error in checkAvailabilityController:', error)
    next(error)
  }
}

/**
 * Block availability (admin only)
 */
export const blockAvailabilityController = async (req, res, next) => {
  try {
    const { resourceId, resourceType, dates, slot } = req.body

    // Convert ISO date strings to Date objects
    const parsedDates = dates.map(date => new Date(date))

    const result = await blockAvailability(resourceId, resourceType, parsedDates, slot)

    res.status(200).json({
      success: true,
      message: 'Availability blocked successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in blockAvailabilityController:', error)
    next(error)
  }
}

/**
 * Unblock availability (admin only)
 */
export const unblockAvailabilityController = async (req, res, next) => {
  try {
    const { resourceId, resourceType, dates, slot } = req.body

    // Convert ISO date strings to Date objects
    const parsedDates = dates.map(date => new Date(date))

    const result = await unblockAvailability(resourceId, resourceType, parsedDates, slot)

    res.status(200).json({
      success: true,
      message: 'Availability unblocked successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in unblockAvailabilityController:', error)
    next(error)
  }
}

/**
 * Get availability calendar (admin only)
 */
export const getAvailabilityCalendarController = async (req, res, next) => {
  try {
    const { resourceId, resourceType, startDate, endDate } = req.query

    // Convert ISO date strings to Date objects
    const parsedStartDate = startDate ? new Date(startDate) : undefined
    const parsedEndDate = endDate ? new Date(endDate) : undefined

    const result = await getAvailabilityCalendar(resourceId, resourceType, parsedStartDate, parsedEndDate)

    res.status(200).json({
      success: true,
      message: 'Availability calendar retrieved successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in getAvailabilityCalendarController:', error)
    next(error)
  }
}

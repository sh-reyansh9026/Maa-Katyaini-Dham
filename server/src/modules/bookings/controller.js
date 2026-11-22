import { createBooking, confirmBooking, rejectBooking, cancelBooking, getUserBookings, getBookingById, getAllBookings } from './service.js'
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js'
import logger from '../../utils/logger.js'

/**
 * Booking Controller - Handles HTTP requests for bookings
 */

/**
 * Create a new booking
 */
export const createBookingController = async (req, res, next) => {
  try {
    const userId = req.auth.userId

    const result = await createBooking(req.body, userId)

    res.status(201).json({
      success: true,
      message: result.isDuplicate ? 'Booking already exists (idempotent)' : 'Booking created successfully',
      data: {
        booking: result.booking,
        whatsapp: result.whatsapp,
      },
    })
  } catch (error) {
    logger.error('Error in createBookingController:', error)
    next(error)
  }
}

/**
 * Get current user's bookings
 */
export const getUserBookingsController = async (req, res, next) => {
  try {
    const userId = req.auth.userId

    const result = await getUserBookings(userId, req.query)

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in getUserBookingsController:', error)
    next(error)
  }
}

/**
 * Get booking by ID
 */
export const getBookingByIdController = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    const { id } = req.params

    const booking = await getBookingById(id, userId)

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking,
    })
  } catch (error) {
    logger.error('Error in getBookingByIdController:', error)
    next(error)
  }
}

/**
 * Confirm booking (admin only)
 */
export const confirmBookingController = async (req, res, next) => {
  try {
    const adminId = req.auth.userId
    const { id } = req.params
    const { upiReference, advanceReceived, notes } = req.body

    const booking = await confirmBooking(id, upiReference, advanceReceived, notes, adminId)

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking,
    })
  } catch (error) {
    logger.error('Error in confirmBookingController:', error)
    next(error)
  }
}

/**
 * Reject booking (admin only)
 */
export const rejectBookingController = async (req, res, next) => {
  try {
    const adminId = req.auth.userId
    const { id } = req.params
    const { notes } = req.body

    const booking = await rejectBooking(id, notes, adminId)

    res.status(200).json({
      success: true,
      message: 'Booking rejected successfully',
      data: booking,
    })
  } catch (error) {
    logger.error('Error in rejectBookingController:', error)
    next(error)
  }
}

/**
 * Cancel booking
 */
export const cancelBookingController = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    const { id } = req.params

    const booking = await cancelBooking(id, userId, 'user')

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    })
  } catch (error) {
    logger.error('Error in cancelBookingController:', error)
    next(error)
  }
}

/**
 * Cancel booking (admin only)
 */
export const cancelBookingAdminController = async (req, res, next) => {
  try {
    const adminId = req.auth.userId
    const { id } = req.params
    const { notes } = req.body

    const booking = await cancelBooking(id, adminId, 'admin')

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    })
  } catch (error) {
    logger.error('Error in cancelBookingAdminController:', error)
    next(error)
  }
}

/**
 * Get all bookings (admin only)
 */
export const getAllBookingsController = async (req, res, next) => {
  try {
    const result = await getAllBookings(req.query)

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in getAllBookingsController:', error)
    next(error)
  }
}

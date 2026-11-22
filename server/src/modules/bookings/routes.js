import express from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { authenticate } from '../../middlewares/auth.js'
import { requireAdmin } from '../../middlewares/auth.js'
import { validate } from '../../middlewares/validate.js'
import { createBookingSchema, updateBookingStatusSchema, getBookingSchema, queryBookingsSchema } from './validation.js'
import {
  createBookingController,
  getUserBookingsController,
  getBookingByIdController,
  confirmBookingController,
  rejectBookingController,
  cancelBookingController,
  cancelBookingAdminController,
  getAllBookingsController,
} from './controller.js'

const router = express.Router()

// POST /api/bookings - Create a new booking (authenticated)
router.post('/', authenticate, validate(createBookingSchema), asyncHandler(createBookingController))

// GET /api/bookings - Get user's bookings (authenticated)
router.get('/', authenticate, validate(queryBookingsSchema), asyncHandler(getUserBookingsController))

// GET /api/bookings/admin/all - Get all bookings (admin only) - must come before /:id
router.get('/admin/all', authenticate, requireAdmin, validate(queryBookingsSchema), asyncHandler(getAllBookingsController))

// GET /api/bookings/:id - Get booking by ID (authenticated)
router.get('/:id', authenticate, validate(getBookingSchema), asyncHandler(getBookingByIdController))

// POST /api/bookings/:id/confirm - Confirm booking (admin only)
router.post('/:id/confirm', authenticate, requireAdmin, validate(updateBookingStatusSchema), asyncHandler(confirmBookingController))

// POST /api/bookings/:id/reject - Reject booking (admin only)
router.post('/:id/reject', authenticate, requireAdmin, validate(updateBookingStatusSchema), asyncHandler(rejectBookingController))

// POST /api/bookings/:id/cancel - Cancel booking (authenticated)
router.post('/:id/cancel', authenticate, validate(updateBookingStatusSchema), asyncHandler(cancelBookingController))

// POST /api/bookings/:id/cancel/admin - Cancel booking (admin only)
router.post('/:id/cancel/admin', authenticate, requireAdmin, validate(updateBookingStatusSchema), asyncHandler(cancelBookingAdminController))

export default router

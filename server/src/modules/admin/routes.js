import express from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { authenticate } from '../../middlewares/auth.js'
import { requireAdmin } from '../../middlewares/auth.js'
import { validate } from '../../middlewares/validate.js'
import { z } from 'zod'
import {
  getDashboardStatsController,
  getBookingStatsController,
} from './controller.js'

const router = express.Router()

// Validation schema for booking stats
const bookingStatsSchema = {
  query: z.object({
    startDate: z.string().datetime('Invalid start date'),
    endDate: z.string().datetime('Invalid end date'),
  }),
}

// GET /api/admin/stats - Get admin dashboard stats (admin only)
router.get('/stats', authenticate, requireAdmin, asyncHandler(getDashboardStatsController))

// GET /api/admin/booking-stats - Get booking statistics for date range (admin only)
router.get('/booking-stats', authenticate, requireAdmin, validate(bookingStatsSchema), asyncHandler(getBookingStatsController))

export default router

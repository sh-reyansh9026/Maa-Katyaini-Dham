import express from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { authenticate } from '../../middlewares/auth.js'
import { requireAdmin } from '../../middlewares/auth.js'
import { validate } from '../../middlewares/validate.js'
import { checkAvailabilitySchema, blockAvailabilitySchema, queryAvailabilitySchema } from './validation.js'
import {
  checkAvailabilityController,
  blockAvailabilityController,
  unblockAvailabilityController,
  getAvailabilityCalendarController,
} from './controller.js'

const router = express.Router()

// GET /api/availability - Check availability (public)
router.get('/', validate(checkAvailabilitySchema), asyncHandler(checkAvailabilityController))

// POST /api/availability/block - Block availability (admin only)
router.post('/block', authenticate, requireAdmin, validate(blockAvailabilitySchema), asyncHandler(blockAvailabilityController))

// POST /api/availability/unblock - Unblock availability (admin only)
router.post('/unblock', authenticate, requireAdmin, validate(blockAvailabilitySchema), asyncHandler(unblockAvailabilityController))

// GET /api/availability/calendar - Get availability calendar (admin only)
router.get('/calendar', authenticate, requireAdmin, asyncHandler(getAvailabilityCalendarController))

export default router

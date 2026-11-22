import express from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { authenticate } from '../../middlewares/auth.js'
import { requireAdmin } from '../../middlewares/auth.js'
import { validate } from '../../middlewares/validate.js'
import { updateSettingsSchema } from './validation.js'
import {
  getPublicSettingsController,
  getAllSettingsController,
  updateSettingsController,
} from './controller.js'

const router = express.Router()

// GET /api/settings - Get public settings (public)
router.get('/', asyncHandler(getPublicSettingsController))

// GET /api/settings/admin - Get all settings (admin only)
router.get('/admin', authenticate, requireAdmin, asyncHandler(getAllSettingsController))

// PUT /api/settings - Update settings (admin only)
router.put('/', authenticate, requireAdmin, validate(updateSettingsSchema), asyncHandler(updateSettingsController))

export default router

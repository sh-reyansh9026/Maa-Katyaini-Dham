import express from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { handleClerkWebhook } from './controller.js'

const router = express.Router()

// POST /api/webhooks/clerk - Handle Clerk webhooks
router.post('/clerk', asyncHandler(handleClerkWebhook))

export default router

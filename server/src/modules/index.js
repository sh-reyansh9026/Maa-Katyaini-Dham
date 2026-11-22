import express from 'express'
import roomRoutes from './rooms/routes.js'
import hallRoutes from './halls/routes.js'
import bookingRoutes from './bookings/routes.js'
import availabilityRoutes from './availability/routes.js'
import adminRoutes from './admin/routes.js'
import settingsRoutes from './settings/routes.js'
import uploadRoutes from './uploads/routes.js'
import webhookRoutes from './webhooks/routes.js'

const router = express.Router()

router.use('/rooms', roomRoutes)
router.use('/halls', hallRoutes)
router.use('/bookings', bookingRoutes)
router.use('/availability', availabilityRoutes)
router.use('/admin', adminRoutes)
router.use('/settings', settingsRoutes)
router.use('/uploads', uploadRoutes)
router.use('/webhooks', webhookRoutes)

export default router

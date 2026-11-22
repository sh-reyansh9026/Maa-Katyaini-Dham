import mongoose from 'mongoose'
import Booking from '../modules/bookings/model.js'
import { releaseInventory } from '../modules/availability/service.js'
import logger from '../utils/logger.js'

/**
 * Booking Expiry Sweeper Job
 * Runs periodically to expire pending bookings that have passed their expiry time
 * This is a safety net - expiry is also checked lazily during reads/writes
 */

export const expirePendingBookings = async () => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const now = new Date()

    // Find all pending bookings that have expired
    const expiredBookings = await Booking.find({
      status: 'PENDING',
      expiresAt: { $lt: now },
    }).session(session)

    if (expiredBookings.length === 0) {
      logger.info('No expired bookings to process')
      await session.commitTransaction()
      return { processed: 0 }
    }

    logger.info(`Found ${expiredBookings.length} expired bookings to process`)

    let processed = 0

    for (const booking of expiredBookings) {
      try {
        // Release inventory
        await releaseInventory(
          booking.resourceId,
          booking.resourceType,
          booking.checkIn,
          booking.checkOut,
          booking.slot,
          session
        )

        // Update booking status
        booking.status = 'EXPIRED'
        booking.statusHistory.push({
          status: 'EXPIRED',
          actor: 'system',
          actorId: 'system',
          timestamp: new Date(),
        })

        await booking.save({ session })

        processed++
        logger.info(`Expired booking: ${booking.bookingId}`)
      } catch (error) {
        logger.error(`Error expiring booking ${booking.bookingId}:`, error)
        // Continue with other bookings even if one fails
      }
    }

    await session.commitTransaction()

    logger.info(`Booking expiry sweeper completed: ${processed} bookings expired`)
    return { processed }
  } catch (error) {
    await session.abortTransaction()
    logger.error('Error in booking expiry sweeper:', error)
    throw error
  } finally {
    session.endSession()
  }
}

/**
 * Run the sweeper job immediately (for testing or manual execution)
 */
export const runSweeper = async () => {
  try {
    logger.info('Starting booking expiry sweeper job')
    const result = await expirePendingBookings()
    logger.info('Booking expiry sweeper job completed', result)
    return result
  } catch (error) {
    logger.error('Booking expiry sweeper job failed:', error)
    throw error
  }
}

/**
 * Start the sweeper job as a cron job
 * This would typically be called during server startup
 */
export const startSweeperJob = (intervalMinutes = 5) => {
  const intervalMs = intervalMinutes * 60 * 1000

  logger.info(`Starting booking expiry sweeper job (interval: ${intervalMinutes} minutes)`)

  const intervalId = setInterval(async () => {
    try {
      await runSweeper()
    } catch (error) {
      logger.error('Sweeper job execution failed:', error)
    }
  }, intervalMs)

  return intervalId
}

// If this file is run directly, execute the sweeper once
if (import.meta.url === `file://${process.argv[1]}`) {
  runSweeper()
    .then(() => {
      logger.info('Sweeper execution completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Sweeper execution failed:', error)
      process.exit(1)
    })
}

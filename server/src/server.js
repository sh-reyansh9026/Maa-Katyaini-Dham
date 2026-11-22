import app from './app.js'
import logger from './utils/logger.js'
import { connectDB } from './config/db.js'
import { initRedis } from './config/redis.js'
import { startSweeperJob } from './jobs/bookingExpirySweeper.js'

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB()
    logger.info('MongoDB connected successfully')

    // Initialize Redis (optional, will fall back to in-memory if unavailable)
    await initRedis()
    logger.info('Redis initialized')

    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    // Start booking expiry sweeper job (runs every 5 minutes)
    let sweeperInterval = null
    if (process.env.NODE_ENV !== 'test') {
      sweeperInterval = startSweeperJob(5)
      logger.info('Booking expiry sweeper job started')
    }

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`)

      // Stop sweeper job
      if (sweeperInterval) {
        clearInterval(sweeperInterval)
        logger.info('Booking expiry sweeper job stopped')
      }

      server.close(async () => {
        logger.info('HTTP server closed')

        try {
          // Close MongoDB connection
          const mongoose = await import('mongoose')
          await mongoose.default.connection.close()
          logger.info('MongoDB connection closed')

          // Close Redis connection
          const { redisClient } = await import('./config/redis.js')
          if (redisClient) {
            await redisClient.quit()
            logger.info('Redis connection closed')
          }

          logger.info('Graceful shutdown completed')
          process.exit(0)
        } catch (error) {
          logger.error('Error during shutdown:', error)
          process.exit(1)
        }
      })

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

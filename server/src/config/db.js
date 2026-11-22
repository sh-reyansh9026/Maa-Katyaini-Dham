import mongoose from 'mongoose'
import logger from '../utils/logger.js'
import { env } from './env.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    logger.info(`MongoDB connected: ${conn.connection.host}`)

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })

    return conn
  } catch (error) {
    logger.error('MongoDB connection failed:', error)
    throw error
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    logger.info('MongoDB connection closed')
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error)
    throw error
  }
}

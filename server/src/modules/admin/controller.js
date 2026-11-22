import { getDashboardStats, getBookingStats } from './service.js'
import logger from '../../utils/logger.js'

/**
 * Admin Controller - Handles HTTP requests for admin operations
 */

/**
 * Get dashboard statistics (admin only)
 */
export const getDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await getDashboardStats()

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats,
    })
  } catch (error) {
    logger.error('Error in getDashboardStatsController:', error)
    next(error)
  }
}

/**
 * Get booking statistics for date range (admin only)
 */
export const getBookingStatsController = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required')
    }

    const stats = await getBookingStats(startDate, endDate)

    res.status(200).json({
      success: true,
      message: 'Booking stats retrieved successfully',
      data: stats,
    })
  } catch (error) {
    logger.error('Error in getBookingStatsController:', error)
    next(error)
  }
}

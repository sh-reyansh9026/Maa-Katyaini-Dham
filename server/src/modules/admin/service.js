import Booking from '../bookings/model.js'
import Room from '../rooms/model.js'
import Hall from '../halls/model.js'
import logger from '../../utils/logger.js'

/**
 * Admin Service - Handles admin dashboard statistics
 */

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Total bookings
    const totalBookings = await Booking.countDocuments()

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    // This month's bookings
    const thisMonthBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    // This year's bookings
    const thisYearBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfYear },
    })

    // Total revenue (from confirmed bookings)
    const revenueData = await Booking.aggregate([
      {
        $match: { status: 'CONFIRMED' },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalAdvance: { $sum: '$advanceReceived' },
        },
      },
    ])

    const revenue = revenueData[0] || { totalRevenue: 0, totalAdvance: 0 }

    // This month's revenue
    const thisMonthRevenueData = await Booking.aggregate([
      {
        $match: {
          status: 'CONFIRMED',
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalAdvance: { $sum: '$advanceReceived' },
        },
      },
    ])

    const thisMonthRevenue = thisMonthRevenueData[0] || { totalRevenue: 0, totalAdvance: 0 }

    // Total rooms and halls
    const totalRooms = await Room.countDocuments({ isActive: true })
    const totalHalls = await Hall.countDocuments({ isActive: true })

    // Recent bookings (last 10)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('bookingId userName userEmail resourceType resourceName status totalAmount createdAt')
      .lean()

    // Booking trends for last 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    return {
      overview: {
        totalBookings,
        thisMonthBookings,
        thisYearBookings,
        totalRooms,
        totalHalls,
      },
      revenue: {
        totalRevenue: revenue.totalRevenue,
        totalAdvance: revenue.totalAdvance,
        thisMonthRevenue: thisMonthRevenue.totalRevenue,
        thisMonthAdvance: thisMonthRevenue.totalAdvance,
      },
      bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      recentBookings,
      bookingTrends,
    }
  } catch (error) {
    logger.error('Error getting dashboard stats:', error)
    throw error
  }
}

/**
 * Get booking statistics for a date range
 */
export const getBookingStats = async (startDate, endDate) => {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const stats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalAdvance: { $sum: '$advanceReceived' },
        },
      },
    ])

    return stats
  } catch (error) {
    logger.error('Error getting booking stats:', error)
    throw error
  }
}

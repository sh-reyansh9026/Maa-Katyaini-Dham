import { clerkClient } from '@clerk/express'
import ApiError from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Verify Clerk session token and attach user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new ApiError(401, 'Authentication required')
    }

    const userId = req.auth.userId
    const user = await clerkClient.users.getUser(userId)

    req.user = {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.publicMetadata?.role || 'user',
    }

    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    next(new ApiError(401, 'Invalid or expired token'))
  }
}

/**
 * Check if user has admin role
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Admin access required')
  }
  next()
}

import Hall from './model.js'
import { initializeAvailability } from '../availability/service.js'
import { cache } from '../../config/redis.js'
import logger from '../../utils/logger.js'

/**
 * Halls Service - Handles hall operations with caching
 */

const CACHE_TTL = 300 // 5 minutes
const CACHE_PREFIX = 'halls:'

/**
 * Get all halls with filtering and pagination
 */
export const getAllHalls = async (query = {}) => {
  try {
    const { type, minCapacity, maxCapacity, page = 1, limit = 10 } = query

    // Build filter
    const filter = { isActive: true }
    if (type) filter.type = type
    if (minCapacity !== undefined) filter.capacity = { ...filter.capacity, $gte: minCapacity }
    if (maxCapacity !== undefined) filter.capacity = { ...filter.capacity, $lte: maxCapacity }

    // Try cache first for simple queries
    const cacheKey = `${CACHE_PREFIX}all:${JSON.stringify(filter)}:${page}:${limit}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      logger.info('Halls retrieved from cache')
      return cached
    }

    const halls = await Hall.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await Hall.countDocuments(filter)

    const result = {
      halls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }

    // Cache the result
    await cache.set(cacheKey, result, CACHE_TTL)

    return result
  } catch (error) {
    logger.error('Error getting all halls:', error)
    throw error
  }
}

/**
 * Get hall by ID
 */
export const getHallById = async (id) => {
  try {
    const cacheKey = `${CACHE_PREFIX}:${id}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      logger.info(`Hall ${id} retrieved from cache`)
      return cached
    }

    const hall = await Hall.findById(id).select('-__v').lean()

    if (!hall) {
      throw new Error('Hall not found')
    }

    // Cache the result
    await cache.set(cacheKey, hall, CACHE_TTL)

    return hall
  } catch (error) {
    logger.error('Error getting hall by ID:', error)
    throw error
  }
}

/**
 * Create a new hall
 */
export const createHall = async (hallData) => {
  try {
    const hall = await Hall.create(hallData)

    // Initialize availability for the new hall
    await initializeAvailability(hall._id, 'hall', hall.totalUnits)

    // Invalidate cache
    await cache.invalidatePattern(`${CACHE_PREFIX}*`)

    logger.info(`Hall created: ${hall._id}`)
    return hall
  } catch (error) {
    logger.error('Error creating hall:', error)
    throw error
  }
}

/**
 * Update a hall
 */
export const updateHall = async (id, updateData) => {
  try {
    const hall = await Hall.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v').lean()

    if (!hall) {
      throw new Error('Hall not found')
    }

    // If totalUnits changed, reinitialize availability
    if (updateData.totalUnits !== undefined) {
      await initializeAvailability(id, 'hall', updateData.totalUnits)
    }

    // Invalidate cache
    await cache.invalidatePattern(`${CACHE_PREFIX}*`)

    logger.info(`Hall updated: ${id}`)
    return hall
  } catch (error) {
    logger.error('Error updating hall:', error)
    throw error
  }
}

/**
 * Delete a hall (soft delete by setting isActive to false)
 */
export const deleteHall = async (id) => {
  try {
    const hall = await Hall.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean()

    if (!hall) {
      throw new Error('Hall not found')
    }

    // Invalidate cache
    await cache.invalidatePattern(`${CACHE_PREFIX}*`)

    logger.info(`Hall deleted: ${id}`)
    return hall
  } catch (error) {
    logger.error('Error deleting hall:', error)
    throw error
  }
}

/**
 * Get hall types for filters
 */
export const getHallTypes = async () => {
  try {
    const cacheKey = `${CACHE_PREFIX}types`
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached
    }

    const types = await Hall.distinct('type')
    
    await cache.set(cacheKey, types, CACHE_TTL * 2) // Cache longer for static data

    return types
  } catch (error) {
    logger.error('Error getting hall types:', error)
    throw error
  }
}

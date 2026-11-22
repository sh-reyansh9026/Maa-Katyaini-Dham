import Room from './model.js'
import { initializeAvailability } from '../availability/service.js'
import { cache } from '../../config/redis.js'
import logger from '../../utils/logger.js'

/**
 * Rooms Service - Handles room operations with caching
 */

const CACHE_TTL = 300 // 5 minutes
const CACHE_PREFIX = 'rooms:'

/**
 * Get all rooms with filtering and pagination
 */
export const getAllRooms = async (query = {}) => {
  try {
    const { type, minPrice, maxPrice, minGuests, page = 1, limit = 10 } = query

    // Build filter
    const filter = { isActive: true }
    if (type) filter.type = type
    if (minPrice !== undefined) filter.price = { ...filter.price, $gte: minPrice }
    if (maxPrice !== undefined) filter.price = { ...filter.price, $lte: maxPrice }
    if (minGuests !== undefined) filter.maxGuests = { $gte: minGuests }

    // Try cache first for simple queries
    const cacheKey = `${CACHE_PREFIX}all:${JSON.stringify(filter)}:${page}:${limit}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      logger.info('Rooms retrieved from cache')
      return cached
    }

    const rooms = await Room.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await Room.countDocuments(filter)

    const result = {
      rooms,
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
    logger.error('Error getting all rooms:', error)
    throw error
  }
}

/**
 * Get room by ID
 */
export const getRoomById = async (id) => {
  try {
    const cacheKey = `${CACHE_PREFIX}:${id}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      logger.info(`Room ${id} retrieved from cache`)
      return cached
    }

    const room = await Room.findById(id).select('-__v').lean()

    if (!room) {
      throw new Error('Room not found')
    }

    // Cache the result
    await cache.set(cacheKey, room, CACHE_TTL)

    return room
  } catch (error) {
    logger.error('Error getting room by ID:', error)
    throw error
  }
}

/**
 * Create a new room
 */
export const createRoom = async (roomData) => {
  try {
    const room = await Room.create(roomData)

    // Initialize availability for the new room
    await initializeAvailability(room._id, 'room', room.totalUnits)

    // Invalidate cache
    await cache.invalidatePattern(`${CACHE_PREFIX}*`)

    logger.info(`Room created: ${room._id}`)
    return room
  } catch (error) {
    logger.error('Error creating room:', error)
    throw error
  }
}

/**
 * Update a room
 */
export const updateRoom = async (id, updateData) => {
  try {
    const room = await Room.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v').lean()

    if (!room) {
      throw new Error('Room not found')
    }

    // If totalUnits changed, reinitialize availability
    if (updateData.totalUnits !== undefined) {
      await initializeAvailability(id, 'room', updateData.totalUnits)
    }

    // Invalidate cache
    await cache.invalidatePattern(`${CACHE_PREFIX}*`)

    logger.info(`Room updated: ${id}`)
    return room
  } catch (error) {
    logger.error('Error updating room:', error)
    throw error
  }
}

/**
 * Delete a room (soft delete by setting isActive to false)
 */
export const deleteRoom = async (id) => {
  try {
    const room = await Room.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean()

    if (!room) {
      throw new Error('Room not found')
    }

    // Invalidate cache
    await cache.invalidatePattern(`${CACHE_PREFIX}*`)

    logger.info(`Room deleted: ${id}`)
    return room
  } catch (error) {
    logger.error('Error deleting room:', error)
    throw error
  }
}

/**
 * Get room types for filters
 */
export const getRoomTypes = async () => {
  try {
    const cacheKey = `${CACHE_PREFIX}types`
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached
    }

    const types = await Room.distinct('type')
    
    await cache.set(cacheKey, types, CACHE_TTL * 2) // Cache longer for static data

    return types
  } catch (error) {
    logger.error('Error getting room types:', error)
    throw error
  }
}

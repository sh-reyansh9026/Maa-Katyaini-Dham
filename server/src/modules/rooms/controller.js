import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getRoomTypes } from './service.js'
import logger from '../../utils/logger.js'

/**
 * Rooms Controller - Handles HTTP requests for rooms
 */

/**
 * Get all rooms (public)
 */
export const getAllRoomsController = async (req, res, next) => {
  try {
    const result = await getAllRooms(req.query)

    res.status(200).json({
      success: true,
      message: 'Rooms retrieved successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in getAllRoomsController:', error)
    next(error)
  }
}

/**
 * Get room by ID (public)
 */
export const getRoomByIdController = async (req, res, next) => {
  try {
    const { id } = req.params

    const room = await getRoomById(id)

    res.status(200).json({
      success: true,
      message: 'Room retrieved successfully',
      data: room,
    })
  } catch (error) {
    logger.error('Error in getRoomByIdController:', error)
    next(error)
  }
}

/**
 * Create a new room (admin only)
 */
export const createRoomController = async (req, res, next) => {
  try {
    const room = await createRoom(req.body)

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    })
  } catch (error) {
    logger.error('Error in createRoomController:', error)
    next(error)
  }
}

/**
 * Update a room (admin only)
 */
export const updateRoomController = async (req, res, next) => {
  try {
    const { id } = req.params

    const room = await updateRoom(id, req.body)

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room,
    })
  } catch (error) {
    logger.error('Error in updateRoomController:', error)
    next(error)
  }
}

/**
 * Delete a room (admin only)
 */
export const deleteRoomController = async (req, res, next) => {
  try {
    const { id } = req.params

    const room = await deleteRoom(id)

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      data: room,
    })
  } catch (error) {
    logger.error('Error in deleteRoomController:', error)
    next(error)
  }
}

/**
 * Get room types (public)
 */
export const getRoomTypesController = async (req, res, next) => {
  try {
    const types = await getRoomTypes()

    res.status(200).json({
      success: true,
      message: 'Room types retrieved successfully',
      data: types,
    })
  } catch (error) {
    logger.error('Error in getRoomTypesController:', error)
    next(error)
  }
}

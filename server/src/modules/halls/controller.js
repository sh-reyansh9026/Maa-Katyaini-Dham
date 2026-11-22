import { getAllHalls, getHallById, createHall, updateHall, deleteHall, getHallTypes } from './service.js'
import logger from '../../utils/logger.js'

/**
 * Halls Controller - Handles HTTP requests for halls
 */

/**
 * Get all halls (public)
 */
export const getAllHallsController = async (req, res, next) => {
  try {
    const result = await getAllHalls(req.query)

    res.status(200).json({
      success: true,
      message: 'Halls retrieved successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in getAllHallsController:', error)
    next(error)
  }
}

/**
 * Get hall by ID (public)
 */
export const getHallByIdController = async (req, res, next) => {
  try {
    const { id } = req.params

    const hall = await getHallById(id)

    res.status(200).json({
      success: true,
      message: 'Hall retrieved successfully',
      data: hall,
    })
  } catch (error) {
    logger.error('Error in getHallByIdController:', error)
    next(error)
  }
}

/**
 * Create a new hall (admin only)
 */
export const createHallController = async (req, res, next) => {
  try {
    const hall = await createHall(req.body)

    res.status(201).json({
      success: true,
      message: 'Hall created successfully',
      data: hall,
    })
  } catch (error) {
    logger.error('Error in createHallController:', error)
    next(error)
  }
}

/**
 * Update a hall (admin only)
 */
export const updateHallController = async (req, res, next) => {
  try {
    const { id } = req.params

    const hall = await updateHall(id, req.body)

    res.status(200).json({
      success: true,
      message: 'Hall updated successfully',
      data: hall,
    })
  } catch (error) {
    logger.error('Error in updateHallController:', error)
    next(error)
  }
}

/**
 * Delete a hall (admin only)
 */
export const deleteHallController = async (req, res, next) => {
  try {
    const { id } = req.params

    const hall = await deleteHall(id)

    res.status(200).json({
      success: true,
      message: 'Hall deleted successfully',
      data: hall,
    })
  } catch (error) {
    logger.error('Error in deleteHallController:', error)
    next(error)
  }
}

/**
 * Get hall types (public)
 */
export const getHallTypesController = async (req, res, next) => {
  try {
    const types = await getHallTypes()

    res.status(200).json({
      success: true,
      message: 'Hall types retrieved successfully',
      data: types,
    })
  } catch (error) {
    logger.error('Error in getHallTypesController:', error)
    next(error)
  }
}

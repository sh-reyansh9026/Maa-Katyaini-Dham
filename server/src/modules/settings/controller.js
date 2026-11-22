import { getPublicSettings, getAllSettings, updateSettings } from './service.js'
import logger from '../../utils/logger.js'

/**
 * Settings Controller - Handles HTTP requests for settings
 */

/**
 * Get public settings (public)
 */
export const getPublicSettingsController = async (req, res, next) => {
  try {
    const settings = await getPublicSettings()

    res.status(200).json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settings,
    })
  } catch (error) {
    logger.error('Error in getPublicSettingsController:', error)
    next(error)
  }
}

/**
 * Get all settings (admin only)
 */
export const getAllSettingsController = async (req, res, next) => {
  try {
    const settings = await getAllSettings()

    res.status(200).json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settings,
    })
  } catch (error) {
    logger.error('Error in getAllSettingsController:', error)
    next(error)
  }
}

/**
 * Update settings (admin only)
 */
export const updateSettingsController = async (req, res, next) => {
  try {
    const settings = await updateSettings(req.body)

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    })
  } catch (error) {
    logger.error('Error in updateSettingsController:', error)
    next(error)
  }
}

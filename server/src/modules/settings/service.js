import Settings from './model.js'
import { cache } from '../../config/redis.js'
import logger from '../../utils/logger.js'

/**
 * Settings Service - Handles settings operations with caching
 */

const CACHE_TTL = 600 // 10 minutes for settings
const CACHE_PREFIX = 'settings:'

/**
 * Get public settings (cached)
 */
export const getPublicSettings = async () => {
  try {
    const cacheKey = `${CACHE_PREFIX}public`
    const cached = await cache.get(cacheKey)
    if (cached) {
      logger.info('Public settings retrieved from cache')
      return cached
    }

    const settings = await Settings.getSettings()

    // Return only public-facing settings
    const publicSettings = {
      whatsappOwnerNumber: settings.whatsappOwnerNumber,
      advancePaymentPercentage: settings.advancePaymentPercentage,
      bookingHoldDurationMinutes: settings.bookingHoldDurationMinutes,
      checkInTime: settings.checkInTime,
      checkOutTime: settings.checkOutTime,
      cancellationPolicy: settings.cancellationPolicy,
      idProofRequirement: settings.idProofRequirement,
      hallUsageRules: settings.hallUsageRules,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      socialMedia: settings.socialMedia,
    }

    // Cache the result
    await cache.set(cacheKey, publicSettings, CACHE_TTL)

    return publicSettings
  } catch (error) {
    logger.error('Error getting public settings:', error)
    throw error
  }
}

/**
 * Get all settings (admin only)
 */
export const getAllSettings = async () => {
  try {
    const settings = await Settings.getSettings()
    return settings
  } catch (error) {
    logger.error('Error getting all settings:', error)
    throw error
  }
}

/**
 * Update settings (admin only)
 */
export const updateSettings = async (updateData) => {
  try {
    const settings = await Settings.getSettings()

    Object.assign(settings, updateData)
    await settings.save()

    // Invalidate cache
    await cache.invalidatePattern(`${CACHE_PREFIX}*`)

    logger.info('Settings updated')
    return settings
  } catch (error) {
    logger.error('Error updating settings:', error)
    throw error
  }
}

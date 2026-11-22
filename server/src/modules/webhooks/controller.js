import { Webhook } from 'svix'
import { env } from '../../config/env.js'
import logger from '../../utils/logger.js'
import { clerkClient } from '@clerk/express'

/**
 * Handle Clerk webhooks for user sync
 */
export const handleClerkWebhook = async (req, res) => {
  try {
    const webhookSecret = env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET is not configured')
    }

    const payload = JSON.stringify(req.body)
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    }

    const wh = new Webhook(webhookSecret)
    const evt = wh.verify(payload, headers)

    const { id } = evt.data
    const eventType = evt.type

    logger.info(`Webhook received: ${eventType} for user ${id}`)

    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        logger.info(`Unhandled event type: ${eventType}`)
    }

    res.status(200).json({ success: true, message: 'Webhook processed' })
  } catch (error) {
    logger.error('Webhook processing error:', error)
    res.status(400).json({ success: false, message: 'Invalid webhook' })
  }
}

/**
 * Handle user creation
 */
const handleUserCreated = async (userData) => {
  try {
    const { id, email_addresses, first_name, last_name, public_metadata } = userData
    
    logger.info(`User created: ${id}, email: ${email_addresses[0]?.email_address}`)
    
    // Here you could create a user record in your database if needed
    // For now, we rely on Clerk for user management and just sync metadata
    
    if (public_metadata?.role === 'admin') {
      logger.info(`Admin user created: ${id}`)
    }
  } catch (error) {
    logger.error('Error handling user created:', error)
    throw error
  }
}

/**
 * Handle user update
 */
const handleUserUpdated = async (userData) => {
  try {
    const { id, email_addresses, first_name, last_name, public_metadata } = userData
    
    logger.info(`User updated: ${id}, email: ${email_addresses[0]?.email_address}`)
    
    // Update user in your database if needed
    // Sync role changes
    if (public_metadata?.role) {
      logger.info(`User role updated: ${id}, role: ${public_metadata.role}`)
    }
  } catch (error) {
    logger.error('Error handling user updated:', error)
    throw error
  }
}

/**
 * Handle user deletion
 */
const handleUserDeleted = async (userData) => {
  try {
    const { id } = userData
    
    logger.info(`User deleted: ${id}`)
    
    // Cancel all pending bookings for this user
    // Or mark user as inactive in your database
  } catch (error) {
    logger.error('Error handling user deleted:', error)
    throw error
  }
}

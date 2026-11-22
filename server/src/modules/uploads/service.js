import { uploadImage, deleteImage, generateUploadSignature } from '../../config/cloudinary.js'
import logger from '../../utils/logger.js'

/**
 * Uploads Service - Handles image upload operations
 */

/**
 * Upload an image from base64 or URL
 */
export const uploadImageService = async (imageData, folder = 'maa-katyaini-dham') => {
  try {
    const result = await uploadImage(imageData, folder)
    return result
  } catch (error) {
    logger.error('Error in uploadImageService:', error)
    throw error
  }
}

/**
 * Delete an image
 */
export const deleteImageService = async (publicId) => {
  try {
    const result = await deleteImage(publicId)
    return result
  } catch (error) {
    logger.error('Error in deleteImageService:', error)
    throw error
  }
}

/**
 * Generate upload signature for client-side upload
 */
export const generateUploadSignatureService = async (folder = 'maa-katyaini-dham') => {
  try {
    const signature = await generateUploadSignature(folder)
    return signature
  } catch (error) {
    logger.error('Error in generateUploadSignatureService:', error)
    throw error
  }
}

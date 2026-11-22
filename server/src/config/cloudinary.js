import { v2 as cloudinary } from 'cloudinary'
import { env } from './env.js'
import logger from '../utils/logger.js'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

/**
 * Upload image to Cloudinary with signed upload
 */
export const uploadImage = async (file, folder = 'maa-katyaini-dham') => {
  try {
    logger.info('Uploading image to Cloudinary, folder:', folder)
    logger.info('Image data length:', file.length)

    const result = await cloudinary.uploader.upload(file, {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })

    logger.info('Image uploaded successfully:', result.public_id)
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    logger.error('Cloudinary upload error:', error.message)
    logger.error('Cloudinary error details:', error)
    throw new Error('Failed to upload image: ' + error.message)
  }
}

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    logger.info('Image deleted successfully:', publicId)
    return result
  } catch (error) {
    logger.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

/**
 * Generate signed upload parameters for client-side upload
 */
export const generateUploadSignature = async (folder = 'maa-katyaini-dham') => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const params = {
      timestamp,
      folder,
      allowed_formats: 'jpg,jpeg,png,webp',
      transformation: 'q_auto,f_auto',
    }

    const signature = cloudinary.utils.api_sign_request(
      params,
      env.CLOUDINARY_API_SECRET
    )

    return {
      signature,
      timestamp,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder,
    }
  } catch (error) {
    logger.error('Failed to generate upload signature:', error)
    throw new Error('Failed to generate upload signature')
  }
}

export default cloudinary

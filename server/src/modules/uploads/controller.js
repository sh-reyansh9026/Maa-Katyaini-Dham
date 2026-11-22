import { uploadImageService, deleteImageService, generateUploadSignatureService } from './service.js'
import logger from '../../utils/logger.js'

/**
 * Uploads Controller - Handles HTTP requests for image uploads
 */

/**
 * Upload an image (admin only)
 */
export const uploadImageController = async (req, res, next) => {
  try {
    let imageData = req.body.image
    const folder = req.body.folder || 'maa-katyaini-dham'

    // If file was uploaded via multer (FormData), convert to base64
    if (req.file) {
      imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    }

    if (!imageData) {
      throw new Error('Image data is required')
    }

    const result = await uploadImageService(imageData, folder)

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in uploadImageController:', error)
    next(error)
  }
}

/**
 * Delete an image (admin only)
 */
export const deleteImageController = async (req, res, next) => {
  try {
    const { publicId } = req.body

    if (!publicId) {
      throw new Error('Public ID is required')
    }

    const result = await deleteImageService(publicId)

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result,
    })
  } catch (error) {
    logger.error('Error in deleteImageController:', error)
    next(error)
  }
}

/**
 * Generate upload signature (admin only)
 */
export const generateUploadSignatureController = async (req, res, next) => {
  try {
    const { folder } = req.query

    const signature = await generateUploadSignatureService(folder)

    res.status(200).json({
      success: true,
      message: 'Upload signature generated successfully',
      data: signature,
    })
  } catch (error) {
    logger.error('Error in generateUploadSignatureController:', error)
    next(error)
  }
}

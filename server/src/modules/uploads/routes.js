import express from 'express'
import multer from 'multer'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { authenticate } from '../../middlewares/auth.js'
import { requireAdmin } from '../../middlewares/auth.js'
import { validate } from '../../middlewares/validate.js'
import { uploadImageSchema, deleteImageSchema } from './validation.js'
import {
  uploadImageController,
  deleteImageController,
  generateUploadSignatureController,
} from './controller.js'

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// POST /api/uploads - Upload image to Cloudinary (admin only)
router.post('/', authenticate, requireAdmin, upload.single('image'), asyncHandler(uploadImageController))

// DELETE /api/uploads - Delete image from Cloudinary (admin only)
router.delete('/', authenticate, requireAdmin, validate(deleteImageSchema), asyncHandler(deleteImageController))

// GET /api/uploads/signature - Generate upload signature (admin only)
router.get('/signature', authenticate, requireAdmin, asyncHandler(generateUploadSignatureController))

export default router

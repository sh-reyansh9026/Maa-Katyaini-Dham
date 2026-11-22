import { z } from 'zod'

/**
 * Validation schemas for Upload operations
 */

export const uploadImageSchema = {
  body: z.object({
    image: z.string().min(1, 'Image data is required'),
    folder: z.string().optional(),
  }),
}

export const deleteImageSchema = {
  body: z.object({
    publicId: z.string().min(1, 'Public ID is required'),
  }),
}

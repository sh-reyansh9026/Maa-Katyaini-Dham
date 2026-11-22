import { z } from 'zod'

/**
 * Validation schemas for Room operations
 */

export const createRoomSchema = {
  body: z.object({
    name: z.string().min(1, 'Room name is required').max(100, 'Room name too long'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
    type: z.enum(['AC', 'Non-AC', 'Family', 'Dormitory'], {
      errorMap: () => ({ message: 'Invalid room type' }),
    }),
    price: z.number().min(0, 'Price cannot be negative'),
    maxGuests: z.number().min(1, 'At least 1 guest required'),
    totalUnits: z.number().min(1, 'At least 1 unit required'),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.object({
      publicId: z.string().min(1, 'Public ID is required'),
      url: z.string().url('Invalid image URL'),
    })).min(1, 'At least one image is required'),
    isActive: z.boolean().optional(),
  }),
}

export const updateRoomSchema = {
  body: z.object({
    name: z.string().min(1, 'Room name is required').max(100, 'Room name too long').optional(),
    description: z.string().min(1, 'Description is required').max(1000, 'Description too long').optional(),
    type: z.enum(['AC', 'Non-AC', 'Family', 'Dormitory'], {
      errorMap: () => ({ message: 'Invalid room type' }),
    }).optional(),
    price: z.number().min(0, 'Price cannot be negative').optional(),
    maxGuests: z.number().min(1, 'At least 1 guest required').optional(),
    totalUnits: z.number().min(1, 'At least 1 unit required').optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.object({
      publicId: z.string().min(1, 'Public ID is required'),
      url: z.string().url('Invalid image URL'),
    })).optional(),
    isActive: z.boolean().optional(),
  }),
}

export const getRoomSchema = {
  params: z.object({
    id: z.string().min(1, 'Room ID is required'),
  }),
}

export const queryRoomsSchema = {
  query: z.object({
    type: z.enum(['AC', 'Non-AC', 'Family', 'Dormitory']).optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    minGuests: z.number().min(1).optional(),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  }),
}

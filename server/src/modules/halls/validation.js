import { z } from 'zod'

/**
 * Validation schemas for Hall operations
 */

export const createHallSchema = {
  body: z.object({
    name: z.string().min(1, 'Hall name is required').max(100, 'Hall name too long'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
    type: z.enum(['Wedding', 'Ceremony', 'Conference', 'General'], {
      errorMap: () => ({ message: 'Invalid hall type' }),
    }),
    capacity: z.number().min(1, 'At least 1 person required'),
    priceMorning: z.number().min(0, 'Price cannot be negative'),
    priceEvening: z.number().min(0, 'Price cannot be negative'),
    priceFullDay: z.number().min(0, 'Price cannot be negative'),
    totalUnits: z.number().min(1, 'At least 1 unit required'),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.object({
      publicId: z.string().min(1, 'Public ID is required'),
      url: z.string().url('Invalid image URL'),
    })).min(1, 'At least one image is required'),
    isActive: z.boolean().optional(),
  }),
}

export const updateHallSchema = {
  body: z.object({
    name: z.string().min(1, 'Hall name is required').max(100, 'Hall name too long').optional(),
    description: z.string().min(1, 'Description is required').max(1000, 'Description too long').optional(),
    type: z.enum(['Wedding', 'Ceremony', 'Conference', 'General'], {
      errorMap: () => ({ message: 'Invalid hall type' }),
    }).optional(),
    capacity: z.number().min(1, 'At least 1 person required').optional(),
    priceMorning: z.number().min(0, 'Price cannot be negative').optional(),
    priceEvening: z.number().min(0, 'Price cannot be negative').optional(),
    priceFullDay: z.number().min(0, 'Price cannot be negative').optional(),
    totalUnits: z.number().min(1, 'At least 1 unit required').optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.object({
      publicId: z.string().min(1, 'Public ID is required'),
      url: z.string().url('Invalid image URL'),
    })).optional(),
    isActive: z.boolean().optional(),
  }),
}

export const getHallSchema = {
  params: z.object({
    id: z.string().min(1, 'Hall ID is required'),
  }),
}

export const queryHallsSchema = {
  query: z.object({
    type: z.enum(['Wedding', 'Ceremony', 'Conference', 'General']).optional(),
    minCapacity: z.number().min(1).optional(),
    maxCapacity: z.number().min(1).optional(),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  }),
}

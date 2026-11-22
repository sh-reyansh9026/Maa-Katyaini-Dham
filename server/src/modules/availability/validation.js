import { z } from 'zod'

/**
 * Validation schemas for Availability operations
 */

export const checkAvailabilitySchema = {
  query: z.object({
    resourceId: z.string().min(1, 'Resource ID is required'),
    resourceType: z.enum(['room', 'hall'], {
      errorMap: () => ({ message: 'Resource type must be room or hall' }),
    }),
    checkIn: z.string().datetime('Invalid check-in date').optional(),
    checkOut: z.string().datetime('Invalid check-out date').optional(),
    slot: z.enum(['MORNING', 'EVENING', 'FULL_DAY'], {
      errorMap: () => ({ message: 'Invalid slot' }),
    }).optional(),
  }),
}

export const createAvailabilitySchema = {
  body: z.object({
    resourceId: z.string().min(1, 'Resource ID is required'),
    resourceType: z.enum(['room', 'hall'], {
      errorMap: () => ({ message: 'Resource type must be room or hall' }),
    }),
    date: z.string().datetime('Invalid date'),
    slot: z.enum(['MORNING', 'EVENING', 'FULL_DAY', 'NONE'], {
      errorMap: () => ({ message: 'Invalid slot' }),
    }),
    totalUnits: z.number().min(0, 'Total units cannot be negative'),
    bookedUnits: z.number().min(0, 'Booked units cannot be negative').default(0),
    isManuallyBlocked: z.boolean().optional(),
  }),
}

export const updateAvailabilitySchema = {
  params: z.object({
    id: z.string().min(1, 'Availability ID is required'),
  }),
  body: z.object({
    totalUnits: z.number().min(0, 'Total units cannot be negative').optional(),
    bookedUnits: z.number().min(0, 'Booked units cannot be negative').optional(),
    isManuallyBlocked: z.boolean().optional(),
  }),
}

export const queryAvailabilitySchema = {
  query: z.object({
    resourceId: z.string().optional(),
    resourceType: z.enum(['room', 'hall']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    slot: z.enum(['MORNING', 'EVENING', 'FULL_DAY', 'NONE']).optional(),
  }),
}

export const blockAvailabilitySchema = {
  body: z.object({
    resourceId: z.string().min(1, 'Resource ID is required'),
    resourceType: z.enum(['room', 'hall'], {
      errorMap: () => ({ message: 'Resource type must be room or hall' }),
    }),
    dates: z.array(z.string()).min(1, 'At least one date is required'),
    slot: z.enum(['MORNING', 'EVENING', 'FULL_DAY', 'NONE'], {
      errorMap: () => ({ message: 'Invalid slot' }),
    }).optional(),
  }),
}

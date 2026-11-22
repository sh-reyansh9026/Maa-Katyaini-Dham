import { z } from 'zod'

/**
 * Validation schemas for Booking operations
 */

export const createBookingSchema = {
  body: z.object({
    resourceType: z.enum(['room', 'hall'], {
      errorMap: () => ({ message: 'Resource type must be room or hall' }),
    }),
    resourceId: z.string().min(1, 'Resource ID is required'),
    checkIn: z.string().datetime('Invalid check-in date'),
    checkOut: z.string().datetime('Invalid check-out date').optional(),
    slot: z.enum(['MORNING', 'EVENING', 'FULL_DAY'], {
      errorMap: () => ({ message: 'Invalid slot' }),
    }).optional(),
    guests: z.number().min(1, 'At least 1 guest required'),
    userName: z.string().min(1, 'User name is required').max(100, 'Name too long'),
    userEmail: z.string().email('Invalid email address'),
    userPhone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
    idempotencyKey: z.string().min(1, 'Idempotency key is required').optional(),
  }).refine((data) => {
    // If room, checkOut is required. If hall, slot is required.
    if (data.resourceType === 'room' && !data.checkOut) {
      return false
    }
    if (data.resourceType === 'hall' && !data.slot) {
      return false
    }
    return true
  }, {
    message: 'Rooms require checkOut date, halls require slot',
  }).refine((data) => {
    // Validate date range for rooms
    if (data.resourceType === 'room' && data.checkIn && data.checkOut) {
      const checkIn = new Date(data.checkIn)
      const checkOut = new Date(data.checkOut)
      return checkOut > checkIn
    }
    return true
  }, {
    message: 'Check-out date must be after check-in date',
  }),
}

export const updateBookingStatusSchema = {
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
  body: z.object({
    status: z.enum(['CONFIRMED', 'REJECTED', 'CANCELLED'], {
      errorMap: () => ({ message: 'Invalid status' }),
    }),
    upiReference: z.string().min(1, 'UPI reference is required').optional(),
    advanceReceived: z.number().min(0, 'Advance received cannot be negative').optional(),
    notes: z.string().max(500, 'Notes too long').optional(),
  }).refine((data) => {
    // If confirming, UPI reference and advance received are required
    if (data.status === 'CONFIRMED') {
      return !!data.upiReference && data.advanceReceived !== undefined && data.advanceReceived !== null
    }
    return true
  }, {
    message: 'UPI reference and advance received are required for confirmation',
  }),
}

export const getBookingSchema = {
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
}

export const queryBookingsSchema = {
  query: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED']).optional(),
    resourceId: z.string().optional(),
    resourceType: z.enum(['room', 'hall']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  }),
}

export const checkAvailabilitySchema = {
  query: z.object({
    resourceType: z.enum(['room', 'hall'], {
      errorMap: () => ({ message: 'Resource type must be room or hall' }),
    }),
    resourceId: z.string().min(1, 'Resource ID is required'),
    checkIn: z.string().datetime('Invalid check-in date'),
    checkOut: z.string().datetime('Invalid check-out date').optional(),
    slot: z.enum(['MORNING', 'EVENING', 'FULL_DAY'], {
      errorMap: () => ({ message: 'Invalid slot' }),
    }).optional(),
  }).refine((data) => {
    // If room, checkOut is required. If hall, slot is required.
    if (data.resourceType === 'room' && !data.checkOut) {
      return false
    }
    if (data.resourceType === 'hall' && !data.slot) {
      return false
    }
    return true
  }, {
    message: 'Rooms require checkOut date, halls require slot',
  }),
}

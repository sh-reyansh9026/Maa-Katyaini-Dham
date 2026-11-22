import { z } from 'zod'

/**
 * Validation schemas for Settings operations
 */

export const updateSettingsSchema = {
  body: z.object({
    whatsappOwnerNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long').optional(),
    advancePaymentPercentage: z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100').optional(),
    bookingHoldDurationMinutes: z.number().min(1, 'Hold duration must be at least 1 minute').optional(),
    checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
    checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
    cancellationPolicy: z.string().max(1000, 'Policy too long').optional(),
    idProofRequirement: z.string().max(500, 'Requirement too long').optional(),
    hallUsageRules: z.string().max(500, 'Rules too long').optional(),
    contactEmail: z.string().email('Invalid email').optional(),
    contactPhone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long').optional(),
    address: z.string().max(200, 'Address too long').optional(),
    socialMedia: z.object({
      facebook: z.string().url('Invalid Facebook URL').optional(),
      instagram: z.string().url('Invalid Instagram URL').optional(),
      twitter: z.string().url('Invalid Twitter URL').optional(),
    }).optional(),
  }),
}

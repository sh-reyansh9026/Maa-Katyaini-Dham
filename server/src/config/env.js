import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  
  // MongoDB
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  
  // Clerk
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key is required'),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary cloud name is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API key is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'Cloudinary API secret is required'),
  
  // Redis (optional)
  REDIS_URL: z.string().optional(),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Booking settings
  BOOKING_HOLD_DURATION_MINUTES: z.string().default('30'),
  ADVANCE_PAYMENT_PERCENTAGE: z.string().default('25'),
  WHATSAPP_OWNER_NUMBER: z.string().default(''),
})

const validateEnv = () => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('Environment validation error:', error.errors)
    throw new Error('Invalid environment variables')
  }
}

export const env = validateEnv()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import hpp from 'hpp'
import expressMongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import { clerkMiddleware } from '@clerk/express'
import logger from './utils/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'
import { requestId } from './middlewares/requestId.js'
import apiRoutes from './modules/index.js'

const app = express()

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}))
app.use(expressMongoSanitize())
app.use(hpp())

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression
app.use(compression())

// Request ID middleware
app.use(requestId)

// Clerk authentication middleware
app.use(clerkMiddleware())

// Logging middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    requestId: req.id,
  })
  next()
})

// Multer configuration for file uploads (memory storage)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  },
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_URL ? undefined : 'memory', // Use Redis if available, otherwise memory
})

app.use('/api/', limiter)

// Stricter rate limiting for booking creation
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 booking requests per minute
  message: 'Too many booking requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_URL ? undefined : 'memory',
})

app.use('/api/bookings', bookingLimiter)

// Root health check endpoint (for Render and other health checks)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Maa Katyaini Dham API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use('/api', apiRoutes)

// 404 handler
app.use(notFound)

// Global error handler
app.use(errorHandler)

export default app

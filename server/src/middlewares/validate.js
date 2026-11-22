import { z } from 'zod'
import ApiError from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Validation middleware using Zod schemas
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body)
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query)
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params)
      }
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        logger.error('Validation error:', errors)
        throw new ApiError(400, 'Validation failed', errors)
      }
      next(error)
    }
  }
}

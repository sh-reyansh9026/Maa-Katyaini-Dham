import { randomUUID } from 'crypto'

/**
 * Request ID middleware - adds unique ID to each request for tracing
 */
export const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID()
  res.setHeader('X-Request-ID', req.id)
  next()
}

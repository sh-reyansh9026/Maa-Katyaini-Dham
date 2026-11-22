/**
 * Custom API Error class for consistent error responses
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.errors = errors
    this.success = false
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError

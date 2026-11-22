/**
 * Standard API Response class for consistent success responses
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode
    this.success = true
    this.message = message
    this.data = data
  }

  static success(statusCode, data, message) {
    return new ApiResponse(statusCode, data, message)
  }
}

export default ApiResponse

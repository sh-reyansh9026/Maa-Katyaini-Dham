const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * API client for making HTTP requests
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`
    
    // Try to get Clerk token from window
    let token = null
    try {
      if (window.Clerk && window.Clerk.session) {
        token = await window.Clerk.session.getToken()
      }
    } catch (e) {
      console.log('Could not get Clerk token:', e)
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.message || error.error || 'Something went wrong'
        // Include validation details if available
        if (error.details) {
          throw new Error(`${errorMessage}: ${JSON.stringify(error.details)}`)
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const config = {
      ...options,
      method: 'POST',
      headers,
    }

    // If data is FormData, let the browser set the Content-Type
    if (data instanceof FormData) {
      delete headers['Content-Type']
      config.body = data
    } else {
      config.body = JSON.stringify(data)
    }

    return this.request(endpoint, config)
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

export const api = new ApiClient(API_URL)

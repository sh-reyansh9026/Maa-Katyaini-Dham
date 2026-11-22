import { api } from '../../lib/api'

export const adminApi = {
  getStats: () => {
    return api.get('/admin/stats')
  },

  getBookingStats: (params) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )
    const queryString = new URLSearchParams(filteredParams).toString()
    return api.get(`/admin/booking-stats${queryString ? `?${queryString}` : ''}`)
  },
}

export const adminBookingsApi = {
  getAll: (params = {}) => {
    // Filter out empty, undefined, or null values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )
    const queryString = new URLSearchParams(filteredParams).toString()
    return api.get(`/bookings/admin/all${queryString ? `?${queryString}` : ''}`)
  },

  confirm: (id, data) => {
    return api.post(`/bookings/${id}/confirm`, {
      ...data,
      status: 'CONFIRMED'
    })
  },

  reject: (id, data) => {
    return api.post(`/bookings/${id}/reject`, {
      ...data,
      status: 'REJECTED'
    })
  },

  cancel: (id, data) => {
    return api.post(`/bookings/${id}/cancel/admin`, {
      ...data,
      status: 'CANCELLED'
    })
  },
}

export const adminRoomsApi = {
  getAll: (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )
    const queryString = new URLSearchParams(filteredParams).toString()
    return api.get(`/rooms${queryString ? `?${queryString}` : ''}`)
  },

  create: (data) => {
    return api.post('/rooms', data)
  },

  update: (id, data) => {
    return api.put(`/rooms/${id}`, data)
  },

  delete: (id) => {
    return api.delete(`/rooms/${id}`)
  },
}

export const adminHallsApi = {
  getAll: (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )
    const queryString = new URLSearchParams(filteredParams).toString()
    return api.get(`/halls${queryString ? `?${queryString}` : ''}`)
  },

  create: (data) => {
    return api.post('/halls', data)
  },

  update: (id, data) => {
    return api.put(`/halls/${id}`, data)
  },

  delete: (id) => {
    return api.delete(`/halls/${id}`)
  },
}

export const adminSettingsApi = {
  get: () => {
    return api.get('/settings/admin')
  },

  update: (data) => {
    return api.put('/settings', data)
  },
}

export const adminAvailabilityApi = {
  getCalendar: (params) => {
    // Convert date strings to ISO format for the API
    const formattedParams = { ...params }
    if (params.startDate) {
      const startDate = new Date(params.startDate)
      startDate.setHours(0, 0, 0, 0)
      formattedParams.startDate = startDate.toISOString()
    }
    if (params.endDate) {
      const endDate = new Date(params.endDate)
      endDate.setHours(23, 59, 59, 999)
      formattedParams.endDate = endDate.toISOString()
    }
    const queryString = new URLSearchParams(formattedParams).toString()
    return api.get(`/availability/calendar${queryString ? `?${queryString}` : ''}`)
  },

  block: (data) => {
    // Convert date strings to ISO format for the API
    const formattedData = { ...data }
    if (data.dates) {
      formattedData.dates = data.dates.map(date => {
        const dateObj = new Date(date)
        dateObj.setHours(12, 0, 0, 0)
        return dateObj.toISOString()
      })
    }
    return api.post('/availability/block', formattedData)
  },

  unblock: (data) => {
    // Convert date strings to ISO format for the API
    const formattedData = { ...data }
    if (data.dates) {
      formattedData.dates = data.dates.map(date => {
        const dateObj = new Date(date)
        dateObj.setHours(12, 0, 0, 0)
        return dateObj.toISOString()
      })
    }
    return api.post('/availability/unblock', formattedData)
  },
}

export const adminUploadsApi = {
  uploadImage: (imageData, folder = 'maa-katyaini-dham') => {
    return api.post('/uploads', { image: imageData, folder })
  },

  uploadImageFormData: (formData) => {
    return api.post('/uploads', formData)
  },

  deleteImage: (publicId) => {
    return api.delete('/uploads', { publicId })
  },

  generateUploadSignature: (folder = 'maa-katyaini-dham') => {
    return api.get(`/uploads/signature?folder=${folder}`)
  },
}

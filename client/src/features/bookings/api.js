import { api } from '../../lib/api'

export const bookingsApi = {
  create: (bookingData) => {
    return api.post('/bookings', bookingData)
  },

  getMyBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/bookings${queryString ? `?${queryString}` : ''}`)
  },

  getById: (id) => {
    return api.get(`/bookings/${id}`)
  },

  cancel: (id) => {
    return api.post(`/bookings/${id}/cancel`)
  },
}

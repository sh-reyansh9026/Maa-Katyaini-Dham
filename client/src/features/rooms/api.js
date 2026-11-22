import { api } from '../../lib/api'

export const roomsApi = {
  getAll: (params = {}) => {
    // Filter out empty, undefined, or null values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )
    const queryString = new URLSearchParams(filteredParams).toString()
    return api.get(`/rooms${queryString ? `?${queryString}` : ''}`)
  },

  getById: (id) => {
    return api.get(`/rooms/${id}`)
  },

  getTypes: () => {
    return api.get('/rooms/types')
  },
}

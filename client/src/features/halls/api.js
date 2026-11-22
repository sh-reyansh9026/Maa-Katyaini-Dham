import { api } from '../../lib/api'

export const hallsApi = {
  getAll: (params = {}) => {
    // Filter out empty, undefined, or null values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )
    const queryString = new URLSearchParams(filteredParams).toString()
    return api.get(`/halls${queryString ? `?${queryString}` : ''}`)
  },

  getById: (id) => {
    return api.get(`/halls/${id}`)
  },

  getTypes: () => {
    return api.get('/halls/types')
  },
}

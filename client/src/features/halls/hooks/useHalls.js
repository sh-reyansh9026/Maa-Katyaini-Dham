import { useQuery } from '@tanstack/react-query'
import { hallsApi } from '../api'

export const useHalls = (params = {}) => {
  return useQuery({
    queryKey: ['halls', params],
    queryFn: () => hallsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useHall = (id) => {
  return useQuery({
    queryKey: ['hall', id],
    queryFn: () => hallsApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useHallTypes = () => {
  return useQuery({
    queryKey: ['hallTypes'],
    queryFn: () => hallsApi.getTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

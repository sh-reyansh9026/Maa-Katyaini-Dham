import { useQuery } from '@tanstack/react-query'
import { roomsApi } from '../api'

export const useRooms = (params = {}) => {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => roomsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRoom = (id) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useRoomTypes = () => {
  return useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => roomsApi.getTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

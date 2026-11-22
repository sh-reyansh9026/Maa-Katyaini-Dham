import { nanoid } from 'nanoid'

/**
 * Generate unique booking ID
 */
export const generateBookingId = () => {
  return `BK${nanoid(10).toUpperCase()}`
}

/**
 * Generate unique resource ID
 */
export const generateResourceId = () => {
  return nanoid()
}

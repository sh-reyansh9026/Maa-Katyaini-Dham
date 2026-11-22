/**
 * Date utility functions
 */

/**
 * Get all dates between two dates (inclusive)
 */
export const getDatesInRange = (startDate, endDate) => {
  const dates = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0]
}

/**
 * Format date to readable string
 */
export const formatReadableDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Add days to a date
 */
export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date()
}

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date()
  const checkDate = new Date(date)
  return checkDate.toDateString() === today.toDateString()
}

/**
 * Get start of day
 */
export const startOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day
 */
export const endOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

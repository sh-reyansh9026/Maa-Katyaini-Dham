import { createClient } from 'redis'
import logger from '../utils/logger.js'
import { env } from './env.js'

let redisClient = null
let redisConnected = false

export const initRedis = async () => {
  if (!env.REDIS_URL) {
    logger.warn('Redis URL not provided, falling back to in-memory cache')
    return
  }

  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 attempts')
            return new Error('Redis reconnection failed')
          }
          return retries * 100
        },
      },
    })

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err)
      redisConnected = false
    })

    redisClient.on('connect', () => {
      logger.info('Redis client connected')
      redisConnected = true
    })

    redisClient.on('disconnect', () => {
      logger.warn('Redis client disconnected')
      redisConnected = false
    })

    await redisClient.connect()
    logger.info('Redis initialized successfully')
  } catch (error) {
    logger.error('Redis initialization failed:', error)
    redisClient = null
    redisConnected = false
  }
}

export const getRedisClient = () => {
  return redisClient
}

export const isRedisConnected = () => {
  return redisConnected
}

// In-memory cache fallback
const memoryCache = new Map()

export const cache = {
  async get(key) {
    if (redisConnected && redisClient) {
      try {
        const value = await redisClient.get(key)
        return value ? JSON.parse(value) : null
      } catch (error) {
        logger.error('Redis get error:', error)
        return memoryCache.get(key) || null
      }
    }
    return memoryCache.get(key) || null
  },

  async set(key, value, ttl = 300) {
    if (redisConnected && redisClient) {
      try {
        await redisClient.setEx(key, ttl, JSON.stringify(value))
      } catch (error) {
        logger.error('Redis set error:', error)
        memoryCache.set(key, value)
        setTimeout(() => memoryCache.delete(key), ttl * 1000)
      }
    } else {
      memoryCache.set(key, value)
      setTimeout(() => memoryCache.delete(key), ttl * 1000)
    }
  },

  async del(key) {
    if (redisConnected && redisClient) {
      try {
        await redisClient.del(key)
      } catch (error) {
        logger.error('Redis del error:', error)
        memoryCache.delete(key)
      }
    } else {
      memoryCache.delete(key)
    }
  },

  async invalidatePattern(pattern) {
    if (redisConnected && redisClient) {
      try {
        const keys = await redisClient.keys(pattern)
        if (keys.length > 0) {
          await redisClient.del(keys)
        }
      } catch (error) {
        logger.error('Redis invalidate pattern error:', error)
        // Fallback: clear all matching keys from memory cache
        for (const key of memoryCache.keys()) {
          if (key.match(pattern)) {
            memoryCache.delete(key)
          }
        }
      }
    } else {
      for (const key of memoryCache.keys()) {
        if (key.match(pattern)) {
          memoryCache.delete(key)
        }
      }
    }
  },
}

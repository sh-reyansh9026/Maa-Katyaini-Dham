import mongoose from 'mongoose'

/**
 * Base model with common fields for all models
 */
const baseSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

baseSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default baseSchema

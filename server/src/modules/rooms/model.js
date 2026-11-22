import mongoose from 'mongoose'
import baseModel from '../baseModel.js'

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
  },
  type: {
    type: String,
    enum: ['AC', 'Non-AC', 'Family', 'Dormitory'],
    required: [true, 'Room type is required'],
  },
  price: {
    type: Number,
    required: [true, 'Room price is required'],
    min: [0, 'Price cannot be negative'],
  },
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'At least 1 guest required'],
  },
  totalUnits: {
    type: Number,
    required: [true, 'Total units is required'],
    min: [1, 'At least 1 unit required'],
  },
  amenities: [{
    type: String,
    trim: true,
  }],
  images: [{
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  // Base fields
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

// Index for querying active rooms
roomSchema.index({ isActive: 1, type: 1 })
roomSchema.index({ price: 1 })

const Room = mongoose.model('Room', roomSchema)

export default Room

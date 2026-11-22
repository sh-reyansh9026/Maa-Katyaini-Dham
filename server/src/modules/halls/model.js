import mongoose from 'mongoose'

const hallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hall name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Hall description is required'],
  },
  type: {
    type: String,
    enum: ['Wedding', 'Ceremony', 'Conference', 'General'],
    required: [true, 'Hall type is required'],
  },
  capacity: {
    type: Number,
    required: [true, 'Hall capacity is required'],
    min: [1, 'At least 1 person required'],
  },
  priceMorning: {
    type: Number,
    required: [true, 'Morning price is required'],
    min: [0, 'Price cannot be negative'],
  },
  priceEvening: {
    type: Number,
    required: [true, 'Evening price is required'],
    min: [0, 'Price cannot be negative'],
  },
  priceFullDay: {
    type: Number,
    required: [true, 'Full day price is required'],
    min: [0, 'Price cannot be negative'],
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

// Index for querying active halls
hallSchema.index({ isActive: 1, type: 1 })
hallSchema.index({ capacity: 1 })

const Hall = mongoose.model('Hall', hallSchema)

export default Hall

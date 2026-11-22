import mongoose from 'mongoose'

const availabilitySchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Resource ID is required'],
  },
  resourceType: {
    type: String,
    enum: ['room', 'hall'],
    required: [true, 'Resource type is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  slot: {
    type: String,
    enum: ['MORNING', 'EVENING', 'FULL_DAY', 'NONE'],
    default: 'NONE',
  },
  totalUnits: {
    type: Number,
    required: [true, 'Total units is required'],
    min: [0, 'Total units cannot be negative'],
  },
  bookedUnits: {
    type: Number,
    required: [true, 'Booked units is required'],
    default: 0,
    min: [0, 'Booked units cannot be negative'],
  },
  isManuallyBlocked: {
    type: Boolean,
    default: false,
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

// Compound unique index to prevent duplicate availability records
availabilitySchema.index({ resourceId: 1, date: 1, slot: 1 }, { unique: true })

// Index for querying availability by date range
availabilitySchema.index({ date: 1, resourceType: 1 })

// Index for querying by resource
availabilitySchema.index({ resourceId: 1, date: 1 })

const Availability = mongoose.model('Availability', availabilitySchema)

export default Availability

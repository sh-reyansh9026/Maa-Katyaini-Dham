import mongoose from 'mongoose'

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
    required: true,
  },
  actor: {
    type: String,
    enum: ['user', 'admin', 'system'],
    required: true,
  },
  actorId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
}, { _id: false })

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: [true, 'Booking ID is required'],
    unique: true,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
  },
  userPhone: {
    type: String,
    required: [true, 'User phone is required'],
  },
  resourceType: {
    type: String,
    enum: ['room', 'hall'],
    required: [true, 'Resource type is required'],
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Resource ID is required'],
  },
  resourceName: {
    type: String,
    required: [true, 'Resource name is required'],
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required'],
  },
  checkOut: {
    type: Date,
    required: function() {
      return this.resourceType === 'room'
    },
  },
  slot: {
    type: String,
    enum: ['MORNING', 'EVENING', 'FULL_DAY'],
    required: function() {
      return this.resourceType === 'hall'
    },
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest required'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
  },
  advanceAmount: {
    type: Number,
    required: [true, 'Advance amount is required'],
    min: [0, 'Advance amount cannot be negative'],
  },
  advanceReceived: {
    type: Number,
    default: 0,
    min: [0, 'Advance received cannot be negative'],
  },
  upiReference: {
    type: String,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
    default: 'PENDING',
    required: true,
    index: true,
  },
  statusHistory: [statusHistorySchema],
  expiresAt: {
    type: Date,
    required: [true, 'Expiry time is required'],
    index: true,
  },
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true,
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

// Index for querying user bookings
bookingSchema.index({ userId: 1, createdAt: -1 })

// Index for querying by status
bookingSchema.index({ status: 1, createdAt: -1 })

// Index for querying expired bookings
bookingSchema.index({ status: 1, expiresAt: 1 })

// Index for querying by resource
bookingSchema.index({ resourceId: 1, checkIn: 1 })

// Pre-save middleware to update status history
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const historyEntry = {
      status: this.status,
      actor: this.status === 'PENDING' ? 'user' : 'admin',
      actorId: this.userId,
      timestamp: new Date(),
    }
    this.statusHistory.push(historyEntry)
  }
  next()
})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking

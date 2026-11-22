import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  whatsappOwnerNumber: {
    type: String,
    required: [true, 'WhatsApp owner number is required'],
    default: '',
  },
  advancePaymentPercentage: {
    type: Number,
    required: [true, 'Advance payment percentage is required'],
    default: 25,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100'],
  },
  bookingHoldDurationMinutes: {
    type: Number,
    required: [true, 'Booking hold duration is required'],
    default: 30,
    min: [1, 'Hold duration must be at least 1 minute'],
  },
  checkInTime: {
    type: String,
    default: '12:00',
  },
  checkOutTime: {
    type: String,
    default: '11:00',
  },
  cancellationPolicy: {
    type: String,
    default: 'Cancellations must be made at least 24 hours before check-in for a full refund.',
  },
  idProofRequirement: {
    type: String,
    default: 'Valid government ID proof (Aadhaar, PAN, or Passport) is required at check-in.',
  },
  hallUsageRules: {
    type: String,
    default: 'No outside food or drinks allowed. Decoration must be removed after event.',
  },
  contactEmail: {
    type: String,
    default: 'info@maakatyainidham.com',
  },
  contactPhone: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: 'Naimisharanya, Uttar Pradesh, India',
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

// Settings should be a singleton - only one document
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

const Settings = mongoose.model('Settings', settingsSchema)

export default Settings

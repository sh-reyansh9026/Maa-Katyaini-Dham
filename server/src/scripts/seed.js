import mongoose from 'mongoose'
import Room from '../modules/rooms/model.js'
import Hall from '../modules/halls/model.js'
import Settings from '../modules/settings/model.js'
import Availability from '../modules/availability/model.js'
import { connectDB } from '../config/db.js'

const seedData = async () => {
  try {
    await connectDB()

    console.log('🌱 Starting seed...')

    // Clear existing data
    await Room.deleteMany({})
    await Hall.deleteMany({})
    await Settings.deleteMany({})
    await Availability.deleteMany({})
    console.log('🗑️ Cleared existing data')

    // Seed Rooms
    const rooms = [
      {
        name: 'Deluxe AC Room',
        type: 'AC',
        description: 'Spacious air-conditioned room with modern amenities including king-size bed, attached bathroom, Wi-Fi, and room service.',
        price: 2500,
        maxGuests: 2,
        totalUnits: 5,
        amenities: ['Air Conditioning', 'King-size Bed', 'Attached Bathroom', 'Wi-Fi', 'Room Service', 'TV'],
        images: [
          { 
            publicId: 'deluxe-room',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935926/deluxe-room.jpg' 
          }
        ],
        isActive: true,
      },
      {
        name: 'Standard AC Room',
        type: 'AC',
        description: 'Comfortable air-conditioned room with queen-size bed, attached bathroom, and Wi-Fi.',
        price: 1800,
        maxGuests: 2,
        totalUnits: 10,
        amenities: ['Air Conditioning', 'Queen-size Bed', 'Attached Bathroom', 'Wi-Fi', 'TV'],
        images: [
          { 
            publicId: 'standard-room',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935925/standard-room.jpg' 
          }
        ],
        isActive: true,
      },
      {
        name: 'Non-AC Room',
        type: 'Non-AC',
        description: 'Economical non-air-conditioned room with comfortable bedding, ceiling fan, and attached bathroom.',
        price: 1000,
        maxGuests: 2,
        totalUnits: 8,
        amenities: ['Ceiling Fan', 'Attached Bathroom', 'Wi-Fi'],
        images: [
          { 
            publicId: 'non-ac-room',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935925/standard-room.jpg' 
          }
        ],
        isActive: true,
      },
      {
        name: 'Family Suite',
        type: 'Family',
        description: 'Large family suite with 2 bedrooms, living area, attached bathrooms, kitchenette, and balcony.',
        price: 4500,
        maxGuests: 6,
        totalUnits: 3,
        amenities: ['Air Conditioning', '2 Bedrooms', 'Living Area', 'Kitchenette', 'Balcony', 'Wi-Fi', 'TV', 'Refrigerator'],
        images: [
          { 
            publicId: 'family-suite',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935926/deluxe-room.jpg' 
          }
        ],
        isActive: true,
      },
      {
        name: 'Dormitory',
        type: 'Dormitory',
        description: 'Budget-friendly dormitory accommodation with shared bathroom facilities. Ideal for group pilgrimages.',
        price: 300,
        maxGuests: 1,
        totalUnits: 20,
        amenities: ['Shared Bathroom', 'Lockers', 'Wi-Fi', 'Ceiling Fan'],
        images: [
          { 
            publicId: 'dormitory',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935925/standard-room.jpg' 
          }
        ],
        isActive: true,
      },
    ]

    const createdRooms = await Room.insertMany(rooms)
    console.log(`✅ Created ${createdRooms.length} rooms`)

    // Create availability records for rooms (next 30 days)
    const roomAvailabilityRecords = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (const room of createdRooms) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i)
        roomAvailabilityRecords.push({
          resourceId: room._id,
          resourceType: 'room',
          date: date,
          slot: 'NONE',
          totalUnits: room.totalUnits,
          bookedUnits: 0,
          isManuallyBlocked: false,
        })
      }
    }
    
    await Availability.insertMany(roomAvailabilityRecords)
    console.log(`✅ Created ${roomAvailabilityRecords.length} room availability records`)

    // Seed Halls
    const halls = [
      {
        name: 'Maharishi Vyas Sabha Mandap',
        type: 'Ceremony',
        description: 'Acoustically balanced hall perfect for 7-day Shrimad Bhagwat Kathas. Spacious, serene, and spiritually uplifting environment.',
        capacity: 500,
        priceMorning: 25000,
        priceEvening: 35000,
        priceFullDay: 50000,
        totalUnits: 1,
        amenities: ['Acoustically Balanced', 'Stage', 'Seating for 500', 'Sound System', 'Lighting', 'Air Conditioning', 'Parking'],
        images: [
          { 
            publicId: 'maharishi-vyas-mandap',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935934/maharishi-vyas-mandap.jpg' 
          }
        ],
        isActive: true,
      },
      {
        name: 'Katyaini Mangal Bhawan & Yagya Shala',
        type: 'Wedding',
        description: 'Traditional bhawan with dedicated yagya shala for sacred ceremonies. Perfect for spiritual gatherings and religious events.',
        capacity: 300,
        priceMorning: 15000,
        priceEvening: 20000,
        priceFullDay: 30000,
        totalUnits: 1,
        amenities: ['Yagya Shala', 'Stage', 'Seating for 300', 'Sound System', 'Lighting', 'Air Conditioning', 'Parking'],
        images: [
          { 
            publicId: 'katyaini-mangal-bhawan',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935926/katyaini-mangal-bhawan.jpg' 
          }
        ],
        isActive: true,
      },
      {
        name: 'Spiritual Hall',
        type: 'Ceremony',
        description: 'Peaceful hall designed for spiritual gatherings, satsangs, and religious ceremonies.',
        capacity: 150,
        priceMorning: 10000,
        priceEvening: 15000,
        priceFullDay: 20000,
        totalUnits: 1,
        amenities: ['Stage', 'Seating for 150', 'Meditation Area', 'Peaceful Environment', 'Air Conditioning'],
        images: [
          { 
            publicId: 'spiritual-hall',
            url: 'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935934/maharishi-vyas-mandap.jpg' 
          }
        ],
        isActive: true,
      },
    ]

    const createdHalls = await Hall.insertMany(halls)
    console.log(`✅ Created ${createdHalls.length} halls`)

    // Create availability records for halls (next 30 days, all slots)
    const hallAvailabilityRecords = []
    const slots = ['MORNING', 'EVENING', 'FULL_DAY']
    
    for (const hall of createdHalls) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i)
        for (const slot of slots) {
          hallAvailabilityRecords.push({
            resourceId: hall._id,
            resourceType: 'hall',
            date: date,
            slot: slot,
            totalUnits: hall.totalUnits,
            bookedUnits: 0,
            isManuallyBlocked: false,
          })
        }
      }
    }
    
    await Availability.insertMany(hallAvailabilityRecords)
    console.log(`✅ Created ${hallAvailabilityRecords.length} hall availability records`)

    // Seed Settings
    const settings = {
      whatsappOwnerNumber: '+919876543210',
      advancePaymentPercentage: 25,
      bookingHoldDurationMinutes: 30,
      checkInTime: '12:00',
      checkOutTime: '11:00',
      cancellationPolicy: 'Cancellations must be made at least 24 hours before check-in for a full refund.',
      idProofRequirement: 'Valid government ID proof (Aadhaar, PAN, or Passport) is required at check-in.',
      hallUsageRules: 'No outside food or drinks allowed. Decoration must be removed after event. Guests must vacate by agreed time. Any damage will be charged to the booking party.',
      contactEmail: 'info@maakatyainidham.com',
      contactPhone: '+919026400792',
      address: 'Maa Katyaini Dham, Naimisharanya, Uttar Pradesh, India',
    }

    // Update existing settings or create new one
    const existingSettings = await Settings.findOne()
    if (existingSettings) {
      await Settings.updateOne({}, settings)
      console.log(`✅ Updated settings`)
    } else {
      await Settings.create(settings)
      console.log(`✅ Created settings`)
    }

    console.log('🎉 Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedData()

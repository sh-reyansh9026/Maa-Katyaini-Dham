import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useNavigate } from 'react-router-dom'
import { useHall } from '../features/halls/hooks/useHalls'
import { useAuth, useUser } from '@clerk/clerk-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import DatePicker from '../components/ui/DatePicker'
import Select from '../components/ui/Select'
import Skeleton from '../components/ui/Skeleton'
import Alert from '../components/ui/Alert'
import { api } from '../lib/api'

const HallDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { data: hall, isLoading, error } = useHall(id)
  
  const [bookingData, setBookingData] = useState({
    date: '',
    slot: '',
    guests: 1,
  })
  const [availabilityError, setAvailabilityError] = useState('')
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  const slotOptions = [
    { value: '', label: 'Select Slot' },
    { value: 'MORNING', label: 'Morning' },
    { value: 'EVENING', label: 'Evening' },
    { value: 'FULL_DAY', label: 'Full Day' },
  ]

  const handleBooking = () => {
    if (!isSignedIn) {
      navigate('/sign-in')
      return
    }

    // Require availability check before booking
    if (!availabilityChecked || !isAvailable) {
      setAvailabilityError('Please check availability first')
      return
    }

    navigate('/booking-summary', {
      state: {
        resourceType: 'hall',
        resourceId: hall.data._id,
        resourceName: hall.data.name,
        checkIn: bookingData.date, // Changed from 'date' to 'checkIn' for consistency
        slot: bookingData.slot,
        guests: bookingData.guests,
        totalAmount: calculateTotalAmount(),
      },
    })
  }

  const calculateTotalAmount = () => {
    if (!bookingData.slot || !hall?.data) return 0
    
    switch (bookingData.slot) {
      case 'MORNING':
        return hall.data.priceMorning
      case 'EVENING':
        return hall.data.priceEvening
      case 'FULL_DAY':
        return hall.data.priceFullDay
      default:
        return 0
    }
  }

  const checkAvailability = async () => {
    if (!bookingData.date || !bookingData.slot) {
      setAvailabilityError('Please select date and slot')
      setAvailabilityChecked(false)
      setIsAvailable(false)
      return
    }

    setIsCheckingAvailability(true)
    setAvailabilityError('')
    setAvailabilityChecked(false)
    setIsAvailable(false)

    try {
      // Convert date to ISO format
      const checkInISO = new Date(bookingData.date).toISOString()
      
      const response = await api.get(`/availability?resourceId=${id}&resourceType=hall&checkIn=${checkInISO}&slot=${bookingData.slot}`)

      if (!response.data.available) {
        setAvailabilityError('Mandap not available for selected date and slot')
        setIsAvailable(false)
      } else {
        setAvailabilityError('')
        setIsAvailable(true)
      }
      setAvailabilityChecked(true)
    } catch (error) {
      setAvailabilityError('Failed to check availability')
      setIsAvailable(false)
      setAvailabilityChecked(false)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Mandap Detail - Maa Katyaini Dham</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton variant="card" className="h-96 mb-8" />
          <Skeleton variant="title" className="mb-4" />
          <Skeleton variant="text" className="mb-2" />
          <Skeleton variant="text" />
        </div>
      </>
    )
  }

  if (error || !hall?.data) {
    return (
      <>
        <Helmet>
          <title>Mandap Not Found - Maa Katyaini Dham</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="danger">Mandap not found</Alert>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{hall.data.name} - Maa Katyaini Dham</title>
        <meta name="description" content={hall.data.description} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hall Images */}
        {hall.data.images && hall.data.images.length > 0 && (
          <div className="mb-8">
            <div className="aspect-video bg-surface-alt rounded-lg overflow-hidden">
              <img
                src={hall.data.images[0].url}
                alt={hall.data.name}
                className="w-full h-full object-cover"
              />
            </div>
            {hall.data.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {hall.data.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-video bg-surface-alt rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={`${hall.data.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hall Details */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl font-bold text-text mb-4">{hall.data.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                {hall.data.type}
              </span>
              <span className="text-muted">Capacity: {hall.data.capacity} guests</span>
            </div>

            <p className="text-text mb-6">{hall.data.description}</p>

            {/* Pricing */}
            <Card className="mb-6">
              <Card.Body>
                <h2 className="font-display text-xl font-semibold text-text mb-4">Pricing</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Morning Slot:</span>
                    <span className="font-medium text-text">₹{hall.data.priceMorning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Evening Slot:</span>
                    <span className="font-medium text-text">₹{hall.data.priceEvening}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Full Day:</span>
                    <span className="font-medium text-text">₹{hall.data.priceFullDay}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Amenities */}
            {hall.data.amenities && hall.data.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="font-display text-xl font-semibold text-text mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {hall.data.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-surface-alt text-text rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <Card.Header>
                <h2 className="font-semibold text-text">Book This Mandap</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <DatePicker
                    label="Event Date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Select
                    label="Time Slot"
                    options={slotOptions}
                    value={bookingData.slot}
                    onChange={(e) => setBookingData({ ...bookingData, slot: e.target.value })}
                  />
                  <Input
                    label="Number of Guests"
                    type="number"
                    min="1"
                    max={hall.data.capacity}
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                  />

                  {availabilityError && (
                    <Alert variant="danger">{availabilityError}</Alert>
                  )}

                  {availabilityChecked && isAvailable && (
                    <Alert variant="success">Mandap is available for selected date and slot!</Alert>
                  )}

                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={checkAvailability}
                      disabled={isCheckingAvailability}
                    >
                      {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={handleBooking}
                      disabled={!bookingData.date || !bookingData.slot || !availabilityChecked || !isAvailable}
                    >
                      Proceed to Book
                    </Button>
                  </div>

                  {bookingData.slot && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Total Amount:</span>
                        <span className="font-bold text-text">₹{calculateTotalAmount()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default HallDetail

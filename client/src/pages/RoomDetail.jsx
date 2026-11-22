import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../features/rooms/hooks/useRooms'
import { useAuth, useUser } from '@clerk/clerk-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import DatePicker from '../components/ui/DatePicker'
import Skeleton from '../components/ui/Skeleton'
import Alert from '../components/ui/Alert'
import { api } from '../lib/api'

const RoomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { data: room, isLoading, error } = useRoom(id)
  
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  })
  const [availabilityError, setAvailabilityError] = useState('')
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

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
        resourceType: 'room',
        resourceId: room.data._id,
        resourceName: room.data.name,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalAmount: calculateTotalAmount(),
      },
    })
  }

  const calculateTotalAmount = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !room?.data) return 0
    
    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    
    return room.data.price * nights
  }

  const checkAvailability = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setAvailabilityError('Please select check-in and check-out dates')
      setAvailabilityChecked(false)
      setIsAvailable(false)
      return
    }

    setIsCheckingAvailability(true)
    setAvailabilityError('')
    setAvailabilityChecked(false)
    setIsAvailable(false)

    try {
      // Convert dates to ISO format
      const checkInISO = new Date(bookingData.checkIn).toISOString()
      const checkOutISO = new Date(bookingData.checkOut).toISOString()
      
      const response = await api.get(`/availability?resourceId=${id}&resourceType=room&checkIn=${checkInISO}&checkOut=${checkOutISO}`)

      if (!response.data.available) {
        setAvailabilityError('Room not available for selected dates')
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
          <title>Room Detail - Maa Katyaini Dham</title>
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

  if (error || !room?.data) {
    return (
      <>
        <Helmet>
          <title>Room Not Found - Maa Katyaini Dham</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="danger">Room not found</Alert>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{room.data.name} - Maa Katyaini Dham</title>
        <meta name="description" content={room.data.description} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Room Images */}
        {room.data.images && room.data.images.length > 0 && (
          <div className="mb-8">
            <div className="aspect-video bg-surface-alt rounded-lg overflow-hidden">
              <img
                src={room.data.images[0].url}
                alt={room.data.name}
                className="w-full h-full object-cover"
              />
            </div>
            {room.data.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {room.data.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-video bg-surface-alt rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={`${room.data.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl font-bold text-text mb-4">{room.data.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-primary text-primary-fg rounded-full text-sm font-medium">
                {room.data.type}
              </span>
              <span className="text-muted">Max {room.data.maxGuests} guests</span>
              <span className="font-bold text-text">₹{room.data.price}/night</span>
            </div>

            <p className="text-text mb-6">{room.data.description}</p>

            {/* Amenities */}
            {room.data.amenities && room.data.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="font-display text-xl font-semibold text-text mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {room.data.amenities.map((amenity, index) => (
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
                <h2 className="font-semibold text-text">Book This Room</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <DatePicker
                    label="Check-in Date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <DatePicker
                    label="Check-out Date"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                  <Input
                    label="Number of Guests"
                    type="number"
                    min="1"
                    max={room.data.maxGuests}
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                  />

                  {availabilityError && (
                    <Alert variant="danger">{availabilityError}</Alert>
                  )}

                  {availabilityChecked && isAvailable && (
                    <Alert variant="success">Room is available for selected dates!</Alert>
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
                      disabled={!bookingData.checkIn || !bookingData.checkOut || !availabilityChecked || !isAvailable}
                    >
                      Proceed to Book
                    </Button>
                  </div>

                  {bookingData.checkIn && bookingData.checkOut && (
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

export default RoomDetail

import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Skeleton from '../components/ui/Skeleton'
import Alert from '../components/ui/Alert'
import { bookingsApi } from '../features/bookings/api'
import { useMutation, useQuery } from '@tanstack/react-query'

const BookingSummary = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const bookingData = location.state

  const [formData, setFormData] = useState({
    userName: user?.firstName || '',
    userEmail: user?.emailAddresses?.[0]?.emailAddress || '',
    userPhone: '',
  })
  const [formError, setFormError] = useState('')

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate('/rooms')
    }
  }, [bookingData, navigate])

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in', { state: { returnUrl: '/booking-summary', bookingData } })
    }
  }, [isSignedIn, navigate, bookingData])

  const createBookingMutation = useMutation({
    mutationFn: (data) => bookingsApi.create(data),
    onSuccess: (response) => {
      if (response.data.whatsapp) {
        window.open(response.data.whatsapp.url, '_blank')
        navigate('/my-bookings')
      }
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to create booking')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    // Validate form
    if (!formData.userName || !formData.userEmail || !formData.userPhone) {
      setFormError('Please fill in all required fields')
      return
    }

    // Convert dates to ISO format
    const bookingPayload = {
      ...bookingData,
      ...formData,
      idempotencyKey: `${bookingData.resourceId}-${Date.now()}`,
    }

    // Format dates for rooms
    if (bookingData.resourceType === 'room') {
      const checkInDate = new Date(bookingData.checkIn)
      const checkOutDate = new Date(bookingData.checkOut)
      
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        setFormError('Invalid date format')
        return
      }
      
      bookingPayload.checkIn = checkInDate.toISOString()
      bookingPayload.checkOut = checkOutDate.toISOString()
    } else {
      // Format date for halls
      const checkInDate = new Date(bookingData.checkIn)
      
      if (isNaN(checkInDate.getTime())) {
        setFormError('Invalid date format')
        return
      }
      
      bookingPayload.checkIn = checkInDate.toISOString()
    }

    // Create booking
    createBookingMutation.mutate(bookingPayload)
  }

  if (!bookingData) {
    return (
      <>
        <Helmet>
          <title>Booking Summary - Maa Katyaini Dham</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton variant="card" className="h-96" />
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Booking Summary - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-8">Booking Summary</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-text">Booking Details</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <span className="text-muted text-sm">Resource Type:</span>
                  <p className="font-medium text-text capitalize">{bookingData.resourceType}</p>
                </div>
                <div>
                  <span className="text-muted text-sm">Resource Name:</span>
                  <p className="font-medium text-text">{bookingData.resourceName}</p>
                </div>
                {bookingData.resourceType === 'room' ? (
                  <>
                    <div>
                      <span className="text-muted text-sm">Check-in:</span>
                      <p className="font-medium text-text">{new Date(bookingData.checkIn).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-muted text-sm">Check-out:</span>
                      <p className="font-medium text-text">{new Date(bookingData.checkOut).toLocaleDateString('en-IN')}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-muted text-sm">Event Date:</span>
                      <p className="font-medium text-text">{new Date(bookingData.checkIn).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-muted text-sm">Time Slot:</span>
                      <p className="font-medium text-text capitalize">{bookingData.slot?.replace('_', ' ')}</p>
                    </div>
                  </>
                )}
                <div>
                  <span className="text-muted text-sm">Number of Guests:</span>
                  <p className="font-medium text-text">{bookingData.guests}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted">Total Amount:</span>
                    <span className="font-bold text-text text-lg">₹{bookingData.totalAmount}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Contact Form */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-text">Contact Information</h2>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  required
                />

                {formError && (
                  <Alert variant="danger">{formError}</Alert>
                )}

                <Alert variant="info">
                  <p className="text-sm">
                    After confirming, you'll be redirected to WhatsApp to send your booking details and make the advance payment.
                  </p>
                </Alert>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? 'Creating Booking...' : 'Confirm & Send to WhatsApp'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate(-1)}
                    disabled={createBookingMutation.isPending}
                  >
                    Back
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}

export default BookingSummary

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../features/bookings/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'

const BookingDetail = () => {
  const { id } = useParams()

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getById(id),
  })

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning'
      case 'CONFIRMED': return 'success'
      case 'REJECTED': return 'danger'
      case 'CANCELLED': return 'neutral'
      case 'EXPIRED': return 'danger'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Booking Detail - Maa Katyaini Dham</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton variant="card" className="h-96" />
        </div>
      </>
    )
  }

  if (error || !booking?.data) {
    return (
      <>
        <Helmet>
          <title>Booking Not Found - Maa Katyaini Dham</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-danger">Booking not found</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Booking {booking.data.bookingId} - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <span className="text-muted">Booking ID: {booking.data.bookingId}</span>
        </div>
        
        <Card>
          <Card.Body>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-text mb-2">{booking.data.resourceName}</h1>
                <Badge variant={getStatusVariant(booking.data.status)} className="mb-2">
                  {booking.data.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted">Total Amount</p>
                <p className="text-2xl font-bold text-text">₹{booking.data.totalAmount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-text mb-4">Guest Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Name:</span>
                    <span className="text-text">{booking.data.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Email:</span>
                    <span className="text-text">{booking.data.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Phone:</span>
                    <span className="text-text">{booking.data.userPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  {booking.data.resourceType === 'room' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted">Check-in:</span>
                        <span className="text-text">{new Date(booking.data.checkIn).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Check-out:</span>
                        <span className="text-text">{new Date(booking.data.checkOut).toLocaleDateString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted">Date:</span>
                        <span className="text-text">{new Date(booking.data.checkIn).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Slot:</span>
                        <span className="text-text capitalize">{booking.data.slot?.replace('_', ' ')}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted">Guests:</span>
                    <span className="text-text">{booking.data.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Advance Amount:</span>
                    <span className="text-text">₹{booking.data.advanceAmount}</span>
                  </div>
                  {booking.data.advanceReceived > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted">Advance Received:</span>
                      <span className="text-text">₹{booking.data.advanceReceived}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {booking.data.upiReference && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold text-text mb-2">Payment Information</h3>
                <div className="text-sm">
                  <span className="text-muted">UPI Reference:</span>
                  <span className="text-text ml-2">{booking.data.upiReference}</span>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-text mb-4">Status History</h3>
              <div className="space-y-2">
                {booking.data.statusHistory?.map((history, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-3 bg-surface-alt rounded-lg">
                  
                    <div>
                      <span className="font-medium text-text capitalize">{history.status}</span>
                      <span className="text-muted ml-2">by {history.actor}</span>
                    </div>
                    <span className="text-muted">{new Date(history.timestamp).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button variant="secondary">Back to My Bookings</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default BookingDetail

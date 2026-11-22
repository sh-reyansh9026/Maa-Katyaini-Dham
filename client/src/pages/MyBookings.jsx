import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../features/bookings/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import Alert from '../components/ui/Alert'
import { Link } from 'react-router-dom'

const MyBookings = () => {
  const { t } = useTranslation()
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  const { data: bookingsData, isLoading, error } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingsApi.getMyBookings(),
    enabled: isSignedIn,
  })

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'CONFIRMED':
        return 'success'
      case 'REJECTED':
        return 'danger'
      case 'CANCELLED':
        return 'neutral'
      case 'EXPIRED':
        return 'danger'
      default:
        return 'default'
    }
  }

  if (!isSignedIn) {
    return (
      <>
        <Helmet>
          <title>My Bookings - Maa Katyaini Dham</title>
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="info">
            Please sign in to view your bookings.
          </Alert>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Bookings - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-2">{t('nav.myBookings')}</h1>
        <p className="text-muted mb-8">View and manage your bookings</p>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Card.Body>
                  <Skeleton variant="title" className="mb-2" />
                  <Skeleton variant="text" className="mb-2" />
                  <Skeleton variant="text" />
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-danger mb-4">Failed to load bookings. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Bookings List */}
        {!isLoading && !error && bookingsData?.data?.bookings && (
          <>
            {bookingsData.data.bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted mb-4">You don't have any bookings yet.</p>
                <Link to="/rooms">
                  <Button>Browse Rooms</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingsData.data.bookings.map((booking) => (
                  <Card key={booking._id}>
                    <Card.Body>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-text">{booking.resourceName}</h3>
                            <Badge variant={getStatusVariant(booking.status)}>
                              {t(`booking.status.${booking.status}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted mb-1">
                            Booking ID: {booking.bookingId}
                          </p>
                          <div className="text-sm text-text">
                            {booking.resourceType === 'room' ? (
                              <>
                                <span>{new Date(booking.checkIn).toLocaleDateString('en-IN')} - {new Date(booking.checkOut).toLocaleDateString('en-IN')}</span>
                                <span className="mx-2">•</span>
                                <span>{booking.guests} guests</span>
                              </>
                            ) : (
                              <>
                                <span>{new Date(booking.checkIn).toLocaleDateString('en-IN')}</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{booking.slot?.replace('_', ' ')}</span>
                                <span className="mx-2">•</span>
                                <span>{booking.guests} guests</span>
                              </>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-muted">Total: </span>
                            <span className="font-medium text-text">₹{booking.totalAmount}</span>
                            <span className="mx-2 text-muted">•</span>
                            <span className="text-sm text-muted">Advance: </span>
                            <span className="font-medium text-text">₹{booking.advanceAmount}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/my-bookings/${booking.bookingId}`}>
                            <Button size="sm" variant="secondary">
                              View Details
                            </Button>
                          </Link>
                          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                  bookingsApi.cancel(booking.bookingId)
                                    .then(() => window.location.reload())
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {bookingsData.data.pagination && bookingsData.data.pagination.pages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <Button
                  variant="secondary"
                  disabled={bookingsData.data.pagination.page === 1}
                  onClick={() => {
                    // Handle pagination - would need to update the query
                  }}
                >
                  Previous
                </Button>
                <span className="text-muted">
                  Page {bookingsData.data.pagination.page} of {bookingsData.data.pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  disabled={bookingsData.data.pagination.page === bookingsData.data.pagination.pages}
                  onClick={() => {
                    // Handle pagination - would need to update the query
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default MyBookings

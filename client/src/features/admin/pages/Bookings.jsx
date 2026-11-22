import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminBookingsApi } from '../api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Skeleton from '../../../components/ui/Skeleton'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Alert from '../../../components/ui/Alert'

const AdminBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [confirmData, setConfirmData] = useState({
    upiReference: '',
    advanceReceived: '',
    notes: ''
  })
  const [rejectData, setRejectData] = useState({
    notes: ''
  })
  const [formError, setFormError] = useState('')

  const queryClient = useQueryClient()

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => adminBookingsApi.getAll(),
  })

  const confirmMutation = useMutation({
    mutationFn: ({ id, data }) => adminBookingsApi.confirm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBookings'])
      setConfirmModalOpen(false)
      setConfirmData({ upiReference: '', advanceReceived: '', notes: '' })
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to confirm booking')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, data }) => adminBookingsApi.reject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBookings'])
      setRejectModalOpen(false)
      setRejectData({ notes: '' })
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to reject booking')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, data }) => adminBookingsApi.cancel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBookings'])
      setViewModalOpen(false)
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to cancel booking')
    },
  })

  const handleView = (booking) => {
    setSelectedBooking(booking)
    setViewModalOpen(true)
  }

  const handleConfirm = (booking) => {
    setSelectedBooking(booking)
    setConfirmModalOpen(true)
    setConfirmData({
      upiReference: '',
      advanceReceived: booking.advanceAmount?.toString() || '',
      notes: ''
    })
  }

  const handleReject = (booking) => {
    setSelectedBooking(booking)
    setRejectModalOpen(true)
    setRejectData({ notes: '' })
  }

  const handleConfirmSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    if (!confirmData.upiReference || !confirmData.advanceReceived) {
      setFormError('Please fill in all required fields')
      return
    }

    const advanceReceivedNum = parseFloat(confirmData.advanceReceived)
    if (isNaN(advanceReceivedNum) || advanceReceivedNum < 0) {
      setFormError('Please enter a valid advance amount')
      return
    }

    confirmMutation.mutate({
      id: selectedBooking.bookingId,
      data: {
        upiReference: confirmData.upiReference,
        advanceReceived: advanceReceivedNum,
        notes: confirmData.notes
      }
    })
  }

  const handleRejectSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    if (!rejectData.notes.trim()) {
      setFormError('Please provide a reason for rejection')
      return
    }

    rejectMutation.mutate({
      id: selectedBooking.bookingId,
      data: { notes: rejectData.notes }
    })
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate({
        id: selectedBooking.bookingId,
        data: { notes: 'Cancelled by admin' }
      })
    }
  }

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

  return (
    <>
      <Helmet>
        <title>Admin Bookings - Maa Katyaini Dham</title>
      </Helmet>
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold text-text mb-8">Booking Management</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <Card.Body>
                  <Skeleton variant="card" />
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Card.Body>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Booking ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Guest</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Resource</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Dates</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsData?.data?.bookings?.map((booking) => (
                      <tr key={booking._id} className="border-b border-border">
                        <td className="py-3 px-4 text-sm text-text">{booking.bookingId}</td>
                        <td className="py-3 px-4 text-sm text-text">{booking.userName}</td>
                        <td className="py-3 px-4 text-sm text-text">{booking.resourceName}</td>
                        <td className="py-3 px-4 text-sm text-text">
                          {new Date(booking.checkIn).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-sm text-text">₹{booking.totalAmount}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleView(booking)}
                            >
                              View
                            </Button>
                            {booking.status === 'PENDING' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="success"
                                  onClick={() => handleConfirm(booking)}
                                >
                                  Confirm
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="danger"
                                  onClick={() => handleReject(booking)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                              <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => {
                                  setSelectedBooking(booking)
                                  handleCancel()
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* View Booking Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted">Booking ID:</span>
                <p className="font-medium text-text">{selectedBooking.bookingId}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Status:</span>
                <Badge variant={getStatusVariant(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted">Guest Name:</span>
                <p className="font-medium text-text">{selectedBooking.userName}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Email:</span>
                <p className="font-medium text-text">{selectedBooking.userEmail}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Phone:</span>
                <p className="font-medium text-text">{selectedBooking.userPhone}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Resource:</span>
                <p className="font-medium text-text">{selectedBooking.resourceName}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Check-in:</span>
                <p className="font-medium text-text">{new Date(selectedBooking.checkIn).toLocaleDateString('en-IN')}</p>
              </div>
              {selectedBooking.checkOut && (
                <div>
                  <span className="text-sm text-muted">Check-out:</span>
                  <p className="font-medium text-text">{new Date(selectedBooking.checkOut).toLocaleDateString('en-IN')}</p>
                </div>
              )}
              {selectedBooking.slot && (
                <div>
                  <span className="text-sm text-muted">Time Slot:</span>
                  <p className="font-medium text-text capitalize">{selectedBooking.slot.replace('_', ' ')}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-muted">Guests:</span>
                <p className="font-medium text-text">{selectedBooking.guests}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Total Amount:</span>
                <p className="font-medium text-text">₹{selectedBooking.totalAmount}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Advance Amount:</span>
                <p className="font-medium text-text">₹{selectedBooking.advanceAmount}</p>
              </div>
              {selectedBooking.upiReference && (
                <div>
                  <span className="text-sm text-muted">UPI Reference:</span>
                  <p className="font-medium text-text">{selectedBooking.upiReference}</p>
                </div>
              )}
              {selectedBooking.advanceReceived && (
                <div>
                  <span className="text-sm text-muted">Advance Received:</span>
                  <p className="font-medium text-text">₹{selectedBooking.advanceReceived}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </Button>
              {(selectedBooking.status === 'CONFIRMED' || selectedBooking.status === 'PENDING') && (
                <Button
                  variant="danger"
                  onClick={handleCancel}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Booking Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Booking"
        size="md"
      >
        {selectedBooking && (
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            {formError && (
              <Alert variant="danger">{formError}</Alert>
            )}

            <div className="bg-surface-alt p-4 rounded-lg">
              <p className="text-sm text-muted mb-2">Booking Details:</p>
              <p className="font-medium text-text">{selectedBooking.resourceName}</p>
              <p className="text-sm text-text">Advance Required: ₹{selectedBooking.advanceAmount}</p>
            </div>

            <Input
              label="UPI Reference Number"
              name="upiReference"
              value={confirmData.upiReference}
              onChange={(e) => setConfirmData({ ...confirmData, upiReference: e.target.value })}
              required
              placeholder="Enter UPI transaction reference"
            />

            <Input
              label="Advance Amount Received (₹)"
              name="advanceReceived"
              type="number"
              min="0"
              value={confirmData.advanceReceived}
              onChange={(e) => setConfirmData({ ...confirmData, advanceReceived: e.target.value })}
              required
              placeholder="Enter amount received"
            />

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                value={confirmData.notes}
                onChange={(e) => setConfirmData({ ...confirmData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending ? 'Confirming...' : 'Confirm Booking'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmModalOpen(false)}
                disabled={confirmMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Reject Booking Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Booking"
        size="md"
      >
        {selectedBooking && (
          <form onSubmit={handleRejectSubmit} className="space-y-4">
            {formError && (
              <Alert variant="danger">{formError}</Alert>
            )}

            <div className="bg-surface-alt p-4 rounded-lg">
              <p className="text-sm text-muted mb-2">Booking Details:</p>
              <p className="font-medium text-text">{selectedBooking.resourceName}</p>
              <p className="text-sm text-text">Guest: {selectedBooking.userName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Reason for Rejection
              </label>
              <textarea
                name="notes"
                value={rejectData.notes}
                onChange={(e) => setRejectData({ ...rejectData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
                placeholder="Explain why this booking is being rejected..."
                required
              />
            </div>

            <Alert variant="warning">
              <p className="text-sm">
                This action will release the inventory and notify the user that their booking has been rejected.
              </p>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="danger"
                className="flex-1"
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Booking'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRejectModalOpen(false)}
                disabled={rejectMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

export default AdminBookings

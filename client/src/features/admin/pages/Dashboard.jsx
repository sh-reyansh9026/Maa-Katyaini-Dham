import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api'
import Card from '../../../components/ui/Card'
import Skeleton from '../../../components/ui/Skeleton'

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats(),
  })

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard - Maa Katyaini Dham</title>
        </Helmet>
        <div className="p-8">
          <Skeleton variant="title" className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Card.Body>
                  <Skeleton variant="card" />
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard - Maa Katyaini Dham</title>
        </Helmet>
        <div className="p-8">
          <p className="text-danger">Failed to load dashboard stats</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Maa Katyaini Dham</title>
      </Helmet>
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold text-text mb-8">Dashboard</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Body>
              <p className="text-sm text-muted mb-2">Total Bookings</p>
              <p className="text-3xl font-bold text-text">{stats?.data?.overview?.totalBookings || 0}</p>
              <p className="text-xs text-muted mt-2">{stats?.data?.overview?.thisMonthBookings || 0} this month</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-muted mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-text">₹{stats?.data?.revenue?.totalRevenue || 0}</p>
              <p className="text-xs text-muted mt-2">₹{stats?.data?.revenue?.thisMonthRevenue || 0} this month</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-muted mb-2">Total Rooms</p>
              <p className="text-3xl font-bold text-text">{stats?.data?.overview?.totalRooms || 0}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-muted mb-2">Total Mandaps</p>
              <p className="text-3xl font-bold text-text">{stats?.data?.overview?.totalHalls || 0}</p>
            </Card.Body>
          </Card>
        </div>

        {/* Booking Status Breakdown */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="font-semibold text-text">Booking Status</h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{stats?.data?.bookingsByStatus?.PENDING || 0}</p>
                <p className="text-sm text-muted">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{stats?.data?.bookingsByStatus?.CONFIRMED || 0}</p>
                <p className="text-sm text-muted">Confirmed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-danger">{stats?.data?.bookingsByStatus?.REJECTED || 0}</p>
                <p className="text-sm text-muted">Rejected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral">{stats?.data?.bookingsByStatus?.CANCELLED || 0}</p>
                <p className="text-sm text-muted">Cancelled</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-danger">{stats?.data?.bookingsByStatus?.EXPIRED || 0}</p>
                <p className="text-sm text-muted">Expired</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <Card.Header>
            <h2 className="font-semibold text-text">Recent Bookings</h2>
          </Card.Header>
          <Card.Body>
            {stats?.data?.recentBookings && stats.data.recentBookings.length > 0 ? (
              <div className="space-y-3">
                {stats.data.recentBookings.map((booking) => (
                  <div key={booking.bookingId} className="flex items-center justify-between p-3 bg-surface-alt rounded-lg">
                    <div>
                      <p className="font-medium text-text">{booking.userName}</p>
                      <p className="text-sm text-muted">{booking.resourceName} - {booking.bookingId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-text">₹{booking.totalAmount}</p>
                      <p className="text-sm text-muted capitalize">{booking.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-4">No recent bookings</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default AdminDashboard

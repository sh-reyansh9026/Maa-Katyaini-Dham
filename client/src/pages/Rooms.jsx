import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useRooms, useRoomTypes } from '../features/rooms/hooks/useRooms'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import Skeleton from '../components/ui/Skeleton'
import Badge from '../components/ui/Badge'
import { Link } from 'react-router-dom'

const Rooms = () => {
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    minGuests: '',
    page: 1,
  })

  const { data: roomsData, isLoading, error } = useRooms(filters)
  const { data: roomTypes } = useRoomTypes()

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      minGuests: '',
      page: 1,
    })
  }

  const typeOptions = [
    { value: '', label: 'All Types' },
    ...(roomTypes?.data || []).map(type => ({ value: type, label: type }))
  ]

  return (
    <>
      <Helmet>
        <title>Accommodation - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-2">Comfortable Accommodation</h1>
        <p className="text-muted mb-8">Peaceful rooms for pilgrims and spiritual seekers</p>

        {/* Filters */}
        <Card className="mb-8">
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Room Type"
                options={typeOptions}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              />
              <Input
                label="Min Price"
                type="number"
                placeholder="₹0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <Input
                label="Max Price"
                type="number"
                placeholder="₹10000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
              <Input
                label="Min Guests"
                type="number"
                placeholder="1"
                value={filters.minGuests}
                onChange={(e) => handleFilterChange('minGuests', e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Card.Body>
                  <Skeleton variant="card" />
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-danger mb-4">Failed to load rooms. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Rooms Grid */}
        {!isLoading && !error && roomsData?.data?.rooms && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomsData.data.rooms.map((room) => (
                <Card key={room._id} hover>
                  <div className="aspect-video bg-surface-alt rounded-t-lg overflow-hidden">
                    {room.images && room.images.length > 0 ? (
                      <img
                        src={room.images[0].url}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        Room Image
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="primary">{room.type}</Badge>
                      <span className="text-sm text-muted">Max {room.maxGuests} guests</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text mb-2">{room.name}</h3>
                    <p className="text-sm text-muted mb-4 line-clamp-2">{room.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">₹{room.price}/night</span>
                      <Link to={`/rooms/${room._id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {roomsData.data.pagination && roomsData.data.pagination.pages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <Button
                  variant="secondary"
                  disabled={parseInt(filters.page) === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: parseInt(prev.page) - 1 }))}
                >
                  Previous
                </Button>
                <span className="text-muted">
                  Page {roomsData.data.pagination.page} of {roomsData.data.pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  disabled={parseInt(filters.page) === roomsData.data.pagination.pages}
                  onClick={() => setFilters(prev => ({ ...prev, page: parseInt(prev.page) + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && !error && (!roomsData?.data?.rooms || roomsData.data.rooms.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted mb-4">No rooms found matching your criteria.</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </>
  )
}

export default Rooms

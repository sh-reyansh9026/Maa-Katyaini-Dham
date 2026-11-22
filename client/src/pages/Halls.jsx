import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useHalls, useHallTypes } from '../features/halls/hooks/useHalls'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import Skeleton from '../components/ui/Skeleton'
import Badge from '../components/ui/Badge'
import { Link } from 'react-router-dom'

const Halls = () => {
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    maxCapacity: '',
    page: 1,
  })

  const { data: hallsData, isLoading, error } = useHalls(filters)
  const { data: hallTypes } = useHallTypes()

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      minCapacity: '',
      maxCapacity: '',
      page: 1,
    })
  }

  const typeOptions = [
    { value: '', label: 'All Types' },
    ...(hallTypes?.data || []).map(type => ({ value: type, label: type }))
  ]

  return (
    <>
      <Helmet>
        <title>Mandaps - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-2">Our Sacred Mandaps</h1>
        <p className="text-muted mb-8">Perfect venues for Bhagwat Katha, weddings, and spiritual ceremonies</p>

        {/* Filters */}
        <Card className="mb-8">
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Mandap Type"
                options={typeOptions}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              />
              <Input
                label="Min Capacity"
                type="number"
                placeholder="10"
                value={filters.minCapacity}
                onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              />
              <Input
                label="Max Capacity"
                type="number"
                placeholder="500"
                value={filters.maxCapacity}
                onChange={(e) => handleFilterChange('maxCapacity', e.target.value)}
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
            {[1, 2, 3].map((i) => (
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
            <p className="text-danger mb-4">Failed to load mandaps. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Halls Grid */}
        {!isLoading && !error && hallsData?.data?.halls && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hallsData.data.halls.map((hall) => (
                
                <Card key={hall._id} hover>
                  
                  <div className="aspect-video bg-surface-alt rounded-t-lg overflow-hidden">
                    {console.log("hall",hall)}
                    {hall.images && hall.images.length > 0 ? (
                      <img
                        src={hall.images[0].url}
                        alt={hall.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        Venue Image
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="accent">{hall.type}</Badge>
                      <span className="text-sm text-muted">Capacity: {hall.capacity}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text mb-2">{hall.name}</h3>
                    <p className="text-sm text-muted mb-4 line-clamp-2">{hall.description}</p>
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Morning:</span>
                        <span className="font-medium text-text">₹{hall.priceMorning}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Evening:</span>
                        <span className="font-medium text-text">₹{hall.priceEvening}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Full Day:</span>
                        <span className="font-medium text-text">₹{hall.priceFullDay}</span>
                      </div>
                    </div>
                    <Link to={`/halls/${hall._id}`}>
                      <Button size="sm" className="w-full">View Details</Button>
                    </Link>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {hallsData.data.pagination && hallsData.data.pagination.pages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <Button
                  variant="secondary"
                  disabled={parseInt(filters.page) === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: parseInt(prev.page) - 1 }))}
                >
                  Previous
                </Button>
                <span className="text-muted">
                  Page {hallsData.data.pagination.page} of {hallsData.data.pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  disabled={parseInt(filters.page) === hallsData.data.pagination.pages}
                  onClick={() => setFilters(prev => ({ ...prev, page: parseInt(prev.page) + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && !error && (!hallsData?.data?.halls || hallsData.data.halls.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted mb-4">No mandaps found matching your criteria.</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </>
  )
}

export default Halls

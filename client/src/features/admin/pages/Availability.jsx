import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAvailabilityApi, adminRoomsApi, adminHallsApi } from '../api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Skeleton from '../../../components/ui/Skeleton'
import Alert from '../../../components/ui/Alert'
import Modal from '../../../components/ui/Modal'

const AdminAvailability = () => {
  const [resourceType, setResourceType] = useState('room')
  const [selectedResource, setSelectedResource] = useState(null)
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)
  const [calendarDateRange, setCalendarDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [formError, setFormError] = useState('')
  const [expandedDates, setExpandedDates] = useState({})

  const queryClient = useQueryClient()

  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ['adminRooms'],
    queryFn: () => adminRoomsApi.getAll(),
    enabled: resourceType === 'room',
  })

  const { data: hallsData, isLoading: hallsLoading } = useQuery({
    queryKey: ['adminHalls'],
    queryFn: () => adminHallsApi.getAll(),
    enabled: resourceType === 'hall',
  })

  const { data: calendarData, isLoading: calendarLoading, refetch } = useQuery({
    queryKey: ['availabilityCalendar', selectedResource?.id, selectedResource?.resourceType, calendarDateRange.startDate, calendarDateRange.endDate],
    queryFn: () => adminAvailabilityApi.getCalendar({
      resourceId: selectedResource?.id,
      resourceType: selectedResource?.resourceType,
      startDate: calendarDateRange.startDate,
      endDate: calendarDateRange.endDate,
    }),
    enabled: !!selectedResource && !!calendarDateRange.startDate && !!calendarDateRange.endDate,
  })
  console.log("Calendar data:", calendarData);

  const blockMutation = useMutation({
    mutationFn: (data) => adminAvailabilityApi.block(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['availabilityCalendar'])
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to block availability')
    },
  })

  const unblockMutation = useMutation({
    mutationFn: (data) => adminAvailabilityApi.unblock(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['availabilityCalendar'])
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to unblock availability')
    },
  })

  const handleOpenCalendar = (resource) => {
    setSelectedResource(resource)
    console.log("Selected resource:", resource);
    // Set default date range to next 30 days
    const today = new Date()
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    setCalendarDateRange({
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0]
    })
    setCalendarModalOpen(true)
  }

  const handleLoadCalendar = () => {
    if (!calendarDateRange.startDate || !calendarDateRange.endDate) {
      setFormError('Please select date range')
      return
    }
    refetch()
  }

  const handleBlock = (date, slot) => {
    const blockData = {
      resourceId: selectedResource.id,
      resourceType: selectedResource.type,
      dates: [date],
    }

    if (selectedResource.type === 'hall' && slot) {
      blockData.slot = slot
    }

    blockMutation.mutate(blockData)
  }

  const handleUnblock = (date, slot) => {
    const unblockData = {
      resourceId: selectedResource.id,
      resourceType: selectedResource.type,
      dates: [date],
    }

    if (slot) {
      unblockData.slot = slot
    }

    unblockMutation.mutate(unblockData)
  }

  const toggleExpanded = (dateKey) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }))
  }

  const resources = resourceType === 'room' 
    ? (roomsData?.data?.rooms?.map(room => ({ 
        id: room._id, 
        name: room.name, 
        type: room.type, 
        totalUnits: room.totalUnits,
        resourceType: 'room'
      })) || [])
    : (hallsData?.data?.halls?.map(hall => ({ 
        id: hall._id, 
        name: hall.name, 
        type: hall.type, 
        totalUnits: 1,
        resourceType: 'hall'
      })) || [])

  const today = new Date().toISOString().split('T')[0]

  // Generate date range for calendar view
  const getDatesInRange = (start, end) => {
    const dates = []
    const current = new Date(start)
    const endDate = new Date(end)
    while (current <= endDate) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const calendarDates = calendarDateRange.startDate && calendarDateRange.endDate 
    ? getDatesInRange(calendarDateRange.startDate, calendarDateRange.endDate)
    : []

  // Get availability for each date
  const getAvailabilityForDate = (date, slot = 'NONE') => {
    if (!calendarData?.data) return { available: 0, total: 0, isBlocked: false, bookings: [] }
    
    const dateStr = new Date(date).toISOString().split('T')[0]
    const record = calendarData.data.find(r => {
      const recordDate = new Date(r.date).toISOString().split('T')[0]
      return recordDate === dateStr && r.slot === slot
    })
    
    if (record) {
      return {
        available: record.totalUnits - record.bookedUnits,
        total: record.totalUnits,
        isBlocked: record.isManuallyBlocked,
        bookings: record.bookings || []
      }
    }
    
    // Default to total units if no record found
    return { available: selectedResource?.totalUnits || 0, total: selectedResource?.totalUnits || 0, isBlocked: false, bookings: [] }
  }

  return (
    <>
      <Helmet>
        <title>Admin Availability - Maa Katyaini Dham</title>
      </Helmet>
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold text-text mb-8">Availability Management</h1>

        {/* Resource Type Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-border p-1">
            <button
              onClick={() => setResourceType('room')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                resourceType === 'room' 
                  ? 'bg-primary text-primary-fg' 
                  : 'text-muted hover:text-text'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setResourceType('hall')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                resourceType === 'hall' 
                  ? 'bg-primary text-primary-fg' 
                  : 'text-muted hover:text-text'
              }`}
            >
              Mandaps
            </button>
          </div>
        </div>

        {/* Resources Table */}
        {(roomsLoading || hallsLoading) ? (
          <Card>
            <Card.Body>
              <Skeleton variant="card" className="h-64" />
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Total Units</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((resource) => (
                      <tr key={resource.id} className="border-b border-border">
                        <td className="py-3 px-4 text-sm text-text">{resource.name}</td>
                        <td className="py-3 px-4 text-sm text-text">{resource.type}</td>
                        <td className="py-3 px-4 text-sm text-text">{resource.totalUnits}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenCalendar(resource)}
                          >
                            Calendar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Calendar Modal */}
        <Modal
          isOpen={calendarModalOpen}
          onClose={() => setCalendarModalOpen(false)}
          title={`${selectedResource?.name} - Availability Calendar`}
          size="xl"
        >
          {selectedResource && (
            <div className="space-y-4">
              {formError && (
                <Alert variant="danger">{formError}</Alert>
              )}

              {/* Date Range Selector */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text mb-2">Start Date</label>
                  <input
                    type="date"
                    value={calendarDateRange.startDate}
                    onChange={(e) => setCalendarDateRange({ ...calendarDateRange, startDate: e.target.value })}
                    min={today}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text mb-2">End Date</label>
                  <input
                    type="date"
                    value={calendarDateRange.endDate}
                    onChange={(e) => setCalendarDateRange({ ...calendarDateRange, endDate: e.target.value })}
                    min={calendarDateRange.startDate || today}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
                  />
                </div>
                <Button onClick={handleLoadCalendar} disabled={!calendarDateRange.startDate || !calendarDateRange.endDate}>
                  Load
                </Button>
              </div>

              {/* Calendar View */}
              {calendarLoading ? (
                <Skeleton variant="card" className="h-64" />
              ) : calendarDates.length > 0 ? (
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-8 bg-surface-alt border-b border-border">
                    <div className="p-3 text-sm font-medium text-text border-r border-border">Date</div>
                    {selectedResource.resourceType === 'hall' ? (
                      <>
                        <div className="p-3 text-sm font-medium text-text border-r border-border">Morning</div>
                        <div className="p-3 text-sm font-medium text-text border-r border-border">Evening</div>
                        <div className="p-3 text-sm font-medium text-text border-r border-border">Full Day</div>
                      </>
                    ) : (
                      <div className="p-3 text-sm font-medium text-text border-r border-border">Available</div>
                    )}
                    <div className="p-3 text-sm font-medium text-text border-r border-border">Total</div>
                    <div className="p-3 text-sm font-medium text-text border-r border-border">Booked</div>
                    <div className="p-3 text-sm font-medium text-text border-r border-border">Status</div>
                    <div className="p-3 text-sm font-medium text-text">Bookings</div>
                  </div>

                  {/* Calendar Body */}
                  <div className="max-h-96 overflow-y-auto">
                    {calendarDates.map((date) => {
                      const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                      
                      if (selectedResource.resourceType === 'hall') {
                        const morning = getAvailabilityForDate(date, 'MORNING')
                        const evening = getAvailabilityForDate(date, 'EVENING')
                        const fullDay = getAvailabilityForDate(date, 'FULL_DAY')
                        
                        // Get all bookings for this date across all slots
                        const allBookings = [...morning.bookings, ...evening.bookings, ...fullDay.bookings]
                        const isExpanded = expandedDates[dateStr]
                        
                        return (
                          <div key={dateStr} className="grid grid-cols-8 border-b border-border hover:bg-surface-alt">
                            <div className="p-3 text-sm text-text border-r border-border">{dateStr}</div>
                            <div className={`p-3 text-sm border-r border-border cursor-pointer ${
                              morning.isBlocked ? 'text-red-600 bg-red-50' : 
                              morning.available === 0 ? 'text-orange-600 bg-orange-50' : 
                              'text-green-600 bg-green-50'
                            }`} onClick={() => morning.isBlocked || morning.available === 0 ? handleUnblock(date, 'MORNING') : handleBlock(date, 'MORNING')}>
                              {morning.isBlocked ? 'Blocked' : `${morning.available}/${morning.total}`}
                            </div>
                            <div className={`p-3 text-sm border-r border-border cursor-pointer ${
                              evening.isBlocked ? 'text-red-600 bg-red-50' : 
                              evening.available === 0 ? 'text-orange-600 bg-orange-50' : 
                              'text-green-600 bg-green-50'
                            }`} onClick={() => evening.isBlocked || evening.available === 0 ? handleUnblock(date, 'EVENING') : handleBlock(date, 'EVENING')}>
                              {evening.isBlocked ? 'Blocked' : `${evening.available}/${evening.total}`}
                            </div>
                            <div className={`p-3 text-sm border-r border-border cursor-pointer ${
                              fullDay.isBlocked ? 'text-red-600 bg-red-50' : 
                              fullDay.available === 0 ? 'text-orange-600 bg-orange-50' : 
                              'text-green-600 bg-green-50'
                            }`} onClick={() => fullDay.isBlocked || fullDay.available === 0 ? handleUnblock(date, 'FULL_DAY') : handleBlock(date, 'FULL_DAY')}>
                              {fullDay.isBlocked ? 'Blocked' : `${fullDay.available}/${fullDay.total}`}
                            </div>
                            <div className="p-3 text-sm text-text border-r border-border">{selectedResource.totalUnits}</div>
                            <div className="p-3 text-sm text-text border-r border-border">{selectedResource.totalUnits - morning.available}</div>
                            <div className="p-3 text-sm font-medium text-text border-r border-border">
                              {morning.isBlocked || evening.isBlocked || fullDay.isBlocked ? 'Blocked' : 'Available'}
                            </div>
                            <div className="p-3 text-sm text-text">
                              {allBookings.length > 0 ? (
                                <div className="space-y-1">
                                  {isExpanded ? (
                                    allBookings.map((booking, idx) => (
                                      <div key={idx} className="text-xs">
                                        <span className="font-medium">{booking.userName}</span>
                                        <span className="text-muted ml-1">({booking.status})</span>
                                        <span className="text-muted ml-1">- {booking.bookingId}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <>
                                      {allBookings.slice(0, 2).map((booking, idx) => (
                                        <div key={idx} className="text-xs">
                                          <span className="font-medium">{booking.userName}</span>
                                          <span className="text-muted ml-1">({booking.status})</span>
                                        </div>
                                      ))}
                                      {allBookings.length > 2 && (
                                        <div className="text-xs text-muted cursor-pointer hover:text-primary" onClick={() => toggleExpanded(dateStr)}>
                                          +{allBookings.length - 2} more
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {allBookings.length > 2 && isExpanded && (
                                    <div className="text-xs text-muted cursor-pointer hover:text-primary" onClick={() => toggleExpanded(dateStr)}>
                                      Show less
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted">No bookings</span>
                              )}
                            </div>
                          </div>
                        )
                      } else {
                        const availability = getAvailabilityForDate(date, 'NONE')
                        const isExpanded = expandedDates[dateStr]
                        
                        return (
                          <div key={dateStr} className="grid grid-cols-8 border-b border-border hover:bg-surface-alt">
                            <div className="p-3 text-sm text-text border-r border-border">{dateStr}</div>
                            <div className={`p-3 text-sm border-r border-border cursor-pointer ${
                              availability.isBlocked ? 'text-red-600 bg-red-50' : 
                              availability.available === 0 ? 'text-orange-600 bg-orange-50' : 
                              'text-green-600 bg-green-50'
                            }`} onClick={() => availability.isBlocked || availability.available === 0 ? handleUnblock(date, 'NONE') : handleBlock(date, 'NONE')}>
                              {availability.isBlocked ? 'Blocked' : `${availability.available}/${availability.total}`}
                            </div>
                            <div className="p-3 text-sm text-text border-r border-border">{availability.total}</div>
                            <div className="p-3 text-sm text-text border-r border-border">{availability.total - availability.available}</div>
                            <div className="p-3 text-sm font-medium text-text border-r border-border">
                              {availability.isBlocked ? 'Blocked' : availability.available > 0 ? 'Available' : 'Full'}
                            </div>
                            <div className="p-3 text-sm text-text">
                              {availability.bookings.length > 0 ? (
                                <div className="space-y-1">
                                  {isExpanded ? (
                                    availability.bookings.map((booking, idx) => (
                                      <div key={idx} className="text-xs">
                                        <span className="font-medium">{booking.userName}</span>
                                        <span className="text-muted ml-1">({booking.status})</span>
                                        <span className="text-muted ml-1">- {booking.bookingId}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <>
                                      {availability.bookings.slice(0, 2).map((booking, idx) => (
                                        <div key={idx} className="text-xs">
                                          <span className="font-medium">{booking.userName}</span>
                                          <span className="text-muted ml-1">({booking.status})</span>
                                        </div>
                                      ))}
                                      {availability.bookings.length > 2 && (
                                        <div className="text-xs text-muted cursor-pointer hover:text-primary" onClick={() => toggleExpanded(dateStr)}>
                                          +{availability.bookings.length - 2} more
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {availability.bookings.length > 2 && isExpanded && (
                                    <div className="text-xs text-muted cursor-pointer hover:text-primary" onClick={() => toggleExpanded(dateStr)}>
                                      Show less
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted">No bookings</span>
                              )}
                            </div>
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center py-8">
                  Select date range and click Load to view availability
                </p>
              )}

              <Alert variant="info" className="mt-4">
                <p className="text-sm">
                  Click on availability numbers to block/unblock specific dates. Green = Available, Orange = Full, Red = Blocked.
                </p>
              </Alert>
            </div>
          )}
        </Modal>
      </div>
    </>
  )
}

export default AdminAvailability
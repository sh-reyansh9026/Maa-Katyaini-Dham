import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminHallsApi } from '../api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Skeleton from '../../../components/ui/Skeleton'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Alert from '../../../components/ui/Alert'

const AdminHalls = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingHall, setEditingHall] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    capacity: '',
    priceFullDay: '',
    priceMorning: '',
    priceEvening: '',
    amenities: '',
    isActive: true,
  })
  const [formError, setFormError] = useState('')

  const queryClient = useQueryClient()

  const { data: hallsData, isLoading } = useQuery({
    queryKey: ['adminHalls'],
    queryFn: () => adminHallsApi.getAll(),
  })

  const deleteHallMutation = useMutation({
    mutationFn: (id) => adminHallsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminHalls'])
    },
    onError: (error) => {
      alert(error.message || 'Failed to delete hall')
    },
  })

  const createHallMutation = useMutation({
    mutationFn: (data) => adminHallsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminHalls'])
      setIsAddModalOpen(false)
      setFormData({
        name: '',
        description: '',
        type: '',
        capacity: '',
        priceFullDay: '',
        priceMorning: '',
        priceEvening: '',
        amenities: '',
        isActive: true,
      })
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to create hall')
    },
  })

  const updateHallMutation = useMutation({
    mutationFn: ({ id, data }) => adminHallsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminHalls'])
      setIsEditModalOpen(false)
      setEditingHall(null)
      setFormData({
        name: '',
        description: '',
        type: '',
        capacity: '',
        priceFullDay: '',
        priceMorning: '',
        priceEvening: '',
        amenities: '',
        isActive: true,
      })
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to update hall')
    },
  })

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? e.target.checked : value,
    })
  }

  const handleEdit = (hall) => {
    setEditingHall(hall)
    setFormData({
      name: hall.name,
      description: hall.description,
      type: hall.type,
      capacity: hall.capacity,
      priceFullDay: hall.priceFullDay,
      priceMorning: hall.priceMorning,
      priceEvening: hall.priceEvening,
      amenities: hall.amenities.join(', '),
      isActive: hall.isActive,
    })
    setIsEditModalOpen(true)
    setFormError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    // Validate required fields
    if (!formData.name || !formData.description || !formData.type || 
        !formData.capacity || !formData.priceFullDay) {
      setFormError('Please fill in all required fields')
      return
    }

    // Convert amenities string to array
    const amenitiesArray = formData.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0)

    // Convert numeric fields
    const dataToSubmit = {
      ...formData,
      capacity: parseInt(formData.capacity),
      priceFullDay: parseFloat(formData.priceFullDay),
      priceMorning: formData.priceMorning ? parseFloat(formData.priceMorning) : undefined,
      priceEvening: formData.priceEvening ? parseFloat(formData.priceEvening) : undefined,
      amenities: amenitiesArray,
    }

    createHallMutation.mutate(dataToSubmit)
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    setFormError('')

    // Validate required fields
    if (!formData.name || !formData.description || !formData.type || 
        !formData.capacity || !formData.priceFullDay) {
      setFormError('Please fill in all required fields')
      return
    }

    // Convert amenities string to array
    const amenitiesArray = formData.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0)

    // Convert numeric fields
    const dataToSubmit = {
      ...formData,
      capacity: parseInt(formData.capacity),
      priceFullDay: parseFloat(formData.priceFullDay),
      priceMorning: formData.priceMorning ? parseFloat(formData.priceMorning) : undefined,
      priceEvening: formData.priceEvening ? parseFloat(formData.priceEvening) : undefined,
      amenities: amenitiesArray,
    }

    updateHallMutation.mutate({
      id: editingHall._id,
      data: dataToSubmit
    })
  }

  return (
    <>
      <Helmet>
        <title>Admin Mandaps - Maa Katyaini Dham</title>
      </Helmet>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-text">Mandap Management</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Mandap</Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Capacity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hallsData?.data?.halls?.map((hall) => (
                      <tr key={hall._id} className="border-b border-border">
                        <td className="py-3 px-4 text-sm text-text">{hall.name}</td>
                        <td className="py-3 px-4 text-sm text-text">{hall.type}</td>
                        <td className="py-3 px-4 text-sm text-text">{hall.capacity}</td>
                        <td className="py-3 px-4 text-sm text-text">₹{hall.priceFullDay}</td>
                        <td className="py-3 px-4 text-sm text-text">
                          {hall.isActive ? 'Active' : 'Inactive'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleEdit(hall)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this mandap?')) {
                                  deleteHallMutation.mutate(hall._id)
                                }
                              }}
                              disabled={deleteHallMutation.isPending}
                            >
                              {deleteHallMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
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

      {/* Add Hall Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Mandap"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}

          <Input
            label="Mandap Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Grand Hall"
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              placeholder="Mandap description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Mandap Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              required
            >
              <option value="">Select Type</option>
              <option value="Banquet">Banquet Hall</option>
              <option value="Wedding">Wedding Hall</option>
              <option value="Conference">Conference Hall</option>
              <option value="Party">Party Hall</option>
            </select>
          </div>

          <Input
            label="Capacity (Guests)"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleInputChange}
            required
            placeholder="e.g., 200"
          />

          <Input
            label="Full Day Price (₹)"
            name="priceFullDay"
            type="number"
            min="0"
            value={formData.priceFullDay}
            onChange={handleInputChange}
            required
            placeholder="e.g., 25000"
          />

          <Input
            label="Morning Slot Price (₹)"
            name="priceMorning"
            type="number"
            min="0"
            value={formData.priceMorning}
            onChange={handleInputChange}
            placeholder="e.g., 10000 (optional)"
          />

          <Input
            label="Evening Slot Price (₹)"
            name="priceEvening"
            type="number"
            min="0"
            value={formData.priceEvening}
            onChange={handleInputChange}
            placeholder="e.g., 15000 (optional)"
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Amenities (comma-separated)
            </label>
            <input
              name="amenities"
              type="text"
              value={formData.amenities}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              placeholder="e.g., WiFi, AC, Stage, Sound System"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-text">
              Active (visible to users)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-fg rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={createHallMutation.isPending}
            >
              {createHallMutation.isPending ? 'Creating...' : 'Create Mandap'}
            </button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              disabled={createHallMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Hall Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Mandap"
        size="lg"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}

          <Input
            label="Mandap Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Grand Hall"
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              placeholder="Mandap description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Mandap Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              required
            >
              <option value="">Select Type</option>
              <option value="Banquet">Banquet Hall</option>
              <option value="Wedding">Wedding Hall</option>
              <option value="Conference">Conference Hall</option>
              <option value="Party">Party Hall</option>
            </select>
          </div>

          <Input
            label="Capacity (Guests)"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleInputChange}
            required
            placeholder="e.g., 200"
          />

          <Input
            label="Full Day Price (₹)"
            name="priceFullDay"
            type="number"
            min="0"
            value={formData.priceFullDay}
            onChange={handleInputChange}
            required
            placeholder="e.g., 25000"
          />

          <Input
            label="Morning Slot Price (₹)"
            name="priceMorning"
            type="number"
            min="0"
            value={formData.priceMorning}
            onChange={handleInputChange}
            placeholder="e.g., 10000 (optional)"
          />

          <Input
            label="Evening Slot Price (₹)"
            name="priceEvening"
            type="number"
            min="0"
            value={formData.priceEvening}
            onChange={handleInputChange}
            placeholder="e.g., 15000 (optional)"
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Amenities (comma-separated)
            </label>
            <input
              name="amenities"
              type="text"
              value={formData.amenities}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              placeholder="e.g., WiFi, AC, Stage, Sound System"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="editIsActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="editIsActive" className="ml-2 text-sm text-text">
              Active (visible to users)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-fg rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updateHallMutation.isPending}
            >
              {updateHallMutation.isPending ? 'Updating...' : 'Update Mandap'}
            </button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateHallMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AdminHalls

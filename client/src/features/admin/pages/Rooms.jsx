import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminRoomsApi, adminUploadsApi } from '../api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import Skeleton from '../../../components/ui/Skeleton'
import Alert from '../../../components/ui/Alert'

const AdminRooms = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    price: '',
    maxGuests: '',
    totalUnits: '',
    amenities: '',
    isActive: true,
  })
  const [formError, setFormError] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  
  const queryClient = useQueryClient()
  
  const { data: roomsData, isLoading } = useQuery({
    queryKey: ['adminRooms'],
    queryFn: () => adminRoomsApi.getAll(),
  })

  const createRoomMutation = useMutation({
    mutationFn: (data) => adminRoomsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminRooms'])
      setIsAddModalOpen(false)
      setFormData({
        name: '',
        description: '',
        type: '',
        price: '',
        maxGuests: '',
        totalUnits: '',
        amenities: '',
        isActive: true,
      })
      setUploadedImages([])
      setFormError('')
    },
    onError: (error) => {
      console.error('Create room error:', error)
      setFormError(error.message || 'Failed to create room')
    },
  })

  const deleteRoomMutation = useMutation({
    mutationFn: (id) => adminRoomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminRooms'])
    },
    onError: (error) => {
      alert(error.message || 'Failed to delete room')
    },
  })

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, data }) => adminRoomsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminRooms'])
      setIsEditModalOpen(false)
      setEditingRoom(null)
      setFormData({
        name: '',
        description: '',
        type: '',
        price: '',
        maxGuests: '',
        totalUnits: '',
        amenities: '',
        isActive: true,
      })
      setUploadedImages([])
      setFormError('')
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to update room')
    },
  })

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? e.target.checked : value,
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setFormError('File size must be less than 5MB')
      e.target.value = '' // Reset file input
      return
    }

    setIsUploading(true)
    setFormError('')

    try {
      // Create FormData and append the file
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'rooms')

      console.log('Uploading image, file size:', file.size, 'bytes')

      const result = await adminUploadsApi.uploadImageFormData(formData)
      console.log('Upload result:', result)

      setUploadedImages([...uploadedImages, {
        publicId: result.data.publicId,
        url: result.data.url
      }])
      setIsUploading(false)
      e.target.value = '' // Reset file input
    } catch (error) {
      console.error('Image upload error:', error)
      setFormError(error.message || 'Failed to upload image')
      setIsUploading(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleRemoveImage = (publicId) => {
    setUploadedImages(uploadedImages.filter(img => img.publicId !== publicId))
  }

  const handleEdit = (room) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      description: room.description,
      type: room.type,
      price: room.price,
      maxGuests: room.maxGuests,
      totalUnits: room.totalUnits,
      amenities: room.amenities.join(', '),
      isActive: room.isActive,
    })
    setUploadedImages(room.images || [])
    setIsEditModalOpen(true)
    setFormError('')
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    console.log('Update form submitted')
    console.log('FormData:', formData)
    console.log('Editing room:', editingRoom)
    setFormError('')

    // Validate required fields
    if (!formData.name || !formData.description || !formData.type ||
        !formData.price || !formData.maxGuests || !formData.totalUnits) {
      setFormError('Please fill in all required fields')
      console.log('Validation failed')
      return
    }

    // Validate images
    if (uploadedImages.length === 0) {
      // setFormError('Please upload at least one image')
      console.log('Image validation failed')
      // return
    }

    // Convert amenities string to array
    const amenitiesArray = formData.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0)

    // Convert numeric fields
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests),
      totalUnits: parseInt(formData.totalUnits),
      amenities: amenitiesArray,
      images: uploadedImages,
    }

    console.log('Submitting update with data:', dataToSubmit)
    updateRoomMutation.mutate({
      id: editingRoom._id,
      data: dataToSubmit
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    setFormError('')

    // Validate required fields
    if (!formData.name || !formData.description || !formData.type ||
        !formData.price || !formData.maxGuests || !formData.totalUnits) {
      setFormError('Please fill in all required fields')
      console.log('Validation failed')
      return
    }

    // Validate images
    if (uploadedImages.length === 0) {
      // setFormError('Please upload at least one image')
      console.log('Image validation failed')
      // return
    }

    // Convert amenities string to array
    const amenitiesArray = formData.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0)

    const roomData = {
      ...formData,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests),
      totalUnits: parseInt(formData.totalUnits),
      amenities: amenitiesArray,
      images: uploadedImages,
    }

    console.log('Creating room with data:', roomData)
    createRoomMutation.mutate(roomData)
  }

  const roomTypeOptions = [
    { value: '', label: 'Select Room Type' },
    { value: 'AC', label: 'AC' },
    { value: 'Non-AC', label: 'Non-AC' },
    { value: 'Family', label: 'Family' },
    { value: 'Dormitory', label: 'Dormitory' },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Rooms - Maa Katyaini Dham</title>
      </Helmet>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-text">Room Management</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Room</Button>
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Max Guests</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomsData?.data?.rooms?.map((room) => (
                      <tr key={room._id} className="border-b border-border">
                        <td className="py-3 px-4 text-sm text-text">{room.name}</td>
                        <td className="py-3 px-4 text-sm text-text">{room.type}</td>
                        <td className="py-3 px-4 text-sm text-text">₹{room.price}</td>
                        <td className="py-3 px-4 text-sm text-text">{room.maxGuests}</td>
                        <td className="py-3 px-4 text-sm text-text">
                          {room.isActive ? 'Active' : 'Inactive'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleEdit(room)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this room?')) {
                                  deleteRoomMutation.mutate(room._id)
                                }
                              }}
                              disabled={deleteRoomMutation.isPending}
                            >
                              {deleteRoomMutation.isPending ? 'Deleting...' : 'Delete'}
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

      {/* Add Room Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Room"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}

          <Input
            label="Room Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Deluxe Room 101"
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              placeholder="Describe the room..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Room Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
            >
              {roomTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price per Night (₹)"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="e.g., 1500"
            />
            <Input
              label="Max Guests"
              name="maxGuests"
              type="number"
              min="1"
              value={formData.maxGuests}
              onChange={handleInputChange}
              required
              placeholder="e.g., 2"
            />
          </div>

          <Input
            label="Total Units"
            name="totalUnits"
            type="number"
            min="1"
            value={formData.totalUnits}
            onChange={handleInputChange}
            required
            placeholder="e.g., 5"
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
              placeholder="e.g., WiFi, AC, TV, Room Service"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Room Images *
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-fg file:cursor-pointer disabled:opacity-50"
              />
              <p className="text-xs text-muted mt-2">Max file size: 5MB</p>
              {isUploading && (
                <p className="text-sm text-primary mt-2">Uploading image...</p>
              )}
            </div>
            {uploadedImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {uploadedImages.map((img) => (
                  <div key={img.publicId} className="relative">
                    <img
                      src={img.url}
                      alt="Room preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.publicId)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={createRoomMutation.isPending}
            >
              {createRoomMutation.isPending ? 'Creating...' : 'Create Room'}
            </button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              disabled={createRoomMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Room"
        size="lg"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}

          <Input
            label="Room Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Deluxe Room 101"
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
              placeholder="Room description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Room Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              required
            >
              <option value="">Select Type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Family">Family</option>
              <option value="Dormitory">Dormitory</option>
            </select>
          </div>

          <Input
            label="Price per Night (₹)"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            required
            placeholder="e.g., 2000"
          />

          <Input
            label="Maximum Guests"
            name="maxGuests"
            type="number"
            min="1"
            value={formData.maxGuests}
            onChange={handleInputChange}
            required
            placeholder="e.g., 4"
          />

          <Input
            label="Total Units"
            name="totalUnits"
            type="number"
            min="1"
            value={formData.totalUnits}
            onChange={handleInputChange}
            required
            placeholder="e.g., 5"
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
              placeholder="e.g., WiFi, AC, TV, Room Service"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Room Images
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-fg file:cursor-pointer disabled:opacity-50"
              />
              <p className="text-xs text-muted mt-2">Max file size: 5MB</p>
              {isUploading && (
                <p className="text-sm text-primary mt-2">Uploading image...</p>
              )}
            </div>
            {uploadedImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {uploadedImages.map((img) => (
                  <div key={img.publicId} className="relative">
                    <img
                      src={img.url}
                      alt="Room preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.publicId)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={updateRoomMutation.isPending}
            >
              {updateRoomMutation.isPending ? 'Updating...' : 'Update Room'}
            </button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateRoomMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AdminRooms

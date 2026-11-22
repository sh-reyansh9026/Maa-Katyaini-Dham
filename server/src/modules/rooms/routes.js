import express from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { authenticate } from '../../middlewares/auth.js'
import { requireAdmin } from '../../middlewares/auth.js'
import { validate } from '../../middlewares/validate.js'
import { createRoomSchema, updateRoomSchema, getRoomSchema, queryRoomsSchema } from './validation.js'
import {
  getAllRoomsController,
  getRoomByIdController,
  createRoomController,
  updateRoomController,
  deleteRoomController,
  getRoomTypesController,
} from './controller.js'

const router = express.Router()

// GET /api/rooms/types - Get room types (public) - must come before /:id
router.get('/types', asyncHandler(getRoomTypesController))

// GET /api/rooms - Get all rooms (public)
router.get('/', validate(queryRoomsSchema), asyncHandler(getAllRoomsController))

// GET /api/rooms/:id - Get room by ID (public)
router.get('/:id', validate(getRoomSchema), asyncHandler(getRoomByIdController))

// POST /api/rooms - Create a new room (admin only)
router.post('/', authenticate, requireAdmin, validate(createRoomSchema), asyncHandler(createRoomController))

// PUT /api/rooms/:id - Update a room (admin only)
router.put('/:id', authenticate, requireAdmin, validate(updateRoomSchema), asyncHandler(updateRoomController))

// DELETE /api/rooms/:id - Delete a room (admin only)
router.delete('/:id', authenticate, requireAdmin, validate(getRoomSchema), asyncHandler(deleteRoomController))

export default router

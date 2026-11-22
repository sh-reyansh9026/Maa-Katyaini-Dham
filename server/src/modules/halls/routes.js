import express from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { authenticate } from '../../middlewares/auth.js'
import { requireAdmin } from '../../middlewares/auth.js'
import { validate } from '../../middlewares/validate.js'
import { createHallSchema, updateHallSchema, getHallSchema, queryHallsSchema } from './validation.js'
import {
  getAllHallsController,
  getHallByIdController,
  createHallController,
  updateHallController,
  deleteHallController,
  getHallTypesController,
} from './controller.js'

const router = express.Router()

// GET /api/halls/types - Get hall types (public) - must come before /:id
router.get('/types', asyncHandler(getHallTypesController))

// GET /api/halls - Get all halls (public)
router.get('/', validate(queryHallsSchema), asyncHandler(getAllHallsController))

// GET /api/halls/:id - Get hall by ID (public)
router.get('/:id', validate(getHallSchema), asyncHandler(getHallByIdController))

// POST /api/halls - Create a new hall (admin only)
router.post('/', authenticate, requireAdmin, validate(createHallSchema), asyncHandler(createHallController))

// PUT /api/halls/:id - Update a hall (admin only)
router.put('/:id', authenticate, requireAdmin, validate(updateHallSchema), asyncHandler(updateHallController))

// DELETE /api/halls/:id - Delete a hall (admin only)
router.delete('/:id', authenticate, requireAdmin, validate(getHallSchema), asyncHandler(deleteHallController))

export default router

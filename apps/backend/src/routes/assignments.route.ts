import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { assignmentsController } from '../controllers/assignments.controller'
import { protect } from '../middleware/auth'

export const assignmentsRouter = Router()

// Apply protect middleware to all routes in this router
assignmentsRouter.use(protect)

// Rate limiter: max 5 generation requests per IP per minute
const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many generation requests. Please wait before trying again.',
    code: 'RATE_LIMITED',
  },
})

// GET /api/assignments
assignmentsRouter.get('/', assignmentsController.list)

// POST /api/assignments
assignmentsRouter.post('/', assignmentsController.create)

// GET /api/assignments/:id
assignmentsRouter.get('/:id', assignmentsController.get)

// DELETE /api/assignments/:id
assignmentsRouter.delete('/:id', assignmentsController.delete)

// POST /api/assignments/:id/generate  ← rate limited
assignmentsRouter.post('/:id/generate', generateLimiter, assignmentsController.triggerGeneration)

// GET /api/assignments/:id/result
assignmentsRouter.get('/:id/result', assignmentsController.getResult)

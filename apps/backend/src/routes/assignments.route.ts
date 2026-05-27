import { Router } from 'express';
import { assignmentsController } from '../controllers/assignments.controller';

export const assignmentsRouter = Router();

// GET /api/assignments
assignmentsRouter.get('/', assignmentsController.list);

// POST /api/assignments
assignmentsRouter.post('/', assignmentsController.create);

// GET /api/assignments/:id
assignmentsRouter.get('/:id', assignmentsController.get);

// DELETE /api/assignments/:id
assignmentsRouter.delete('/:id', assignmentsController.delete);

// POST /api/assignments/:id/generate
assignmentsRouter.post('/:id/generate', assignmentsController.triggerGeneration);

// GET /api/assignments/:id/result
assignmentsRouter.get('/:id/result', assignmentsController.getResult);

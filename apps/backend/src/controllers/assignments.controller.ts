import { Request, Response } from 'express';
import { z } from 'zod';
import { assignmentService } from '../services/assignment.service';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import type { CreateAssignmentInput } from '@vedaai/shared';

const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Grade is required'),
  schoolName: z.string().min(1, 'School name is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD').or(z.string().datetime()),
  timeLimit: z.number().int().positive().max(300),
  additionalInstructions: z.string().optional().default(''),
  fileUrl: z.string().optional(),
  questionConfig: z
    .array(
      z.object({
        type: z.enum(['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blank']),
        count: z.number().int().min(1).max(50),
        marksEach: z.number().int().min(1).max(100),
      })
    )
    .min(1, 'At least one question type is required'),
});

export const assignmentsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!._id.toString();
    const list = await assignmentService.findAll(userId);
    res.status(200).json({ success: true, data: list });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!._id.toString();
    const parsedInput = CreateAssignmentSchema.parse(req.body);
    
    const assignmentData = {
      ...parsedInput,
      assignedBy: authReq.user!.name,
    };

    const assignment = await assignmentService.create(assignmentData as CreateAssignmentInput, userId);
    res.status(201).json({ success: true, data: assignment });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!._id.toString();
    const { id } = req.params;
    
    const assignment = await assignmentService.findById(id);
    if (assignment.userId.toString() !== userId) {
      throw new AppError('Not authorized to access this assignment', 403, 'FORBIDDEN');
    }
    
    res.status(200).json({ success: true, data: assignment });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!._id.toString();
    const { id } = req.params;
    
    const assignment = await assignmentService.findById(id);
    if (assignment.userId.toString() !== userId) {
      throw new AppError('Not authorized to delete this assignment', 403, 'FORBIDDEN');
    }
    
    await assignmentService.delete(id, userId);
    res.status(200).json({ success: true, data: { deletedId: id } });
  }),

  triggerGeneration: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!._id.toString();
    const { id } = req.params;
    
    const assignment = await assignmentService.findById(id);
    if (assignment.userId.toString() !== userId) {
      throw new AppError('Not authorized to generate paper for this assignment', 403, 'FORBIDDEN');
    }
    
    const jobId = await assignmentService.enqueueJob(id, userId);
    res.status(202).json({
      success: true,
      data: {
        jobId,
        assignmentId: id,
      },
    });
  }),

  getResult: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!._id.toString();
    const { id } = req.params;
    
    const assignment = await assignmentService.findById(id);
    if (assignment.userId.toString() !== userId) {
      throw new AppError('Not authorized to access this result', 403, 'FORBIDDEN');
    }
    
    const result = await assignmentService.getResult(id);
    res.status(200).json({ success: true, data: result });
  }),
};

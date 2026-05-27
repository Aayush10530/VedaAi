import { AssignmentModel, AssignmentDocument } from '../models/Assignment.model';
import { cacheService } from './cache.service';
import { addGenerationJob, generationQueue } from '../queues/generation.queue';
import { AppError, NotFoundError } from '../middleware/errorHandler';
import type { CreateAssignmentInput } from '@vedaai/shared';

export const assignmentService = {
  async findAll(): Promise<AssignmentDocument[]> {
    const cacheKey = 'assignment:list';
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) {
      return cached as any;
    }

    const assignments = await AssignmentModel.find()
      .sort({ createdAt: -1 })
      .exec();
    
    await cacheService.set(cacheKey, assignments, 300);
    return assignments;
  },

  async create(input: CreateAssignmentInput): Promise<AssignmentDocument> {
    const assignment = await AssignmentModel.create(input);
    await cacheService.del('assignment:list');
    return assignment;
  },

  async findById(id: string): Promise<AssignmentDocument> {
    const cacheKey = `assignment:${id}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      if (cached.status !== 'generating') {
        return cached as any;
      }
    }

    const assignment = await AssignmentModel.findById(id).exec();
    if (!assignment) {
      throw new NotFoundError(`Assignment ${id} not found`);
    }

    if (assignment.status === 'generating') {
      const job = await generationQueue.getJob(id);
      let isActive = false;
      if (job) {
        const state = await job.getState();
        if (state === 'active' || state === 'waiting' || state === 'delayed') {
          isActive = true;
        }
      }
      if (!isActive) {
        assignment.status = 'failed';
        await assignment.save();
        await cacheService.del('assignment:list');
        await cacheService.del(`assignment:${id}`);
      }
    }

    await cacheService.set(cacheKey, assignment, 300);
    return assignment;
  },

  async delete(id: string): Promise<void> {
    const result = await AssignmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundError(`Assignment ${id} not found`);
    }

    await cacheService.del('assignment:list');
    await cacheService.del(`assignment:${id}`);
    await cacheService.del(`result:${id}`);
  },

  async enqueueJob(id: string): Promise<string> {
    const assignment = await AssignmentModel.findById(id).exec();
    if (!assignment) {
      throw new NotFoundError(`Assignment ${id} not found`);
    }

    if (assignment.status === 'generating') {
      const job = await generationQueue.getJob(id);
      let isActive = false;
      if (job) {
        const state = await job.getState();
        if (state === 'active' || state === 'waiting' || state === 'delayed') {
          isActive = true;
        }
      }
      if (isActive) {
        throw new AppError('Question generation is already in progress', 400, 'ALREADY_PROCESSING');
      }
    }

    const jobId = await addGenerationJob(id);
    
    assignment.jobId = jobId;
    assignment.status = 'generating';
    await assignment.save();

    await cacheService.del('assignment:list');
    await cacheService.del(`assignment:${id}`);

    return jobId;
  },

  async getResult(id: string): Promise<any> {
    const cacheKey = `result:${id}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const assignment = await AssignmentModel.findById(id).exec();
    if (!assignment) {
      throw new NotFoundError(`Assignment ${id} not found`);
    }

    if (assignment.status !== 'complete' || !assignment.result) {
      throw new AppError('Question paper is not ready or failed to generate', 400, 'RESULT_NOT_AVAILABLE');
    }

    await cacheService.set(cacheKey, assignment.result, 3600);
    return assignment.result;
  },
};

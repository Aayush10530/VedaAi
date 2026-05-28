import type { AssignmentDocument, QuestionPaperResult } from '../models/Assignment.model'
import { AssignmentModel } from '../models/Assignment.model'
import { cacheService, CacheKeys } from './cache.service'
import { addGenerationJob, generationQueue } from '../queues/generation.queue'
import { AppError, NotFoundError } from '../middleware/errorHandler'
import { emitJobQueued } from '../websocket/jobEvents'
import type { CreateAssignmentInput } from '@vedaai/shared'

export const assignmentService = {

  async findAll(userId: string): Promise<AssignmentDocument[]> {
    const cacheKey = CacheKeys.assignmentList(userId)
    const cached = await cacheService.get<AssignmentDocument[]>(cacheKey)
    if (cached) return cached

    const assignments = await AssignmentModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean<AssignmentDocument[]>()
      .exec()

    await cacheService.set(cacheKey, assignments, 300)
    return assignments
  },

  async create(input: CreateAssignmentInput, userId: string): Promise<AssignmentDocument> {
    const assignment = await AssignmentModel.create({ ...input, userId })
    await cacheService.del(CacheKeys.assignmentList(userId))
    return assignment.toObject() as AssignmentDocument
  },

  async findById(id: string): Promise<AssignmentDocument> {
    const cacheKey = CacheKeys.assignmentDetail(id)

    // Never serve cached version for generating assignments —
    // we need live status so the stale-job check below runs
    const cached = await cacheService.get<AssignmentDocument>(cacheKey)
    if (cached && cached.status !== 'generating') {
      return cached
    }

    const assignment = await AssignmentModel.findById(id).exec()
    if (!assignment) {
      throw new NotFoundError(`Assignment ${id} not found`)
    }

    // BUG C FIX: Only auto-fail if STILL generating AND the job is gone
    // AND it has been generating for more than 5 minutes.
    // Without the timeout guard, a just-completed job (removed by removeOnComplete)
    // would cause getJob() to return null and incorrectly mark the assignment as failed.
    if (assignment.status === 'generating' && assignment.jobId) {
      const job = await generationQueue.getJob(assignment.jobId)   // BUG 1 FIX: use assignment.jobId
      const updatedAt = new Date(assignment.updatedAt).getTime()
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000

      if (!job && updatedAt < fiveMinutesAgo) {
        assignment.status = 'failed'
        await assignment.save()
        await cacheService.del(CacheKeys.assignmentList(assignment.userId.toString()))
        await cacheService.del(cacheKey)
      }
    }

    const plain = assignment.toObject() as AssignmentDocument
    await cacheService.set(cacheKey, plain, 300)
    return plain
  },

  async delete(id: string, userId: string): Promise<void> {
    const assignment = await AssignmentModel.findById(id).exec()
    if (!assignment) {
      throw new NotFoundError(`Assignment ${id} not found`)
    }
    await assignment.deleteOne()
    await cacheService.del(CacheKeys.assignmentList(userId))
    await cacheService.del(CacheKeys.assignmentDetail(id))
    await cacheService.del(CacheKeys.assignmentResult(id))
  },

  async enqueueJob(id: string, userId: string): Promise<string> {
    const assignment = await AssignmentModel.findById(id).exec()
    if (!assignment) {
      throw new NotFoundError(`Assignment ${id} not found`)
    }

    // BUG 1 FIX: use assignment.jobId, not id
    if (assignment.status === 'generating' && assignment.jobId) {
      const job = await generationQueue.getJob(assignment.jobId)
      if (job) {
        const state = await job.getState()
        if (state === 'active' || state === 'waiting' || state === 'delayed') {
          throw new AppError(
            'Question generation is already in progress',
            400,
            'ALREADY_PROCESSING'
          )
        }
      }
    }

    // BUG 1 FIX: Clean up any lingering failed job before re-enqueueing.
    // Without this, addGenerationJob throws "Job already exists" because
    // removeOnFail: false keeps the failed job with id = assignmentId.
    if (assignment.jobId) {
      const existingJob = await generationQueue.getJob(assignment.jobId)
      if (existingJob) {
        const state = await existingJob.getState()
        if (state === 'failed') {
          await existingJob.remove()
        }
      }
    }

    const jobId = await addGenerationJob(id)

    assignment.jobId = jobId
    assignment.status = 'generating'
    await assignment.save()

    await cacheService.del(CacheKeys.assignmentList(userId))
    await cacheService.del(CacheKeys.assignmentDetail(id))

    // BUG 11 FIX: Emit job:queued so frontend knows to start the progress screen
    await emitJobQueued(jobId, id)

    return jobId
  },

  async getResult(id: string): Promise<QuestionPaperResult> {
    const cacheKey = CacheKeys.assignmentResult(id)
    const cached = await cacheService.get<QuestionPaperResult>(cacheKey)
    if (cached) return cached

    const assignment = await AssignmentModel.findById(id).lean<AssignmentDocument>().exec()
    if (!assignment) {
      throw new NotFoundError(`Assignment ${id} not found`)
    }

    if (assignment.status !== 'complete' || !assignment.result) {
      throw new AppError(
        'Question paper is not ready or failed to generate',
        400,
        'RESULT_NOT_AVAILABLE'
      )
    }

    await cacheService.set(cacheKey, assignment.result, 3600)
    return assignment.result
  },
}

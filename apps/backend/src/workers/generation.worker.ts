import 'dotenv/config'
import { Worker, Job } from 'bullmq'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import { connectDB } from '../config/db'
import { redis } from '../config/redis'
import { AssignmentModel } from '../models/Assignment.model'
import { buildPrompt } from '../services/ai/promptBuilder'
import { callGroq } from '../services/ai/groqClient'
import { parseGroqResponse } from '../services/ai/responseParser'
import { emitJobProgress, emitJobComplete, emitJobFailed } from '../websocket/jobEvents'
import type { Assignment } from '@vedaai/shared'
import type { QuestionPaperResult } from '../models/Assignment.model'
import { env } from '../config/env'
import { CacheKeys } from '../services/cache.service'

interface GenerationJobData {
  assignmentId: string
}

import mongoose from 'mongoose';

if (mongoose.connection.readyState === 0) {
  connectDB().catch((err) => {
    console.error('[Worker] MongoDB connection failed:', err)
    process.exit(1)
  })
}

const redisUrl = new URL(env.REDIS_URL)

const worker = new Worker<GenerationJobData>(
  'generation',
  async (job: Job<GenerationJobData>) => {
    const { assignmentId } = job.data
    const jobId = job.id!
    let userId: string | undefined

    try {
      await emitJobProgress(jobId, 'Fetching assignment details...', 10)
      const assignment = await AssignmentModel.findById(assignmentId)
      if (!assignment) {
        throw new Error(`Assignment ${assignmentId} not found`)
      }
      userId = assignment.userId.toString()

      assignment.status = 'generating'
      assignment.jobId = jobId
      await assignment.save()

      let extractedText: string | undefined
      if (assignment.fileUrl) {
        try {
          await emitJobProgress(jobId, 'Extracting content from uploaded file...', 25)
          if (fs.existsSync(assignment.fileUrl)) {
            const buffer = fs.readFileSync(assignment.fileUrl)
            if (assignment.fileUrl.toLowerCase().endsWith('.pdf')) {
              const data = await pdfParse(buffer)
              extractedText = data.text
            } else {
              extractedText = buffer.toString('utf-8')
            }
            assignment.extractedText = extractedText
            await assignment.save()
          }
        } catch (fileErr) {
          console.warn('[Worker] File extraction failed, continuing without it:', fileErr)
        }
      }

      await emitJobProgress(jobId, 'Structuring AI prompt parameters...', 40)
      const assignmentPlain = assignment.toObject({ flattenObjectIds: true }) as unknown as Partial<Assignment>
      const prompt = buildPrompt(assignmentPlain, extractedText)

      await emitJobProgress(jobId, 'Generating question sections with AI...', 60)
      const rawResponse = await callGroq(prompt)

      await emitJobProgress(jobId, 'Validating question structures against schema...', 80)
      const paperOutput = parseGroqResponse(rawResponse)

      const paperToEmbed = {
        schoolName: assignment.schoolName,
        subject: assignment.subject,
        grade: assignment.grade,
        timeMinutes: assignment.timeLimit,
        maxMarks: paperOutput.maxMarks,
        generalInstructions: paperOutput.generalInstructions,
        sections: paperOutput.sections,
        answerKey: paperOutput.answerKey,
        generatedAt: new Date(),
      }

      const paperForCache = {
        assignmentId,
        ...paperToEmbed,
      }

      await emitJobProgress(jobId, 'Saving finalized question paper to database...', 90)
      assignment.status = 'complete'
      assignment.result = paperToEmbed as QuestionPaperResult
      await assignment.save()

      await redis.setex(CacheKeys.assignmentResult(assignmentId), 3600, JSON.stringify(paperForCache))
      if (userId) {
        await redis.del(CacheKeys.assignmentList(userId))
      }
      await redis.del(CacheKeys.assignmentDetail(assignmentId))

      await emitJobProgress(jobId, 'Done!', 100)
      await new Promise<void>(resolve => setTimeout(resolve, 400))
      await emitJobComplete(jobId, assignmentId)

    } catch (error) {
      console.error('[Worker] Generation pipeline failed:', error)

      try {
        await AssignmentModel.findByIdAndUpdate(assignmentId, { status: 'failed' })
        if (userId) {
          await redis.del(CacheKeys.assignmentList(userId))
        }
        await redis.del(CacheKeys.assignmentDetail(assignmentId))
      } catch (dbErr) {
        console.error('[Worker] Failed to write failure status to DB:', dbErr)
      }

      await emitJobFailed(
        jobId,
        error instanceof Error ? error.message : 'Unknown generation error'
      )
      throw error
    }
  },
  {
    connection: {
      host: redisUrl.hostname,
      port: Number(redisUrl.port) || 6379,
      username: redisUrl.username ? decodeURIComponent(redisUrl.username) : undefined,
      password: redisUrl.password ? decodeURIComponent(redisUrl.password) : undefined,
      maxRetriesPerRequest: null,
      keepAlive: 10000,
      ...(redisUrl.protocol === 'rediss:' ? { tls: {} } : {}),
    },
    concurrency: 2,
  }
)
worker.on('ready', () => {
  console.log('[Worker] Generation worker ready — listening for jobs...')
})

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`)
})

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message)
})

worker.on('error', (err) => {
  console.error('[Worker] Worker error:', err)
})

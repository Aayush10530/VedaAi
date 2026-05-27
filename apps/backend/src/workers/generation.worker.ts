import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { connectDB } from '../config/db';
import { redis } from '../config/redis';
import { AssignmentModel } from '../models/Assignment.model';
import { buildPrompt } from '../services/ai/promptBuilder';
import { callGroq } from '../services/ai/groqClient';
import { parseGroqResponse } from '../services/ai/responseParser';
import { emitJobProgress, emitJobComplete, emitJobFailed } from '../websocket/jobEvents';

interface GenerationJobData {
  assignmentId: string;
}

connectDB().catch((err) => {
  console.error('MongoDB connection failed in worker:', err);
  process.exit(1);
});

new Worker<GenerationJobData>(
  'generation',
  async (job: Job<GenerationJobData>) => {
    const { assignmentId } = job.data;
    const jobId = job.id!;

    try {
      await emitJobProgress(jobId, 'Fetching assignment details...', 10);
      const assignment = await AssignmentModel.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment ${assignmentId} not found`);
      }

      assignment.status = 'generating';
      assignment.jobId = jobId;
      await assignment.save();

      let extractedText: string | undefined;
      if (assignment.fileUrl) {
        try {
          await emitJobProgress(jobId, 'Extracting content from uploaded file...', 25);
          if (fs.existsSync(assignment.fileUrl)) {
            const buffer = fs.readFileSync(assignment.fileUrl);
            
            if (assignment.fileUrl.toLowerCase().endsWith('.pdf')) {
              const data = await pdfParse(buffer);
              extractedText = data.text;
            } else {
              extractedText = buffer.toString('utf-8');
            }
            
            assignment.extractedText = extractedText;
            await assignment.save();
          }
        } catch (fileErr) {
          console.warn('File extraction error:', fileErr);
        }
      }

      await emitJobProgress(jobId, 'Structuring AI prompt parameters...', 40);
      const prompt = buildPrompt(assignment.toObject() as any, extractedText);

      await emitJobProgress(jobId, 'Generating question sections with AI...', 60);
      const rawResponse = await callGroq(prompt);

      await emitJobProgress(jobId, 'Validating question structures against schema...', 80);
      const paperOutput = parseGroqResponse(rawResponse);

      const questionPaper = {
        assignmentId,
        schoolName: assignment.schoolName,
        subject: assignment.subject,
        grade: assignment.grade,
        timeMinutes: assignment.timeLimit,
        maxMarks: paperOutput.maxMarks,
        generalInstructions: paperOutput.generalInstructions,
        sections: paperOutput.sections,
        answerKey: paperOutput.answerKey,
        generatedAt: new Date().toISOString(),
      };

      await emitJobProgress(jobId, 'Saving finalized question paper to database...', 90);
      assignment.status = 'complete';
      assignment.result = questionPaper as any;
      await assignment.save();

      await redis.setex(`result:${assignmentId}`, 3600, JSON.stringify(questionPaper));
      await redis.del('assignment:list');

      await emitJobComplete(jobId, assignmentId);
      await emitJobProgress(jobId, 'Done!', 100);

    } catch (error) {
      console.error('Background processing failed:', error);
      
      try {
        await AssignmentModel.findByIdAndUpdate(assignmentId, { status: 'failed' });
        await redis.del('assignment:list');
      } catch (dbErr) {
        console.error('Failed to write failure status to DB:', dbErr);
      }

      await emitJobFailed(jobId, error instanceof Error ? error.message : 'Unknown generation error');
      throw error;
    }
  },
  {
    connection: redis as any,
    concurrency: 2,
  }
);

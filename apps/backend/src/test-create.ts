import { connectDB } from './config/db';
import { AssignmentModel } from './models/Assignment.model';
import mongoose from 'mongoose';

async function test() {
  await connectDB();
  const userId = new mongoose.Types.ObjectId();
  const input = {
    title: 'test',
    subject: 'test',
    grade: 'test',
    schoolName: 'test',
    assignedBy: 'test',
    dueDate: new Date(),
    timeLimit: 45,
    questionConfig: [{ type: 'mcq', count: 1, marksEach: 1 }]
  };
  
  const assignment = await AssignmentModel.create({ ...input, userId });
  console.log(JSON.stringify(assignment.toObject(), null, 2));
  process.exit(0);
}
test();

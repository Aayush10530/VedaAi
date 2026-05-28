import mongoose from 'mongoose';
import { AssignmentModel } from './apps/backend/src/models/Assignment.model';

async function run() {
  try {
    await mongoose.connect('mongodb://localhost:27017/vedaai');
    console.log('Connected to MongoDB');
    
    const assignments = await AssignmentModel.find().exec();
    console.log('Total assignments in DB:', assignments.length);
    assignments.forEach((a) => {
      console.log(`- ID: ${a._id}, Title: "${a.title}", UserID: "${a.userId}", Status: "${a.status}"`);
    });
  } catch (error) {
    console.error('Error querying MongoDB:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();

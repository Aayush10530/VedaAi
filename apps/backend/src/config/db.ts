import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
}

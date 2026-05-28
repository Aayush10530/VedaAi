import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  schoolName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { type: String, required: true, select: false },
    schoolName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  
  if (!user.isModified('password') || !user.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to compare candidate password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;
  if (!user.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, user.password);
};

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);

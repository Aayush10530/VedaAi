import { UserModel, UserDocument } from '../models/User.model';
import { AppError } from '../middleware/errorHandler';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { LoginInput, SignUpInput, User } from '@vedaai/shared';

const signToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

const mapUserDocument = (doc: UserDocument): User => {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    schoolName: doc.schoolName,
    createdAt: doc.createdAt?.toISOString(),
  };
};

export const authService = {
  async signUp(input: SignUpInput): Promise<{ user: User; token: string }> {
    const { name, email, password, schoolName } = input;

    const existing = await UserModel.findOne({ email }).exec();
    if (existing) {
      throw new AppError('Email address already in use', 400, 'EMAIL_IN_USE');
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      schoolName,
    });

    const token = signToken(user._id.toString());

    return {
      user: mapUserDocument(user),
      token,
    };
  },

  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const { email, password } = input;

    const user = await UserModel.findOne({ email }).select('+password').exec();
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const token = signToken(user._id.toString());

    return {
      user: mapUserDocument(user),
      token,
    };
  },
};

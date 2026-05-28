import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../middleware/asyncHandler';
import type { LoginInput, SignUpInput } from '@vedaai/shared';

const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  schoolName: z.string().min(1, 'School name is required').max(200),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const authController = {
  signUp: asyncHandler(async (req: Request, res: Response) => {
    const parsedInput = SignUpSchema.parse(req.body);
    const result = await authService.signUp(parsedInput as SignUpInput);
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const parsedInput = LoginSchema.parse(req.body);
    const result = await authService.login(parsedInput as LoginInput);
    res.status(200).json({ success: true, data: result });
  }),
};

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

export const authRouter = Router();

// POST /api/auth/signup
authRouter.post('/signup', authController.signUp);

// POST /api/auth/login
authRouter.post('/login', authController.login);

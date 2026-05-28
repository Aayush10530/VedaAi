import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserModel, UserDocument } from '../models/User.model';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401, 'NOT_AUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    const user = await UserModel.findById(decoded.id).exec();
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401, 'USER_NOT_FOUND'));
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401, 'NOT_AUTHORIZED'));
  }
};

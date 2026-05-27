import type { Request, Response, NextFunction } from 'express';
import type { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

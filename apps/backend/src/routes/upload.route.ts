import { Router } from 'express';
import { upload } from '../middleware/upload';
import { uploadController } from '../controllers/upload.controller';

export const uploadRouter = Router();

// POST /api/upload
uploadRouter.post('/', upload.single('file'), uploadController.uploadFile);

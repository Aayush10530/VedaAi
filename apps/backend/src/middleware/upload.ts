import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.pdf', '.txt', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only PDF, TXT, and image files (${allowedExtensions.join(', ')}) are allowed`) as any);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

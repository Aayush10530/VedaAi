import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import pdfParse from 'pdf-parse';
import fs from 'fs';

export const uploadController = {
  uploadFile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400, 'NO_FILE_UPLOADED');
    }

    const fileUrl = req.file.path.replace(/\\/g, '/'); // Normalize path
    let extractedText = '';

    // If PDF, let's try to extract text synchronously for initial UX, but wrap it in a try/catch
    if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      try {
        const buffer = fs.readFileSync(req.file.path);
        const parsed = await pdfParse(buffer);
        extractedText = parsed.text;
      } catch (err) {
        console.warn('[Upload Controller] Non-fatal PDF text extraction failed during upload:', err);
      }
    } else if (req.file.mimetype.startsWith('text/') || req.file.originalname.toLowerCase().endsWith('.txt')) {
      try {
        extractedText = fs.readFileSync(req.file.path, 'utf-8');
      } catch (err) {
        console.warn('[Upload Controller] Non-fatal TXT reading failed during upload:', err);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        fileUrl,
        extractedText: extractedText ? extractedText.slice(0, 5000) : '', // Cap it at 5000 chars for API payload limit
        filename: req.file.originalname,
      },
    });
  }),
};

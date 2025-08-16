import multer from 'multer';
import type { Request } from 'express';
import { Validation } from '@/utils/error';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from '@/constant';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Validation(`File Type ${file.mimetype} not allowed`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: MAX_FILES,
    fileSize: MAX_FILE_SIZE,
  },
});

export const multiUpload = upload.array('files', MAX_FILES);

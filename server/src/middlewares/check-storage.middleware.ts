import logger from '@/logger';
import Storage from '@/models/storage.model';
import { Auth, Validation } from '@/utils/error';
import { Request, Response, NextFunction } from 'express';

export const CheckStorageAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files =
      (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

    if (!files || files.length === 0) {
      throw new Validation('No file uploaded');
    }

    const userId = req.user?._id;

    if (!userId) {
      throw new Auth('Uanuthorized access');
    }

    const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);

    await Storage.validateUpload(userId, totalFileSize);

    next();
  } catch (error) {
    next(error);
  }
};

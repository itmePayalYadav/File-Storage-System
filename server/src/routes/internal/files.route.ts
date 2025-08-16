import { Router } from 'express';
import { multiUpload } from '@/libs/multer';
import { CheckStorageAvailability } from '@/middlewares';
import {
  deleteFilesController,
  downloadFilesController,
  getAllFileController,
  uploadFilesViaWebController,
} from '@/controllers/file.controller';

const filesRouter = Router();

filesRouter.post(
  '/upload',
  multiUpload,
  CheckStorageAvailability,
  uploadFilesViaWebController,
);
filesRouter.get('/all', getAllFileController);
filesRouter.post('/download', downloadFilesController);
filesRouter.delete('/bulk-delete', deleteFilesController);

export default filesRouter;

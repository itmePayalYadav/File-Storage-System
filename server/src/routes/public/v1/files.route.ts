import { Router } from 'express';
import { multiUpload } from '@/libs/multer';
import { CheckStorageAvailability } from '@/middlewares';
import { uploadFilesViaApiController } from '@/controllers/file.controller';

const fileV1Routes = Router();

fileV1Routes.post(
  '/upload',
  multiUpload,
  CheckStorageAvailability,
  uploadFilesViaApiController,
);

export default fileV1Routes;

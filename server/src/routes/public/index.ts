import { Router } from 'express';
import { publicGetFileUrlController } from '@/controllers/file.controller';

const publicRoute = Router();

publicRoute.use('/files/:fileId/view', publicGetFileUrlController);

export default publicRoute;

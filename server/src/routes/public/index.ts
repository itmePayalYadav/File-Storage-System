import { ENV } from '@/config';
import { Router } from 'express';
import v1Routes from '@/routes/public/v1';
import { publicGetFileUrlController } from '@/controllers/file.controller';

const publicRoute = Router();

publicRoute.use(`${ENV.BASE_PATH}/v1`, v1Routes);

publicRoute.use('/files/:fileId/view', publicGetFileUrlController);

export default publicRoute;

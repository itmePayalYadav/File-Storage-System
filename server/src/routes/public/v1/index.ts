import { Router } from 'express';
import fileV1Routes from '@/routes/public/v1/files.route';
import { apiKeyAuthMiddleware } from '@/middlewares/api-key-auth.middleware';

const v1Routes = Router();

v1Routes.use('/files', apiKeyAuthMiddleware, fileV1Routes);

export default v1Routes;

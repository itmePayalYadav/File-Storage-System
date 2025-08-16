import { Router } from 'express';
import authRouter from '@/routes/internal/auth.route';
import filesRouter from '@/routes/internal/files.route';
import { passportAuthenticateJwt } from '@/libs/passport';

const internalRoutes = Router();

internalRoutes.use('/auth', authRouter);
internalRoutes.use('/files', passportAuthenticateJwt, filesRouter);

export default internalRoutes;

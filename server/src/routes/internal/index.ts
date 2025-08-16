import { Router } from 'express';
import authRouter from '@/routes/internal/auth.route';
import filesRouter from '@/routes/internal/files.route';
import { passportAuthenticateJwt } from '@/libs/passport';
import analyticsRouter from '@/routes/internal/analytics.route';

const internalRoutes = Router();

internalRoutes.use('/auth', authRouter);
internalRoutes.use('/files', passportAuthenticateJwt, filesRouter);
internalRoutes.use('/analytics', passportAuthenticateJwt, analyticsRouter);

export default internalRoutes;

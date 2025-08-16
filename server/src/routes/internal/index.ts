import { Router } from 'express';
import authRouter from '@/routes/internal/auth.route';
import filesRouter from '@/routes/internal/files.route';
import { passportAuthenticateJwt } from '@/libs/passport';
import apiKeyRouter from '@/routes/internal/api-key.route';
import analyticsRouter from '@/routes/internal/analytics.route';

const internalRoutes = Router();

internalRoutes.use('/auth', authRouter);
internalRoutes.use('/files', passportAuthenticateJwt, filesRouter);
internalRoutes.use('/analytics', passportAuthenticateJwt, analyticsRouter);
internalRoutes.use('/apikey', passportAuthenticateJwt, apiKeyRouter);

export default internalRoutes;

import { Router } from 'express';
import authRouter from '@/routes/internal/auth.route';

const internalRoutes = Router();

internalRoutes.use('/auth', authRouter);

export default internalRoutes;

import { Router } from 'express';
import { getUserAnalyticsWithChartController } from '@/controllers/analytics.controller';

const analyticsRouter = Router();

analyticsRouter.get('/user', getUserAnalyticsWithChartController);

export default analyticsRouter;

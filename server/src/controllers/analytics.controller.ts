import { Request, Response } from 'express';
import { asyncHandler } from '@/middlewares';
import ApiResponse from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { getUserAnalyticsWithChartService } from '@/services/analytics.service';

export const getUserAnalyticsWithChartController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { from, to } = req.query;
    const filter = {
      dateFrom: from ? new Date(from as string) : undefined,
      dateTo: to ? new Date(to as string) : undefined,
    };
    const response = await getUserAnalyticsWithChartService(userId, filter);
    return new ApiResponse(
      StatusCodes.OK,
      response,
      'User analytics retrived successfully',
    ).send(res);
  },
);

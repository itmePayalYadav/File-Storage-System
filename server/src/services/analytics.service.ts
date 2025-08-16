import File from '@/models/file.model';
import Storage from '@/models/storage.model';
import { formateBytes } from '@/utils/helper';
import mongoose, { PipelineStage, Types } from 'mongoose';

export const getUserAnalyticsWithChartService = async (
  userId: string,
  filter: {
    dateTo?: Date;
    dateFrom?: Date;
  },
) => {
  const { dateTo, dateFrom } = filter;

  const pipeline: PipelineStage[] = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...(dateFrom && { createdAt: { $gte: dateFrom } }),
        ...(dateTo && { createdAt: { $lte: dateTo } }),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        uploadedFiles: { $sum: 1 },
        usages: { $sum: { $ifNull: ['$size', 0] } },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        uploadedFiles: 1,
        usages: 1,
      },
    },
    {
      $facet: {
        chartData: [
          {
            $project: {
              date: 1,
              uploadedFiles: 1,
              usages: 1,
            },
          },
        ],
        totals: [
          {
            $group: {
              _id: null,
              totaluploadedFilesForPeriod: { $sum: '$uploadedFiles' },
              totalusagesForPeriod: { $sum: '$usages' },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        chartData: '$chartData',
        totaluploadedFilesForPeriod: {
          $ifNull: [
            { $arrayElemAt: ['$totals.totaluploadedFilesForPeriod', 0] },
            0,
          ],
        },
        totalusagesForPeriod: {
          $ifNull: [{ $arrayElemAt: ['$totals.totalusagesForPeriod', 0] }, 0],
        },
      },
    },
  ];

  const response = await File.aggregate(pipeline);

  const [
    {
      chartData,
      totaluploadedFilesForPeriod = 0,
      totalusagesForPeriod = 0,
    } = {},
  ] = response;

  const formattedChartData = chartData?.map(
    (item: { date: string; uploadedFiles: number; usages: number }) => ({
      ...item,
      usages: item.usages,
      formattedUsages: formateBytes(item.usages),
    }),
  );

  const storageMetrics = await Storage.getStorageMetrics(
    new Types.ObjectId(userId),
  );

  return {
    chart: formattedChartData,
    totaluploadedFilesForPeriod,
    totalusagesForPeriod: formateBytes(totalusagesForPeriod),
    storageUsageSummary: {
      totalUsage: storageMetrics.usage,
      quota: storageMetrics.quota,
      formattedTQuota: formateBytes(storageMetrics.quota),
    },
  };
};

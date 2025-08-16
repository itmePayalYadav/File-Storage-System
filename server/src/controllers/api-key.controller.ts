import {
  createApiKeyService,
  getAllApiKeysService,
  deleteApiKeyService,
} from '@/services/api-key.service';
import ApiResponse from '@/utils/response';
import { Request, Response } from 'express';
import { asyncHandler } from '@/middlewares';
import { StatusCodes } from 'http-status-codes';
import { createApiKeySchema, deleteApiKeySchema } from '@/validators';

export const createApiKeyController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { name } = createApiKeySchema.parse(req.body);
    const { rawKey } = await createApiKeyService(userId, name);
    return new ApiResponse(
      StatusCodes.CREATED,
      { key: rawKey },
      'API key created successfully',
    ).send(res);
  },
);

export const getAllKeysController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 1,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };
    const response = await getAllApiKeysService(userId, pagination);
    return new ApiResponse(
      StatusCodes.OK,
      response,
      'API keys retrived successfully',
    ).send(res);
  },
);

export const deleteApiKeyController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { id } = deleteApiKeySchema.parse({ id: req.params.id });
    const response = await deleteApiKeyService(userId, id);
    return new ApiResponse(
      StatusCodes.OK,
      response,
      'API keys deleted successfully',
    ).send(res);
  },
);

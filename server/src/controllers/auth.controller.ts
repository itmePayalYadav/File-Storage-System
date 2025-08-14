import ApiResponse from '@/utils/response';
import { Request, Response } from 'express';
import { asyncHandler } from '@/middlewares';
import { StatusCodes } from 'http-status-codes';
import { registerSchema, loginSchema } from '@/validators';
import { registerService, loginService } from '@/services/auth.service';

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    const response = await registerService(body);
    return new ApiResponse(
      StatusCodes.CREATED,
      response,
      'User registered successfully.',
    ).send(res);
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);
    const response = await loginService(body);
    return new ApiResponse(
      StatusCodes.CREATED,
      response,
      'User login successful.',
    ).send(res);
  },
);

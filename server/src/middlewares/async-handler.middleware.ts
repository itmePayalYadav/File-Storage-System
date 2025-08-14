import { Request, Response, NextFunction } from 'express';

type AsyncControllerType<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T>;

export const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

import {
  deleteFilesService,
  downloadFilesService,
  getAllFilesServices,
  getFileService,
  uploadFilesService,
} from '@/services/file.service';
import {
  fileIdSchema,
  deleteFilesSchema,
  downloadFilesSchema,
} from '@/validators';
import { Readable } from 'stream';
import { UploadSourceEnum } from '@/enums';
import ApiResponse from '@/utils/response';
import { Request, Response } from 'express';
import { asyncHandler } from '@/middlewares';
import { StatusCodes } from 'http-status-codes';

export const uploadFilesViaWebController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const uploadVia = UploadSourceEnum.WEB;
    const files = req.files as Express.Multer.File[];
    const response = await uploadFilesService(userId, files, uploadVia);
    return new ApiResponse(
      StatusCodes.CREATED,
      response,
      'Files Uploaded Successfully',
    ).send(res);
  },
);

export const uploadFilesViaApiController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const uploadVia = UploadSourceEnum.API;
    const files = req.files as Express.Multer.File[];
    const response = await uploadFilesService(userId, files, uploadVia);
    return new ApiResponse(
      StatusCodes.CREATED,
      response,
      'Files Uploaded Successfully',
    ).send(res);
  },
);

export const getAllFileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const filter = {
      keyword: req.query.keyword as string | undefined,
    };
    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 20,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };
    const response = await getAllFilesServices(userId, filter, pagination);
    return new ApiResponse(
      StatusCodes.OK,
      response,
      'All Files retrieved successfully.',
    ).send(res);
  },
);

export const publicGetFileUrlController = asyncHandler(
  async (req: Request, res: Response) => {
    const fileId = fileIdSchema.parse(req.params.fileId);
    const { stream, contentType, fileSize } = await getFileService(fileId);

    res.set({
      'Content-Type': contentType,
      'Content-Length': fileSize,
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
    });

    if (stream instanceof Readable) {
      stream.pipe(res);
    } else {
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream as any) {
        chunks.push(chunk);
      }
      res.end(Buffer.concat(chunks));
    }
  },
);

export const deleteFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { fileIds } = deleteFilesSchema.parse(req.body);
    const response = await deleteFilesService(userId, fileIds);
    return new ApiResponse(
      StatusCodes.OK,
      response,
      'Files deleted successfully',
    ).send(res);
  },
);

export const downloadFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { fileIds } = downloadFilesSchema.parse(req.body);
    const response = await downloadFilesService(userId, fileIds);
    return new ApiResponse(
      StatusCodes.OK,
      {
        downloadUrl: response?.url,
        isZip: response?.isZip || false,
      },
      'Files download successfully',
    ).send(res);
  },
);

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import path from 'path';
import logger from '@/logger';
import { ENV } from '@/config';
import archiver from 'archiver';
import { s3 } from '@/utils/aws';
import { v4 as uuidv4 } from 'uuid';
import { PassThrough } from 'stream';
import User from '@/models/user.model';
import File from '@/models/file.model';
import { UploadSourceEnum } from '@/enums';
import { Upload } from '@aws-sdk/lib-storage';
import { sanitizeFilter } from '@/utils/helper';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Auth, NotFound, Server, Validation } from '@/utils/error';

async function uploadToS3(
  file: Express.Multer.File,
  userId: string,
  meta?: Record<string, string>,
) {
  try {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const cleanName = sanitizeFilter(basename).substring(0, 64);
    const storageKey = `users/${userId}/${uuidv4()}-${cleanName}${ext}`;
    const command = new PutObjectCommand({
      Bucket: ENV.AWS_BUCKET_NAME!,
      Key: storageKey,
      Body: file.buffer,
      ...(meta && { Metadata: meta }),
    });
    await s3.send(command);
    return { storageKey };
  } catch (error) {
    logger.error('Error uploading file to S3:', error);
    throw error;
  }
}

async function getFileFromS3({
  storageKey,
  filename,
  mimeType,
  expiresIn = 60,
}: {
  storageKey: string;
  expiresIn?: number;
  filename?: string;
  mimeType?: string;
}) {
  try {
    let responseDisposition: string | undefined;

    if (mimeType) {
      if (
        mimeType.startsWith('image/') ||
        mimeType.startsWith('video/') ||
        mimeType.startsWith('audio/') ||
        mimeType === 'application/pdf'
      ) {
        responseDisposition = 'inline';
      } else {
        responseDisposition = `attachment${filename ? `; filename="${filename}"` : ''}`;
      }
    }
    const command = new GetObjectCommand({
      Bucket: ENV.AWS_BUCKET_NAME!,
      Key: storageKey,
      ...(mimeType && { ResponseContentType: mimeType }),
      ...(responseDisposition && {
        ResponseContentDisposition: responseDisposition,
      }),
    });
    return await getSignedUrl(s3, command, { expiresIn });
  } catch (error) {
    logger.error(`Failed to get file from S3: ${storageKey}`, error);
    throw error;
  }
}

async function getS3ReadStream(storageKey: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: ENV.AWS_BUCKET_NAME!,
      Key: storageKey,
    });
    const response = await s3.send(command);
    if (!response.Body) {
      logger.warn('No body found');
      throw new Server('No body found');
    }
    return response.Body;
  } catch (error) {
    logger.error('Failed to retrive file');
    throw new Server('Failed to retrive file');
  }
}

async function deleteFromS3(storageKey: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: ENV.AWS_BUCKET_NAME!,
      Key: storageKey,
    });
    await s3.send(command);
  } catch (error) {
    logger.error(`Failed to delete from S3 bucket ${storageKey}`);
    throw error;
  }
}

async function handleMultipleFilesDownload(
  files: Array<{ storageKey: string; originalName: string }>,
  userId: string,
) {
  const timestamp = Date.now();
  const zipKey = `temp-zips/${userId}/${timestamp}.zip`;
  const zipFilename = `file-upload-${timestamp}.zip`;
  const zip = archiver('zip', { zlib: { level: 6 } });
  const passThrough = new PassThrough();
  zip.on('error', (error) => {
    passThrough.destroy(error);
  });
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: ENV.AWS_BUCKET_NAME!,
      Key: zipKey,
      Body: passThrough,
      ContentType: 'application/zip',
    },
  });
  zip.pipe(passThrough);
  for (const file of files) {
    try {
      const stream = await getS3ReadStream(file.storageKey);
      zip.append(stream as any, {
        name: sanitizeFilter(file.originalName),
      });
    } catch (error: any) {
      zip.destroy(error);
      throw error;
    }
  }
  await zip.finalize();
  await upload.done();

  const url = await getFileFromS3({
    storageKey: zipKey,
    filename: zipFilename,
    expiresIn: 3600,
  });
  return url;
}

export const uploadFilesService = async (
  userId: string,
  files: Express.Multer.File[],
  uploadVia: keyof typeof UploadSourceEnum,
) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new Auth('Unauthorized Access');
  }
  if (!files?.length) {
    throw new Validation('No File Provided');
  }
  const response = await Promise.all(
    files.map(async (file) => {
      let _storageKey: string | null = null;
      try {
        const { storageKey } = await uploadToS3(file, userId);
        _storageKey = storageKey;
        const createdFile = await File.create({
          userId,
          storageKey,
          originalName: file.originalname,
          uploadVia: uploadVia,
          size: file.size,
          ext: path.extname(file.originalname)?.slice(1)?.toLowerCase(),
          url: '',
          mimeType: file.mimetype,
        });
        return {
          fileId: createdFile?._id,
          originalName: createdFile.originalName,
          size: createdFile.size,
          ext: createdFile.ext,
          mimeType: createdFile.mimeType,
        };
      } catch (error) {
        logger.error(`Error uploading file ${error}`);
        if (_storageKey) {
          await deleteFromS3(_storageKey);
        }
      }
    }),
  );
  return response;
};

export const getAllFilesServices = async (
  userId: string,
  filter: {
    keyword?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  },
) => {
  const { keyword } = filter;

  const filterCondition: Record<string, any> = {
    userId,
  };

  if (keyword) {
    filterCondition.$or = [
      {
        originalName: {
          $regex: keyword,
          $options: 'i',
        },
      },
    ];
  }

  const { pageSize, pageNumber } = pagination;

  const skip = (pageNumber - 1) * pageSize;

  const [files, totalCount] = await Promise.all([
    File.find().skip(skip).limit(pageSize).sort({ createdAt: -1 }),
    File.countDocuments(filterCondition),
  ]);

  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const url = await getFileFromS3({
        storageKey: file.storageKey,
        mimeType: file.mimeType,
        expiresIn: 3600,
      });
      return {
        ...file.toObject(),
        url,
        storageKey: undefined,
      };
    }),
  );

  const totalPage = Math.ceil(totalCount / pageSize);

  return {
    file: filesWithUrls,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPage,
      skip,
    },
  };
};

export const getFileService = async (fileId: string) => {
  const file = await File.findOne({ _id: fileId });
  if (!file) {
    throw new NotFound('File not found');
  }
  const url = await getFileFromS3({
    storageKey: file.storageKey,
    mimeType: file.mimeType,
    expiresIn: 3600,
  });
  return { url };
};

export const deleteFilesService = async (userId: string, fileIds: string[]) => {
  const files = await File.find({ _id: { $in: fileIds }, userId });
  if (!files.length) {
    throw new NotFound('Files not found');
  }

  const s3Errors: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        await deleteFromS3(file.storageKey);
      } catch (error) {
        logger.error(`Failed to delete ${file.storageKey}`);
        s3Errors.push(file.storageKey);
      }
    }),
  );

  const successfullyFileIds = files
    .filter((file) => !s3Errors.includes(file.storageKey))
    .map((file) => file._id);

  const { deletedCount } = await File.deleteMany({
    _id: { $in: successfullyFileIds },
    userId,
  });

  if (s3Errors.length > 0) {
    logger.warn(`Failed to delete ${s3Errors.length} files from S3`);
  }

  return {
    deletedCount,
    failedCount: s3Errors.length,
  };
};

export const downloadFilesService = async (
  userId: string,
  fileIds: string[],
) => {
  const files = await File.find({ _id: { $in: fileIds }, userId });

  if (!files.length) {
    throw new NotFound('Files not found');
  }

  if (files.length === 1) {
    const signedUrl = await getFileFromS3({
      storageKey: files[0].storageKey,
      filename: files[0].originalName,
    });
    return {
      url: signedUrl,
      isZip: false,
    };
  }

  const url = await handleMultipleFilesDownload(files, userId);

  return {
    url,
    isZip: true,
  };
};

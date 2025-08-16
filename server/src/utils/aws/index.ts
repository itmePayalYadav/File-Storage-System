import { ENV } from '@/config';
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: ENV.AWS_ENDPOINT_URL_S3,
  forcePathStyle: false,
});

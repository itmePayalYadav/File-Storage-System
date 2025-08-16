import { config } from 'dotenv';
import { getEnv } from '@/utils/env';

config({ path: './.env' });

const envConfig = () => ({
  // Basic server configuration
  PORT: getEnv('PORT', '3000'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),

  // Base Path configuration
  BASE_PATH: getEnv('BASE_PATH', '/api'),

  // Database configuration
  MONGO_URI: getEnv('MONGO_URI'),

  // JWT configuration
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),

  // Logging configuration
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),

  // CORS configuration
  CORS_ORIGIN: getEnv('CORS_ORIGIN'),

  // AWS configuration
  AWS_ACCESS_KEY_ID: getEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: getEnv('AWS_SECRET_ACCESS_KEY'),
  AWS_ENDPOINT_URL_S3: getEnv('AWS_ENDPOINT_URL_S3'),
  AWS_ENDPOINT_URL_IAM: getEnv('AWS_ENDPOINT_URL_IAM'),
  AWS_REGION: getEnv('AWS_REGION', 'auto'),
  AWS_BUCKET_NAME: getEnv('AWS_BUCKET_NAME'),
});

export const ENV = envConfig();

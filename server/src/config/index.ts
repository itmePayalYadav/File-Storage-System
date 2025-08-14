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
  MONGO_URI: getEnv('MONGO_URI', ''),

  // JWT configuration
  JWT_SECRET: getEnv('JWT_SECRET', 'mysecretkey'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '1h'),

  // Logging configuration
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),

  // CORS configuration
  CORS_ORIGIN: getEnv('CORS_ORIGIN', ''),
});

export const ENV = envConfig();

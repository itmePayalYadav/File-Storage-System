/**
 * @copyright 2025 Payal Yadav
 * @license Apache-2.0
 */

import mongoose, { type ConnectOptions } from 'mongoose';
import { ENV } from '@/config';
import logger from '@/logger';

const clientOptions: ConnectOptions = {
  dbName: 'filestorage',
  appName: 'FILE STORAGE MANAGEMENT SYSTEM API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectDB = async (): Promise<void> => {
  if (!ENV.MONGO_URI) {
    logger.error('MongoDB URI is not defined in the configuration.');
    throw new Error('MongoDB URI is not defined in the configuration.');
  }
  try {
    await mongoose.connect(ENV.MONGO_URI, clientOptions);
    logger.info('MongoDB connection established.');
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
  } catch (error) {
    logger.error('Failed to disconnect from MongoDB:', error);
    throw error;
  }
};

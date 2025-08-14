/**
 * @copyright 2025 Payal Yadav
 * @license Apache-2.0
 */

// ==============================
// Configuration & Environment Setup
// ==============================
import { ENV } from '@/config';

// ==============================
// Imports
// ==============================
import app from '@/app';

// ==============================
// Database Config
// ==============================
import { connectDB, disconnectDB } from '@/db';

// ==============================
// Logger
// ==============================
import logger from '@/logger';

// ==============================
// Server Startup
// ==============================
(async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      logger.info(`Server running at http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    logger.error('Server failed to start', error);
    if (ENV.NODE_ENV === 'production') process.exit(1);
  }
})();

// ==============================
// Graceful Shutdown Handler
// ==============================
const handleServerShutDown = async () => {
  try {
    await disconnectDB();
    logger.warn('Server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
};

process.on('SIGTERM', handleServerShutDown);
process.on('SIGINT', handleServerShutDown);

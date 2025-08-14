/**
 * @copyright 2025 Payal Yadav
 * @license Apache-2.0
 */

// ==============================
// Configuration & Environment Setup
// ==============================
import { ENV } from '@/config';

// ==============================
// Core Modules & Middlewares
// ==============================
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';

// ==============================
// Constants & Utilities
// ==============================
import {
  errorMiddleware,
  notFoundMiddleware,
} from '@/middlewares/error-handler.middleware';
import { whiteListOrigin } from '@/constant';

// ==============================
// Routers & Error Handlers
// ==============================
// import router from '@/routes';

// ==============================
// Express App Initialization
// ==============================
const app = express();

// ==============================
// CORS Configuration
// ==============================
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      ENV.NODE_ENV === 'development' ||
      !origin ||
      whiteListOrigin.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`Cors error: ${origin} is not allowed by cors.`),
        false,
      );
    }
  },
};

// ==============================
// Global Middlewares
// ==============================
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));
app.use(helmet());

// ==============================
// Routes
// ==============================
app.use('/api/v1', (_, res) => {
  res.json({ message: 'API v1 is under construction' });
});

// ==============================
// NotFound
// ==============================
app.use(notFoundMiddleware);

// ==============================
// Error Handler
// ==============================
app.use(errorMiddleware);

// ==============================
// Export App
// ==============================
export default app;

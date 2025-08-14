import winston from 'winston';
import path from 'path';
import fs from 'fs';

// ==============================
// Ensure log directory exists
// ==============================
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ==============================
// Custom Logging Levels
// ==============================
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

// ==============================
// Determine Log Level by Environment
// ==============================
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// ==============================
// Log Colors
// ==============================
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
};

winston.addColors(colors);

// ==============================
// Formats
// ==============================
const devFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'DD MMM, YYYY - HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// ==============================
// Transports
// ==============================
const transports = [
  // Console always enabled (pretty in dev, JSON in prod)
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
  }),

  // File logs (rotated daily in real production)
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: prodFormat,
  }),
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: prodFormat,
  }),
];

// ==============================
// Create Logger
// ==============================
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  exitOnError: false,
  silent: process.env.NODE_ENV === 'test',
});

export default logger;

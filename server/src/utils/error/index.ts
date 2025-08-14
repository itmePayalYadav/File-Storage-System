// ==============================
// Import Dependencies
// ==============================
import { StatusCodes } from 'http-status-codes';

// ==============================
// Base App
// ==============================
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;
  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// ==============================
// Not Found
// ==============================
export class NotFound extends AppError {
  constructor(message = 'Resource not found.') {
    super(message, StatusCodes.NOT_FOUND);
  }
}

// ==============================
// Validation
// ==============================
export class Validation extends AppError {
  constructor(message = 'Invalid request data.', details?: any) {
    super(message, StatusCodes.BAD_REQUEST, true, details);
  }
}

// ==============================
// Authentication
// ==============================
export class Auth extends AppError {
  constructor(message = 'Authentication failed.', details?: any) {
    super(message, StatusCodes.UNAUTHORIZED, true, details);
  }
}

// ==============================
// Forbidden
// ==============================
export class Forbidden extends AppError {
  constructor(message = 'Access forbidden.', details?: any) {
    super(message, StatusCodes.FORBIDDEN, true, details);
  }
}

// ==============================
// Database
// ==============================
export class Database extends AppError {
  constructor(message = 'A database error occurred.', details?: any) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, true, details);
  }
}

// ==============================
// Rate Limit
// ==============================
export class RateLimit extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, StatusCodes.TOO_MANY_REQUESTS);
  }
}

// ==============================
// Email
// ==============================
export class Email extends AppError {
  constructor(message = 'Failed to send email.') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// ==============================
// Server
// ==============================
export class Server extends AppError {
  constructor(message = 'Internal server error.') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// ==============================
// Conflict
// ==============================
export class Conflict extends AppError {
  constructor(message = 'Conflict occurred.', details?: any) {
    super(message, StatusCodes.CONFLICT, true, details);
  }
}

// ==============================
// Bad Gateway (
// ==============================
export class BadGateway extends AppError {
  constructor(message = 'Bad gateway from upstream server.', details?: any) {
    super(message, StatusCodes.BAD_GATEWAY, true, details);
  }
}

// ==============================
// Service Unavailable
// ==============================
export class ServiceUnavailable extends AppError {
  constructor(message = 'Service is currently unavailable.', details?: any) {
    super(message, StatusCodes.SERVICE_UNAVAILABLE, true, details);
  }
}

// ==============================
// Gateway Timeout
// ==============================
export class GatewayTimeout extends AppError {
  constructor(
    message = 'Gateway timed out waiting for a response.',
    details?: any,
  ) {
    super(message, StatusCodes.GATEWAY_TIMEOUT, true, details);
  }
}

// ==============================
// Payment Required
// ==============================
export class PaymentRequired extends AppError {
  constructor(
    message = 'Payment is required to access this resource.',
    details?: any,
  ) {
    super(message, StatusCodes.PAYMENT_REQUIRED, true, details);
  }
}

// ==============================
// Precondition Failed (412)
// ==============================
export class PreconditionFailed extends AppError {
  constructor(message = 'Precondition failed.', details?: any) {
    super(message, StatusCodes.PRECONDITION_FAILED, true, details);
  }
}

// ==============================
// Unprocessable Entity
// ==============================
export class UnprocessableEntity extends AppError {
  constructor(
    message = 'Request cannot be processed due to semantic errors.',
    details?: any,
  ) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, true, details);
  }
}

// ==============================
// CSRF Error
// ==============================
export class CSRF extends AppError {
  constructor(message = 'CSRF token validation failed.', details?: any) {
    super(message, StatusCodes.FORBIDDEN, true, details);
  }
}

// ==============================
// File Upload Error
// ==============================
export class FileUpload extends AppError {
  constructor(
    message = 'File upload failed.',
    statusCode = StatusCodes.BAD_REQUEST,
    details?: any,
  ) {
    super(message, statusCode, true, details);
  }
}

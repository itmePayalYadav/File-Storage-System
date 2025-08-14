// ==============================
// ApiResponse Class
// ==============================
import { Response } from 'express';

interface Metadata {
  [key: string]: any;
}

class ApiResponse<T = any> {
  public readonly statusCode: number;
  public readonly data: T;
  public readonly message: string;
  public readonly success: boolean;
  public readonly metadata: Metadata;

  constructor(
    statusCode: number,
    data: T,
    message = 'Success',
    metadata: Metadata = {},
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.metadata = metadata;
  }

  // ==============================
  // Send the response using Express res object
  // ==============================
  send(res: Response): Response {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      ...(Object.keys(this.metadata).length && { meta: this.metadata }),
    });
  }
}

// ==============================
// Export ApiResponse Class
// ==============================
export default ApiResponse;

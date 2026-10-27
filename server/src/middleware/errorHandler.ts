import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from './validate';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Always log internal details server-side
  console.error('[Error Handler caught]:', err);

  // 1. Handled AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields ? { fields: err.fields } : {}),
      },
    });
    return;
  }

  // 2. MongoDB Duplicate Key (code 11000)
  if (err.code === 11000) {
    const keys = Object.keys(err.keyPattern || err.keyValue || {});
    const field = keys.length > 0 ? keys[0] : 'email';
    res.status(409).json({
      error: {
        code: 'DUPLICATE_KEY',
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        fields: {
          [field]: `This ${field} is already in use`,
        },
      },
    });
    return;
  }

  // 3. Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      error: {
        code: 'INVALID_ID',
        message: `Invalid ID format for ${err.path}`,
      },
    });
    return;
  }

  // 4. Mongoose Schema ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(err.errors)) {
      fields[key] = err.errors[key].message;
    }
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        fields,
      },
    });
    return;
  }

  // 5. Default 500 Internal Server Error (Never leak stack trace to client)
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred',
    },
  });
}

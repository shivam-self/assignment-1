import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public fields?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const validateBody = (schema: ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of error.issues) {
          const path = issue.path.join('.') || 'general';
          if (!fields[path]) {
            fields[path] = issue.message;
          }
        }
        next(
          new AppError('Validation failed', 400, 'VALIDATION_ERROR', fields)
        );
      } else {
        next(error);
      }
    }
  };
};

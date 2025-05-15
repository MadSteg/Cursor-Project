/**
 * Request validation middleware
 * 
 * This middleware validates incoming requests against Zod schemas.
 */
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware factory that creates a validation middleware using a Zod schema
 * @param schema The Zod schema to validate the request body against
 */
export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the schema
      schema.parse(req.body);
      next();
    } catch (error) {
      // If validation fails, return a 400 Bad Request with the validation errors
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      // If it's some other error, pass it to the next error handler
      next(error);
    }
  };
};
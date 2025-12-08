/**
 * Error Handler Middleware
 */

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import logger from "../config/logger";
import { ErrorResponse } from "../types/api.types";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || "INTERNAL_ERROR";
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
      timestamp: new Date().toISOString(),
    };

    res.status(400).json(response);
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle generic errors
  const response: ErrorResponse = {
    success: false,
    error: {
      message: err.message || "Internal server error",
      code: "INTERNAL_ERROR",
    },
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      code: "NOT_FOUND",
    },
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(response);
}

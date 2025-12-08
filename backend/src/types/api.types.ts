/**
 * API Request and Response Types
 */

import { Request } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FileUploadRequest extends Request {
  file?: Express.Multer.File;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
}

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  timestamp: string;
  services: {
    cache: boolean;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

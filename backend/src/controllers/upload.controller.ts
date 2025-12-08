/**
 * Upload Controller
 */

import { Request, Response, NextFunction } from "express";
// import FileUploadService from "../services/fileUpload.service";
import { cacheManager } from "../utils/cacheManager";
import logger from "../config/logger";
import { ApiResponse } from "../types/api.types";
import { FileUploadResponse } from "../types/pipeline.types";
import { AppError } from "../middleware/errorHandler";

// const fileUploadService = new FileUploadService();

export class UploadController {
  async uploadFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError("No file uploaded", 400, "NO_FILE");
      }

      logger.info("Processing uploaded file", {
        fileName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      // TODO: Implement file processing service
      // For now, return a stub response
      const fileId = `file_${Date.now()}`;
      const result: FileUploadResponse = {
        fileId,
        fileName: req.file.originalname,
        rowCount: 0,
        columnCount: 0,
        columns: [],
        preview: [],
        uploadedAt: new Date().toISOString(),
      };

      // Initialize pipeline state in cache
      cacheManager.updatePipelineState(fileId, {
        fileId: fileId,
        fileName: req.file.originalname,
        currentStep: "upload",
      });

      logger.info("File uploaded successfully", {
        fileId: result.fileId,
        rowCount: result.rowCount,
        columnCount: result.columnCount,
      });

      const response: ApiResponse<FileUploadResponse> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();

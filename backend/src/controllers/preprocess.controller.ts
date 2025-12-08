/**
 * Preprocessing Controller
 */

import { Request, Response, NextFunction } from "express";
// import PreprocessingService from "../services/preprocessing.service";
import { cacheManager } from "../utils/cacheManager";
import logger from "../config/logger";
import { ApiResponse } from "../types/api.types";
import {
  PreprocessingResponse,
  PreprocessingConfig,
} from "../types/pipeline.types";
import { AppError } from "../middleware/errorHandler";

// const preprocessingService = new PreprocessingService();

export class PreprocessController {
  async preprocess(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fileId, ...config } = req.body as {
        fileId: string;
      } & PreprocessingConfig;

      logger.info("Starting preprocessing", {
        fileId,
        hasMissingValues: !!config.missingValueHandling,
        hasScaling: !!config.scaling,
        hasEncoding: !!config.encoding,
      });

      // Verify file exists
      const pipelineState = cacheManager.get(`pipeline:${fileId}`);
      if (!pipelineState) {
        throw new AppError("Pipeline not found", 404, "PIPELINE_NOT_FOUND");
      }

      // Apply preprocessing
      // TODO: Implement preprocessing service
      const result: PreprocessingResponse = {
        fileId,
        transformations: [],
        rowsRemoved: 0,
        columnsRemoved: 0,
        newColumns: [],
        updatedColumns: [],
        preview: [],
      };

      // Update pipeline state
      cacheManager.updatePipelineState(fileId, {
        currentStep: "preprocess",
        preprocessConfig: config,
      });

      logger.info("Preprocessing completed", {
        fileId,
      });

      const response: ApiResponse<PreprocessingResponse> = {
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

export default new PreprocessController();

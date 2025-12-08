/**
 * Results Controller
 */

import { Request, Response, NextFunction } from "express";
import { cacheManager } from "../utils/cacheManager";
import logger from "../config/logger";
import { ApiResponse } from "../types/api.types";
import { AppError } from "../middleware/errorHandler";

export class ResultsController {
  async getResults(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { modelId } = req.params;

      logger.info("Fetching results for model", { modelId });

      // Get trained model from cache
      const trainedModel = cacheManager.get(`model:${modelId}`);
      if (!trainedModel) {
        throw new AppError("Model not found", 404, "MODEL_NOT_FOUND");
      }

      // Get pipeline state
      const fileId = trainedModel.metadata.fileId;
      const pipelineState = cacheManager.get(`pipeline:${fileId}`);

      const response: ApiResponse<any> = {
        success: true,
        data: {
          modelId,
          fileId,
          model: {
            type: trainedModel.metadata.modelType,
            taskType: trainedModel.metadata.taskType,
            hyperparameters: trainedModel.metadata.hyperparameters,
          },
          metrics: trainedModel.metrics,
          pipeline: pipelineState,
          trainedAt: trainedModel.trainedAt,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPipelineState(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fileId } = req.params;

      logger.info("Fetching pipeline state", { fileId });

      const pipelineState = cacheManager.get(`pipeline:${fileId}`);
      if (!pipelineState) {
        throw new AppError("Pipeline not found", 404, "PIPELINE_NOT_FOUND");
      }

      const response: ApiResponse<any> = {
        success: true,
        data: pipelineState,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getHealthCheck(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cacheStats = cacheManager.getStats();

      const response: ApiResponse<any> = {
        success: true,
        data: {
          status: "healthy",
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cache: cacheStats,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new ResultsController();

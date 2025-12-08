/**
 * Train Controller
 */

import { Request, Response, NextFunction } from "express";
// import ModelTrainingService from "../services/modelTraining.service";
import { cacheManager } from "../utils/cacheManager";
import logger from "../config/logger";
import { ApiResponse } from "../types/api.types";
import { TrainingResponse, ModelConfig } from "../types/pipeline.types";
import { AppError } from "../middleware/errorHandler";

// const modelTrainingService = new ModelTrainingService();

export class TrainController {
  async train(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fileId, ...config } = req.body as {
        fileId: string;
      } & ModelConfig;

      logger.info("Starting model training", {
        fileId,
        taskType: config.taskType,
        modelType: config.modelType,
      });

      // Verify pipeline exists
      const pipelineState = cacheManager.get(`pipeline:${fileId}`);
      if (!pipelineState) {
        throw new AppError("Pipeline not found", 404, "PIPELINE_NOT_FOUND");
      }

      // Check if split was performed
      if (pipelineState.currentStep !== "split" && !pipelineState.splitConfig) {
        throw new AppError(
          "Train-test split must be performed before training",
          400,
          "SPLIT_REQUIRED"
        );
      }

      // Train model
      // TODO: Implement model training service
      const modelId = `model_${Date.now()}`;
      const result: TrainingResponse = {
        modelId,
        taskType: config.taskType,
        modelType: config.modelType,
        metrics: {
          accuracy: 0,
          precision: 0,
          recall: 0,
          f1Score: 0,
        },
        trainingTime: 0,
      };

      // Update pipeline state
      cacheManager.updatePipelineState(fileId, {
        currentStep: "train",
        modelConfig: config,
      });

      logger.info("Model training completed", {
        fileId,
        modelId: result.modelId,
        accuracy: result.metrics.accuracy || result.metrics.r2Score,
      });

      const response: ApiResponse<TrainingResponse> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getModel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { modelId } = req.params;

      logger.info("Retrieving trained model", { modelId });

      // Get trained model from cache
      const trainedModel = cacheManager.get(`model:${modelId}`);
      if (!trainedModel) {
        throw new AppError("Model not found", 404, "MODEL_NOT_FOUND");
      }

      const response: ApiResponse<any> = {
        success: true,
        data: {
          modelId,
          metadata: trainedModel.metadata,
          metrics: trainedModel.metrics,
          trainedAt: trainedModel.trainedAt,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new TrainController();

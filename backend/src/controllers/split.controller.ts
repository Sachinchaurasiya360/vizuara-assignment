/**
 * Split Controller
 */

import { Request, Response, NextFunction } from "express";
// import SplitService from "../services/split.service";
import { cacheManager } from "../utils/cacheManager";
import logger from "../config/logger";
import { ApiResponse } from "../types/api.types";
import {
  TrainTestSplitResponse,
  TrainTestSplitConfig,
} from "../types/pipeline.types";
import { AppError } from "../middleware/errorHandler";

// const splitService = new SplitService();

export class SplitController {
  async split(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fileId, ...config } = req.body as {
        fileId: string;
      } & TrainTestSplitConfig;

      logger.info("Starting train-test split", {
        fileId,
        testSize: config.testSize,
        targetColumn: config.targetColumn,
        shuffle: config.shuffle,
      });

      // Verify pipeline exists
      const pipelineState = cacheManager.get(`pipeline:${fileId}`);
      if (!pipelineState) {
        throw new AppError("Pipeline not found", 404, "PIPELINE_NOT_FOUND");
      }

      // Perform split
      // TODO: Implement split service
      const result: TrainTestSplitResponse = {
        fileId,
        trainSize: 0,
        testSize: 0,
        trainSamplePreview: [],
        testSamplePreview: [],
      };

      // Update pipeline state
      cacheManager.updatePipelineState(fileId, {
        currentStep: "split",
        splitConfig: config,
      });

      logger.info("Train-test split completed", {
        fileId,
        trainSize: result.trainSize,
        testSize: result.testSize,
      });

      const response: ApiResponse<TrainTestSplitResponse> = {
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

export default new SplitController();

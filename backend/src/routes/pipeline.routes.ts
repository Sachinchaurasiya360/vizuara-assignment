/**
 * Pipeline Routes
 */

import { Router } from "express";
import rateLimit from "express-rate-limit";
import upload from "../middleware/upload";
import { validateBody } from "../middleware/validation";
import {
  PreprocessingConfigSchema,
  TrainTestSplitConfigSchema,
  ModelConfigSchema,
} from "../validators/pipeline.validator";
import uploadController from "../controllers/upload.controller";
import preprocessController from "../controllers/preprocess.controller";
import splitController from "../controllers/split.controller";
import trainController from "../controllers/train.controller";
import resultsController from "../controllers/results.controller";
import config from "../config";

const router = Router();

// Rate limiter
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      message: "Too many requests, please try again later",
      code: "RATE_LIMIT_EXCEEDED",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
router.use(limiter);

// Health check
router.get("/health", resultsController.getHealthCheck.bind(resultsController));

// File upload endpoint
router.post(
  "/upload",
  upload.single("file"),
  uploadController.uploadFile.bind(uploadController)
);

// Preprocessing endpoint
router.post(
  "/preprocess",
  validateBody(PreprocessingConfigSchema),
  preprocessController.preprocess.bind(preprocessController)
);

// Train-test split endpoint
router.post(
  "/split",
  validateBody(TrainTestSplitConfigSchema),
  splitController.split.bind(splitController)
);

// Model training endpoint
router.post(
  "/train",
  validateBody(ModelConfigSchema),
  trainController.train.bind(trainController)
);

// Get trained model
router.get("/models/:modelId", trainController.getModel.bind(trainController));

// Get results
router.get(
  "/results/:modelId",
  resultsController.getResults.bind(resultsController)
);

// Get pipeline state
router.get(
  "/pipeline/:fileId",
  resultsController.getPipelineState.bind(resultsController)
);

export default router;

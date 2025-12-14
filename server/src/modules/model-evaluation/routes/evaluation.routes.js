import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  validateGroundTruthCSV,
  validatePredictionCSV,
  parseEvaluationCSV,
  alignPredictions,
} from "../services/csv.service.js";
import {
  calculateMetrics,
  compareModels,
} from "../services/metrics.service.js";
import { saveEvaluation, getEvaluation } from "../services/storage.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for evaluation uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir =
      process.env.NODE_ENV === "production"
        ? "/tmp/evaluation-uploads"
        : path.join(__dirname, "../../../../evaluation-uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
      cb(new Error("Only CSV files are allowed"));
      return;
    }
    cb(null, true);
  },
});

/**
 * POST /api/model-evaluation/ground-truth
 * Upload ground truth CSV
 */
router.post("/ground-truth", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Parse and validate CSV
    const data = await parseEvaluationCSV(req.file.path);
    const validation = validateGroundTruthCSV(data);

    if (!validation.valid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const evaluationId = uuidv4();

    // Save ground truth
    saveEvaluation(evaluationId, {
      groundTruth: data,
      models: [],
      createdAt: new Date().toISOString(),
    });

    // Clean up file
    setTimeout(() => {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    }, 1000);

    res.json({
      success: true,
      evaluationId,
      data: {
        recordCount: data.length,
        preview: data.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Ground truth upload error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to process ground truth file",
    });
  }
});

/**
 * POST /api/model-evaluation/:evaluationId/predictions
 * Upload model predictions CSV
 */
router.post(
  "/:evaluationId/predictions",
  upload.single("file"),
  async (req, res) => {
    try {
      const { evaluationId } = req.params;
      const { modelName } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      if (!modelName) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Model name is required",
        });
      }

      const evaluation = getEvaluation(evaluationId);
      if (!evaluation) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Evaluation not found",
        });
      }

      // Parse and validate CSV
      const data = await parseEvaluationCSV(req.file.path);
      const validation = validatePredictionCSV(data);

      if (!validation.valid) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: validation.error,
        });
      }

      // Align predictions with ground truth
      const aligned = alignPredictions(evaluation.groundTruth, data);

      if (aligned.mismatches.length > 0) {
        console.warn(
          `Warning: ${aligned.mismatches.length} IDs not found in ground truth`
        );
      }

      // Calculate metrics
      const metrics = calculateMetrics(
        aligned.actual,
        aligned.predicted,
        aligned.probabilities
      );

      // Save model results
      evaluation.models.push({
        id: uuidv4(),
        name: modelName,
        predictions: aligned.predictions,
        metrics,
        uploadedAt: new Date().toISOString(),
      });

      saveEvaluation(evaluationId, evaluation);

      // Clean up file
      setTimeout(() => {
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (err) {
          console.error("Error cleaning up file:", err);
        }
      }, 1000);

      res.json({
        success: true,
        data: {
          modelId: evaluation.models[evaluation.models.length - 1].id,
          modelName,
          metrics,
          recordCount: aligned.predictions.length,
          mismatches: aligned.mismatches.length,
        },
      });
    } catch (error) {
      console.error("Predictions upload error:", error);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to process predictions file",
      });
    }
  }
);

/**
 * GET /api/model-evaluation/:evaluationId/results
 * Get evaluation results
 */
router.get("/:evaluationId/results", (req, res) => {
  try {
    const { evaluationId } = req.params;

    const evaluation = getEvaluation(evaluationId);
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    const comparison = compareModels(evaluation.models);

    res.json({
      success: true,
      data: {
        models: evaluation.models.map((m) => ({
          id: m.id,
          name: m.name,
          metrics: m.metrics,
          uploadedAt: m.uploadedAt,
        })),
        comparison,
        groundTruthCount: evaluation.groundTruth.length,
      },
    });
  } catch (error) {
    console.error("Results retrieval error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve results",
    });
  }
});

/**
 * GET /api/model-evaluation/:evaluationId/model/:modelId
 * Get detailed model results
 */
router.get("/:evaluationId/model/:modelId", (req, res) => {
  try {
    const { evaluationId, modelId } = req.params;

    const evaluation = getEvaluation(evaluationId);
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    const model = evaluation.models.find((m) => m.id === modelId);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    res.json({
      success: true,
      data: {
        model: {
          id: model.id,
          name: model.name,
          metrics: model.metrics,
          predictions: model.predictions.slice(0, 100), // First 100 for preview
          uploadedAt: model.uploadedAt,
        },
      },
    });
  } catch (error) {
    console.error("Model details retrieval error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve model details",
    });
  }
});

export default router;

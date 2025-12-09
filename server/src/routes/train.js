import express from "express";
import {
  LinearRegression,
  LogisticRegression,
  DecisionTree,
  RandomForest,
} from "../utils/mlModels.js";
import {
  calculateRegressionMetrics,
  calculateClassificationMetrics,
  calculateFeatureImportance,
} from "../utils/metrics.js";
import { getDataset, updateDataset } from "../utils/storage.js";

const router = express.Router();

/**
 * Prepare features (X) and target (y) from data
 */
function prepareData(data, targetColumn, featureColumns) {
  const X = data.map((row) =>
    featureColumns.map((col) => {
      const val = row[col];
      return isNaN(val) ? 0 : Number(val);
    })
  );

  const y = data.map((row) => {
    const val = row[targetColumn];
    return isNaN(val) ? 0 : Number(val);
  });

  return { X, y };
}

/**
 * POST /api/train
 * Train a machine learning model
 */
router.post("/", async (req, res) => {
  try {
    const { fileId, config } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    const dataset = getDataset(fileId);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    if (!dataset.trainData || !dataset.testData) {
      return res.status(400).json({
        error: "Data must be split before training",
      });
    }

    // Extract config
    const {
      modelType,
      taskType,
      targetColumn,
      featureColumns,
      hyperparameters,
    } = config;

    if (!targetColumn) {
      return res.status(400).json({ error: "Target column is required" });
    }

    if (!featureColumns || featureColumns.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one feature column is required" });
    }

    // Prepare training and test data
    const { X: XTrain, y: yTrain } = prepareData(
      dataset.trainData,
      targetColumn,
      featureColumns
    );
    const { X: XTest, y: yTest } = prepareData(
      dataset.testData,
      targetColumn,
      featureColumns
    );

    // Initialize and train model
    let model;
    const startTime = Date.now();

    switch (modelType) {
      case "linear_regression":
        model = new LinearRegression();
        model.fit(XTrain, yTrain);
        break;

      case "logistic_regression":
        model = new LogisticRegression(
          hyperparameters?.learningRate || 0.01,
          hyperparameters?.iterations || 1000
        );
        model.fit(XTrain, yTrain);
        break;

      case "decision_tree":
        model = new DecisionTree(
          hyperparameters?.maxDepth || 5,
          hyperparameters?.minSamples || 2
        );
        model.fit(XTrain, yTrain, taskType);
        break;

      case "random_forest":
        model = new RandomForest(
          hyperparameters?.nTrees || 10,
          hyperparameters?.maxDepth || 5,
          hyperparameters?.minSamples || 2
        );
        model.fit(XTrain, yTrain, taskType);
        break;

      default:
        return res.status(400).json({ error: "Invalid model type" });
    }

    const trainingTime = Date.now() - startTime;

    // Make predictions
    const trainPredictions = model.predict(XTrain);
    const testPredictions = model.predict(XTest);

    // For classification, convert probabilities to classes
    let trainPredClass = trainPredictions;
    let testPredClass = testPredictions;

    if (taskType === "classification" && modelType === "logistic_regression") {
      trainPredClass = trainPredictions.map((p) => (p >= 0.5 ? 1 : 0));
      testPredClass = testPredictions.map((p) => (p >= 0.5 ? 1 : 0));
    }

    // Calculate metrics
    let trainMetrics, testMetrics;

    if (taskType === "classification") {
      trainMetrics = calculateClassificationMetrics(yTrain, trainPredClass);
      testMetrics = calculateClassificationMetrics(yTest, testPredClass);
    } else {
      trainMetrics = calculateRegressionMetrics(yTrain, trainPredictions);
      testMetrics = calculateRegressionMetrics(yTest, testPredictions);
    }

    // Calculate feature importance
    const featureImportance = calculateFeatureImportance(
      XTrain,
      yTrain,
      trainPredictions,
      featureColumns
    );

    // Prepare predictions sample for visualization
    const predictionsSample = testPredictions.slice(0, 20).map((pred, i) => ({
      actual: yTest[i],
      predicted:
        taskType === "classification" ? testPredClass[i] : pred.toFixed(4),
      index: i,
    }));

    // Store model results
    updateDataset(fileId, {
      modelConfig: config,
      modelResults: {
        trainMetrics,
        testMetrics,
        featureImportance,
        trainingTime,
        predictionsSample,
      },
    });

    res.json({
      success: true,
      data: {
        trainMetrics,
        testMetrics,
        featureImportance,
        trainingTime: `${trainingTime}ms`,
        predictionsSample,
        modelInfo: {
          type: modelType,
          taskType,
          targetColumn,
          featureCount: featureColumns.length,
          trainSamples: XTrain.length,
          testSamples: XTest.length,
        },
      },
      message: "Model trained successfully",
    });
  } catch (error) {
    console.error("Training error:", error);
    res.status(500).json({
      success: false,
      error: "Training failed",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default router;

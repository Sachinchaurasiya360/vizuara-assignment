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
function prepareData(data, targetColumn, featureColumns, taskType) {
  const X = data.map((row) =>
    featureColumns.map((col) => {
      const val = row[col];
      return isNaN(val) ? 0 : Number(val);
    })
  );

  let y = data.map((row) => {
    const val = row[targetColumn];
    return isNaN(val) ? 0 : Number(val);
  });

  // For classification, ensure labels are binary (0 or 1)
  if (taskType === "classification") {
    const uniqueLabels = [...new Set(y)];

    // If labels are already binary (0 and 1), keep them
    const isBinary = uniqueLabels.every((label) => label === 0 || label === 1);

    if (!isBinary) {
      // Convert to binary: first unique value = 0, second = 1
      console.log(`🔄 [PREPROCESSING] Converting labels to binary format...`);
      console.log(
        `   Original unique labels: [${uniqueLabels.slice(0, 10).join(", ")}${
          uniqueLabels.length > 10 ? "..." : ""
        }]`
      );

      if (uniqueLabels.length > 2) {
        console.error(
          `❌ [ERROR] Target column has ${uniqueLabels.length} unique values for classification`
        );

        // Check if values look continuous (for regression suggestion)
        const isContinuous = uniqueLabels.length > 10;
        const errorMsg = isContinuous
          ? `The target column "${targetColumn}" has ${
              uniqueLabels.length
            } unique numeric values [${uniqueLabels
              .slice(0, 5)
              .join(
                ", "
              )}...]. This looks like a REGRESSION problem, not classification. Please change the task type to "Regression" in the model selection step.`
          : `The target column "${targetColumn}" has ${
              uniqueLabels.length
            } unique values [${uniqueLabels
              .slice(0, 5)
              .join(
                ", "
              )}...]. Binary classification requires exactly 2 classes (e.g., Yes/No, 0/1, Pass/Fail). Please select a different target column or change to regression.`;

        throw new Error(errorMsg);
      }

      if (uniqueLabels.length < 2) {
        throw new Error(
          `The target column "${targetColumn}" has only 1 unique value. Classification requires at least 2 different classes. Please select a different target column.`
        );
      }

      // Map to binary
      const labelMap = {
        [uniqueLabels[0]]: 0,
        [uniqueLabels[1]]: 1,
      };

      y = y.map((val) => (labelMap[val] !== undefined ? labelMap[val] : 0));
      console.log(
        `   ✅ Converted to binary: ${uniqueLabels[0]} → 0, ${uniqueLabels[1]} → 1`
      );
    }
  }

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
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    const dataset = getDataset(fileId);
    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found",
      });
    }

    if (!dataset.trainData || !dataset.testData) {
      return res.status(400).json({
        success: false,
        message: "Data must be split before training",
      });
    }

    // Validation Rule 1: Check if test set is empty
    console.log("📊 [VALIDATION] Checking split validation...");
    if (dataset.testData.length === 0) {
      console.error("❌ [ERROR] Test set is empty");
      return res.status(400).json({
        success: false,
        message: "Test set is empty. Adjust split ratio or dataset.",
      });
    }
    console.log(
      `✅ [VALIDATION] Train samples: ${dataset.trainData.length}, Test samples: ${dataset.testData.length}`
    );

    // Extract config
    const {
      modelType,
      taskType,
      targetColumn,
      featureColumns,
      hyperparameters,
    } = config;

    if (!targetColumn) {
      return res.status(400).json({
        success: false,
        message: "Target column is required",
      });
    }

    if (!featureColumns || featureColumns.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one feature column is required",
      });
    }

    // Validation Rule 2: Check target column exists in both datasets
    console.log("📊 [VALIDATION] Checking target column existence...");
    const trainHasTarget =
      dataset.trainData.length > 0 && targetColumn in dataset.trainData[0];
    const testHasTarget =
      dataset.testData.length > 0 && targetColumn in dataset.testData[0];

    if (!trainHasTarget || !testHasTarget) {
      console.error(
        `❌ [ERROR] Target column "${targetColumn}" not found in ${
          !trainHasTarget ? "train" : "test"
        } set`
      );
      return res.status(400).json({
        success: false,
        message: `Target column "${targetColumn}" does not exist in ${
          !trainHasTarget ? "training" : "test"
        } dataset.`,
      });
    }
    console.log(
      `✅ [VALIDATION] Target column "${targetColumn}" exists in both datasets`
    );

    // Prepare training and test data
    console.log("📊 [PREPROCESSING] Preparing features and labels...");
    const { X: XTrain, y: yTrain } = prepareData(
      dataset.trainData,
      targetColumn,
      featureColumns,
      taskType
    );
    const { X: XTest, y: yTest } = prepareData(
      dataset.testData,
      targetColumn,
      featureColumns,
      taskType
    );
    console.log(
      `✅ [PREPROCESSING] Features prepared: ${featureColumns.length} features`
    );
    console.log(
      `   Train labels sample: [${yTrain.slice(0, 5).join(", ")}...]`
    );
    console.log(`   Test labels sample: [${yTest.slice(0, 5).join(", ")}...]`);

    // Validation Rule 2 (continued): Check for single-class training data
    const uniqueTrainLabels = [...new Set(yTrain)];
    console.log(
      `📊 [VALIDATION] Checking class distribution... Unique classes: ${uniqueTrainLabels.length}`
    );

    if (taskType === "classification" && uniqueTrainLabels.length === 1) {
      console.warn(
        `⚠️ [WARNING] Training labels contain only one class: ${uniqueTrainLabels[0]}`
      );
      return res.status(400).json({
        success: false,
        message: `Training labels contain only one class: ${uniqueTrainLabels[0]}. Model cannot learn with only one class. Please check your data split or select a different target column.`,
      });
    }
    console.log(`✅ [VALIDATION] Class distribution is valid for ${taskType}`);

    // Initialize and train model
    let model;
    const startTime = Date.now();
    console.log(
      `🤖 [TRAINING] Starting ${modelType} training for ${taskType}...`
    );

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
        return res.status(400).json({
          success: false,
          message: "Invalid model type. Please select a valid model.",
        });
    }

    const trainingTime = Date.now() - startTime;
    console.log(
      `✅ [TRAINING] Model trained successfully in ${trainingTime}ms`
    );

    // Make predictions
    console.log("🔮 [PREDICTION] Generating predictions...");
    const trainPredictions = model.predict(XTrain);
    const testPredictions = model.predict(XTest);

    // Validation Rule 3: Check if predictions are empty
    if (!trainPredictions || trainPredictions.length === 0) {
      console.error("❌ [ERROR] Training predictions array is empty");
      return res.status(500).json({
        success: false,
        error: "No predictions available for metric calculation.",
        details: "Model failed to generate training predictions",
      });
    }

    if (!testPredictions || testPredictions.length === 0) {
      console.error("❌ [ERROR] Test predictions array is empty");
      return res.status(500).json({
        success: false,
        error: "No predictions available for metric calculation.",
        details: "Model failed to generate test predictions",
      });
    }
    console.log(
      `✅ [PREDICTION] Generated ${trainPredictions.length} train and ${testPredictions.length} test predictions`
    );

    // For classification, convert probabilities to classes
    let trainPredClass = trainPredictions;
    let testPredClass = testPredictions;

    if (taskType === "classification" && modelType === "logistic_regression") {
      trainPredClass = trainPredictions.map((p) => (p >= 0.5 ? 1 : 0));
      testPredClass = testPredictions.map((p) => (p >= 0.5 ? 1 : 0));
      console.log("🔮 [PREDICTION] Converted probabilities to class labels");
    }

    // Calculate metrics
    console.log("📈 [METRICS] Calculating performance metrics...");
    let trainMetrics, testMetrics;

    if (taskType === "classification") {
      trainMetrics = calculateClassificationMetrics(yTrain, trainPredClass);
      testMetrics = calculateClassificationMetrics(yTest, testPredClass);

      // Validation Rule 4: Check for zeroed confusion matrix
      const { confusionMatrix } = testMetrics;
      if (
        confusionMatrix.truePositive === 0 &&
        confusionMatrix.trueNegative === 0 &&
        confusionMatrix.falsePositive === 0 &&
        confusionMatrix.falseNegative === 0
      ) {
        console.error("❌ [ERROR] Confusion matrix is all zeros");
        return res.status(500).json({
          success: false,
          error: "Evaluation failed due to invalid dataset or split.",
          details:
            "All confusion matrix values are zero. Check your data split and target column.",
        });
      }
      console.log(
        `✅ [METRICS] Classification metrics calculated - Accuracy: ${testMetrics.accuracy}`
      );
    } else {
      trainMetrics = calculateRegressionMetrics(yTrain, trainPredictions);
      testMetrics = calculateRegressionMetrics(yTest, testPredictions);
      console.log(
        `✅ [METRICS] Regression metrics calculated - R²: ${testMetrics.r2}`
      );
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

    console.log("✅ [SUCCESS] Model training and evaluation complete!");
    console.log(
      `📊 [SUMMARY] Model: ${modelType}, Task: ${taskType}, Time: ${trainingTime}ms`
    );
    console.log(
      `📊 [SUMMARY] Train/Test: ${XTrain.length}/${XTest.length} samples`
    );

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
    console.error("❌ [ERROR] Training failed:", error.message);
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Training failed unexpectedly",
    });
  }
});

export default router;

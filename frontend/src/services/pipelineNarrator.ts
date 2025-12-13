/**
 * Pipeline Narrator Service
 *
 * Generates human-readable explanations of ML pipeline executions.
 * This is a purely additive feature that consumes existing pipeline metadata
 * without modifying any existing logic or data structures.
 */

import type {
  PreprocessingConfig,
  TrainTestSplitConfig,
  ModelConfig,
  TrainingResponse,
  ModelMetrics,
} from "@/types/pipeline.types";

interface PipelineNarrationInput {
  preprocessingConfig?: PreprocessingConfig | null;
  splitConfig?: TrainTestSplitConfig | null;
  modelConfig?: ModelConfig | null;
  results?: TrainingResponse | null;
}

/**
 * Generates a human-readable narration of the entire ML pipeline execution
 */
export function generatePipelineNarration(
  input: PipelineNarrationInput
): string {
  const sections: string[] = [];

  // 1. Preprocessing narration
  const preprocessingText = narratePreprocessing(input.preprocessingConfig);
  if (preprocessingText) {
    sections.push(preprocessingText);
  }

  // 2. Train-test split narration
  const splitText = narrateSplit(input.splitConfig);
  if (splitText) {
    sections.push(splitText);
  }

  // 3. Model training narration
  const modelText = narrateModel(input.modelConfig);
  if (modelText) {
    sections.push(modelText);
  }

  // 4. Results narration
  const resultsText = narrateResults(
    input.results,
    input.modelConfig?.taskType
  );
  if (resultsText) {
    sections.push(resultsText);
  }

  // Combine all sections into a coherent narrative
  if (sections.length === 0) {
    return "Pipeline execution completed successfully.";
  }

  return sections.join(" ");
}

/**
 * Narrates preprocessing steps applied to the data
 */
function narratePreprocessing(
  config?: PreprocessingConfig | null
): string | null {
  if (!config) return null;

  const steps: string[] = [];

  // Missing values handling
  if (config.missingValues && config.missingValues.length > 0) {
    config.missingValues.forEach((mv) => {
      const columnCount = mv.columns?.length || 0;
      if (columnCount > 0) {
        const strategy = mv.strategy;
        steps.push(
          `handled missing values in ${columnCount} column${
            columnCount > 1 ? "s" : ""
          } using ${strategy} strategy`
        );
      }
    });
  }

  // Scaling
  if (config.scaling && config.scaling.length > 0) {
    config.scaling.forEach((sc) => {
      const columnCount = sc.columns?.length || 0;
      if (columnCount > 0) {
        const method = sc.method || "standard";
        steps.push(
          `${
            method === "standardize"
              ? "standardized"
              : method === "normalize"
              ? "normalized"
              : `scaled (${method})`
          } ${columnCount} numerical column${columnCount > 1 ? "s" : ""}`
        );
      }
    });
  }

  // Encoding
  if (config.encoding && config.encoding.length > 0) {
    config.encoding.forEach((enc) => {
      const columnCount = enc.columns?.length || 0;
      if (columnCount > 0) {
        const method = enc.method || "onehot";
        steps.push(
          `encoded ${columnCount} categorical column${
            columnCount > 1 ? "s" : ""
          } using ${
            method === "onehot" ? "one-hot encoding" : `${method} encoding`
          }`
        );
      }
    });
  }

  // Outlier removal
  if (config.outliers && config.outliers.length > 0) {
    config.outliers.forEach((out) => {
      const columnCount = out.columns?.length || 0;
      if (columnCount > 0) {
        steps.push(
          `removed outliers from ${columnCount} column${
            columnCount > 1 ? "s" : ""
          } using ${out.method} method`
        );
      }
    });
  }

  // Feature selection
  if (config.featureSelection) {
    const method = config.featureSelection.method;
    const nFeatures = config.featureSelection.nFeatures;
    if (method) {
      steps.push(
        `selected features using ${method}${
          nFeatures ? ` (top ${nFeatures})` : ""
        }`
      );
    }
  }

  if (steps.length === 0) return null;

  const verb = steps.length === 1 ? "We" : "We";
  return `${verb} ${steps.join(", ")}.`;
}

/**
 * Narrates the train-test split configuration
 */
function narrateSplit(config?: TrainTestSplitConfig | null): string | null {
  if (!config) return null;

  const testSize = config.testSize || 0.2;
  const trainSize = 1 - testSize;
  const trainPercent = Math.round(trainSize * 100);
  const testPercent = Math.round(testSize * 100);

  const shuffleText = config.shuffle ? "randomly shuffled and " : "";
  const stratifyText = config.stratify
    ? ` with stratification on ${config.stratifyColumn || "target column"}`
    : "";

  return `The dataset was ${shuffleText}split into ${trainPercent}% training data and ${testPercent}% testing data${stratifyText}.`;
}

/**
 * Narrates the model selection and hyperparameters
 */
function narrateModel(config?: ModelConfig | null): string | null {
  if (!config) return null;

  const modelName = formatModelName(config.modelType);
  const taskType = config.taskType || "classification";
  const featureCount = config.featureColumns?.length || 0;

  let hyperparamsText = "";
  if (
    config.hyperparameters &&
    Object.keys(config.hyperparameters).length > 0
  ) {
    const params = Object.entries(config.hyperparameters)
      .map(([key, value]) => {
        const formattedKey = formatHyperparameterName(key);
        return `${formattedKey} ${value}`;
      })
      .slice(0, 3) // Limit to first 3 hyperparameters for readability
      .join(", ");

    if (params) {
      hyperparamsText = ` with ${params}`;
    }
  }

  return `We trained a ${modelName} model for ${taskType} using ${featureCount} feature${
    featureCount !== 1 ? "s" : ""
  }${hyperparamsText}.`;
}

/**
 * Narrates the evaluation results
 */
function narrateResults(
  results?: TrainingResponse | null,
  taskType?: string
): string | null {
  if (!results || !results.testMetrics) return null;

  const metrics = results.testMetrics;
  const isClassification = taskType === "classification";

  if (isClassification) {
    return narrateClassificationResults(metrics);
  } else {
    return narrateRegressionResults(metrics);
  }
}

/**
 * Narrates classification model results
 */
function narrateClassificationResults(metrics: ModelMetrics): string | null {
  const parts: string[] = [];

  if (metrics.accuracy !== undefined) {
    const accuracyPercent = Math.round(metrics.accuracy * 100);
    parts.push(`achieved ${accuracyPercent}% accuracy`);
  }

  if (metrics.f1Score !== undefined) {
    const f1Percent = Math.round(metrics.f1Score * 100);
    parts.push(`${f1Percent}% F1-score`);
  }

  if (metrics.precision !== undefined) {
    const precisionPercent = Math.round(metrics.precision * 100);
    parts.push(`${precisionPercent}% precision`);
  }

  if (metrics.recall !== undefined) {
    const recallPercent = Math.round(metrics.recall * 100);
    parts.push(`${recallPercent}% recall`);
  }

  if (parts.length === 0) return null;

  return `The model ${parts.join(", ")} on unseen test data.`;
}

/**
 * Narrates regression model results
 */
function narrateRegressionResults(metrics: ModelMetrics): string | null {
  const parts: string[] = [];

  if (metrics.r2Score !== undefined) {
    const r2Percent = Math.round(metrics.r2Score * 100);
    parts.push(`an R² score of ${r2Percent}%`);
  }

  if (metrics.rmse !== undefined) {
    parts.push(`RMSE of ${metrics.rmse.toFixed(2)}`);
  }

  if (metrics.mae !== undefined) {
    parts.push(`MAE of ${metrics.mae.toFixed(2)}`);
  }

  if (parts.length === 0) return null;

  return `The model achieved ${parts.join(", ")} on the test set.`;
}

/**
 * Formats model type into readable name
 */
function formatModelName(modelType: string): string {
  const nameMap: Record<string, string> = {
    logistic_regression: "Logistic Regression",
    decision_tree: "Decision Tree",
    random_forest: "Random Forest",
    gradient_boosting: "Gradient Boosting",
    svm: "Support Vector Machine",
    knn: "K-Nearest Neighbors",
    naive_bayes: "Naive Bayes",
    neural_network: "Neural Network",
    linear_regression: "Linear Regression",
    ridge: "Ridge Regression",
    lasso: "Lasso Regression",
    elasticnet: "ElasticNet Regression",
  };

  return nameMap[modelType] || modelType.replace(/_/g, " ");
}

/**
 * Formats hyperparameter names into readable text
 */
function formatHyperparameterName(key: string): string {
  const nameMap: Record<string, string> = {
    max_depth: "max depth",
    maxDepth: "max depth",
    min_samples_split: "min samples split",
    minSamples: "min samples",
    n_estimators: "trees",
    nTrees: "trees",
    learning_rate: "learning rate",
    learningRate: "learning rate",
    C: "regularization",
    alpha: "alpha",
    max_iter: "max iterations",
    iterations: "iterations",
  };

  return nameMap[key] || key.replace(/_/g, " ");
}

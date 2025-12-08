/**
 * Pipeline Types and Interfaces
 * Shared types between frontend and backend
 */

export type TaskType = "classification" | "regression";

export type ModelType =
  | "logistic_regression"
  | "decision_tree"
  | "random_forest"
  | "linear_regression"
  | "ridge"
  | "lasso";

export type ScalerType = "standard" | "minmax" | "robust" | "none";

export type EncodingType = "onehot" | "label" | "target" | "none";

export type MissingValueStrategy =
  | "drop"
  | "mean"
  | "median"
  | "mode"
  | "constant";

export interface ColumnInfo {
  name: string;
  type: "numeric" | "categorical" | "datetime" | "boolean";
  nullCount: number;
  uniqueCount: number;
  sample?: string[];
}

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnInfo[];
  preview: Record<string, any>[];
  uploadedAt: string;
}

export interface PreprocessingConfig {
  missingValueHandling: {
    strategy: MissingValueStrategy;
    columns?: string[];
    fillValue?: string | number;
  };
  scaling: {
    method: ScalerType;
    columns?: string[];
  };
  encoding: {
    method: EncodingType;
    columns?: string[];
  };
  removeColumns?: string[];
}

export interface PreprocessingResponse {
  fileId: string;
  transformations: string[];
  rowsRemoved: number;
  columnsRemoved: number;
  newColumns: string[];
  preview: Record<string, any>[];
  updatedColumns: ColumnInfo[];
}

export interface TrainTestSplitConfig {
  testSize: number;
  randomState?: number;
  stratify?: boolean;
  targetColumn?: string;
  shuffle?: boolean;
}

export interface TrainTestSplitResponse {
  fileId: string;
  trainSize: number;
  testSize: number;
  trainSamplePreview: Record<string, any>[];
  testSamplePreview: Record<string, any>[];
}

export interface ModelConfig {
  modelType: ModelType;
  taskType: TaskType;
  targetColumn: string;
  featureColumns: string[];
  hyperparameters?: Record<string, any>;
}

export interface TrainingResponse {
  modelId: string;
  modelType: ModelType;
  taskType: TaskType;
  trainingTime: number;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    r2Score?: number;
    mae?: number;
    mse?: number;
    rmse?: number;
  };
  confusionMatrix?: number[][];
  featureImportance?: Array<{ feature: string; importance: number }>;
}

export interface PredictionResult {
  predictions: (number | string)[];
  probabilities?: number[][];
}

export interface MetricsResponse extends TrainingResponse {
  visualizations?: {
    confusionMatrix?: string; // Base64 encoded image
    featureImportance?: string; // Base64 encoded image
    rocCurve?: string; // Base64 encoded image
    residualPlot?: string; // Base64 encoded image
  };
}

export interface PipelineState {
  fileId: string;
  fileName: string;
  currentStep: "upload" | "preprocess" | "split" | "train" | "results";
  uploadData?: FileUploadResponse;
  preprocessConfig?: PreprocessingConfig;
  preprocessResult?: PreprocessingResponse;
  splitConfig?: TrainTestSplitConfig;
  splitResult?: TrainTestSplitResponse;
  modelConfig?: ModelConfig;
  trainingResult?: TrainingResponse;
  createdAt: Date;
  updatedAt: Date;
}

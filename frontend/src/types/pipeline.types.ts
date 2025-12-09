// ============================================
// Core Pipeline Types
// ============================================

export type PipelineStepType =
  | "upload"
  | "preprocess"
  | "split"
  | "model"
  | "results";

export interface PipelineStep {
  id: string;
  type: PipelineStepType;
  status: "pending" | "completed" | "error" | "processing";
  data?: unknown;
  error?: string;
}

// ============================================
// File Upload Types
// ============================================

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url?: string;
}

export interface FileUploadResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnInfo[];
  preview: DataPreview;
}

export interface ColumnInfo {
  name: string;
  type: "numeric" | "categorical" | "datetime" | "text";
  uniqueCount: number;
  missingCount: number;
  stats?: ColumnStats;
}

export interface ColumnStats {
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  mode?: string | number;
}

export interface DataPreview {
  headers: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

// ============================================
// Preprocessing Types
// ============================================

export type PreprocessingOperation =
  | "handleMissing"
  | "scaleFeatures"
  | "encodeCategories"
  | "removeOutliers"
  | "featureSelection";

export interface MissingValueStrategy {
  strategy: "drop" | "mean" | "median" | "mode" | "constant";
  columns: string[];
  fillValue?: string | number;
}

export interface ScalingStrategy {
  method: "standardize" | "normalize" | "minmax" | "robust";
  columns: string[];
}

export interface EncodingStrategy {
  method: "onehot" | "label" | "ordinal" | "target";
  columns: string[];
}

export interface OutlierStrategy {
  method: "iqr" | "zscore" | "isolation";
  threshold: number;
  columns: string[];
}

export interface FeatureSelectionStrategy {
  method: "correlation" | "variance" | "mutual_info" | "rfe";
  nFeatures?: number;
  threshold?: number;
}

export interface PreprocessingConfig {
  missingValues?: MissingValueStrategy[];
  scaling?: ScalingStrategy[];
  encoding?: EncodingStrategy[];
  outliers?: OutlierStrategy[];
  featureSelection?: FeatureSelectionStrategy;
}

export interface PreprocessingResponse {
  success: boolean;
  rowsRemoved: number;
  columnsRemoved: number;
  newColumns: string[];
  preview: DataPreview;
  transformations: string[];
}

// ============================================
// Train-Test Split Types
// ============================================

export interface TrainTestSplitConfig {
  testSize: number; // 0-1
  randomState?: number;
  stratify?: boolean;
  stratifyColumn?: string;
  shuffle: boolean;
}

export interface TrainTestSplitResponse {
  success: boolean;
  trainSize: number;
  testSize: number;
  trainCount: number;
  testCount: number;
  trainPercentage: string;
  testPercentage: string;
  trainPreview: DataPreview;
  testPreview: DataPreview;
}

// ============================================
// Model Types
// ============================================

export type ModelType =
  | "logistic_regression"
  | "decision_tree"
  | "random_forest"
  | "gradient_boosting"
  | "svm"
  | "knn"
  | "naive_bayes"
  | "neural_network"
  | "linear_regression"
  | "ridge"
  | "lasso"
  | "elasticnet";

export type TaskType = "classification" | "regression";

export interface ModelConfig {
  modelType: ModelType;
  taskType: TaskType;
  targetColumn: string;
  featureColumns: string[];
  hyperparameters?: Record<string, unknown>;
}

export interface HyperparameterConfig {
  name: string;
  type: "number" | "select" | "boolean" | "range";
  value: unknown;
  options?: string[] | number[];
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export interface ModelMetadata {
  name: string;
  type: ModelType;
  taskType: TaskType;
  description: string;
  hyperparameters: HyperparameterConfig[];
}

// ============================================
// Training & Results Types
// ============================================

export interface TrainingResponse {
  success: boolean;
  trainMetrics: ModelMetrics;
  testMetrics: ModelMetrics;
  featureImportance?: FeatureImportance[];
  trainingTime: string;
  predictionsSample?: Prediction[];
  modelInfo?: {
    type: string;
    taskType: string;
    targetColumn: string;
    featureCount: number;
    trainSamples: number;
    testSamples: number;
  };
}

export interface ModelMetrics {
  // Classification metrics
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rocAuc?: number;

  // Regression metrics
  mse?: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;

  // Common
  trainingScore?: number;
  validationScore?: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface Prediction {
  actual: string | number;
  predicted: string | number;
  index: number;
  probability?: number;
}

export interface ConfusionMatrixData {
  matrix: number[][];
  labels: string[];
}

// ============================================
// Pipeline State Types
// ============================================

export interface PipelineState {
  steps: PipelineStep[];
  currentStep: PipelineStepType | null;

  // Data
  uploadedFile: FileUploadResponse | null;
  preprocessingConfig: PreprocessingConfig | null;
  splitConfig: TrainTestSplitConfig | null;
  modelConfig: ModelConfig | null;
  results: TrainingResponse | null;

  // UI State
  isLoading: boolean;
  error: string | null;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// ============================================
// React Flow Node Types
// ============================================

export interface PipelineNodeData {
  label: string;
  type: PipelineStepType;
  status: PipelineStep["status"];
  icon?: string;
  description?: string;
}

export type PipelineNode = {
  id: string;
  type: "pipelineNode";
  position: { x: number; y: number };
  data: PipelineNodeData;
};

export type PipelineEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: React.CSSProperties;
};

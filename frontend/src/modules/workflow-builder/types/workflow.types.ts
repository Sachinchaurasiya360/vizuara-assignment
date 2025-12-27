// ============================================
// Workflow Node Types
// ============================================

export type WorkflowNodeType =
  | "dataset"
  | "preprocessing"
  | "split"
  | "model"
  | "evaluation";

export type PreprocessingSubType =
  | "scaling"
  | "normalization"
  | "encoding"
  | "missing_values"
  | "outlier_removal";

export type ModelSubType =
  | "logistic_regression"
  | "decision_tree"
  | "random_forest"
  | "linear_regression";

// ============================================
// Node Configuration Interfaces
// ============================================

export interface BaseNodeConfig {
  id: string;
  type: WorkflowNodeType;
  label: string;
  position: { x: number; y: number };
  status: "idle" | "configured" | "running" | "completed" | "error";
  validated: boolean;
  validationErrors: string[];
}

export interface DatasetNodeConfig extends BaseNodeConfig {
  type: "dataset";
  config: {
    fileId?: string;
    fileName?: string;
    rowCount?: number;
    columnCount?: number;
    columns?: Array<{ name: string; type: string }>;
  };
}

export interface PreprocessingNodeConfig extends BaseNodeConfig {
  type: "preprocessing";
  config: {
    subType: PreprocessingSubType;
    // Scaling/Normalization
    method?: "standardize" | "normalize" | "minmax" | "robust";
    columns?: string[];
    // Encoding
    encodingMethod?: "onehot" | "label" | "ordinal";
    categoricalColumns?: string[];
    // Missing values
    missingStrategy?: "drop" | "mean" | "median" | "mode" | "constant";
    fillValue?: string | number;
    // Outlier removal
    outlierMethod?: "iqr" | "zscore";
    threshold?: number;
  };
}

export interface SplitNodeConfig extends BaseNodeConfig {
  type: "split";
  config: {
    testSize: number; // 0-1
    randomState?: number;
    stratify?: boolean;
    stratifyColumn?: string;
    shuffle: boolean;
  };
}

export interface ModelNodeConfig extends BaseNodeConfig {
  type: "model";
  config: {
    subType: ModelSubType;
    targetColumn?: string;
    featureColumns?: string[];
    taskType?: "classification" | "regression";
    hyperparameters?: Record<string, number | string | boolean>;
  };
}

export interface EvaluationNodeConfig extends BaseNodeConfig {
  type: "evaluation";
  config: {
    metrics?: string[];
    visualizations?: string[];
  };
}

export type WorkflowNode =
  | DatasetNodeConfig
  | PreprocessingNodeConfig
  | SplitNodeConfig
  | ModelNodeConfig
  | EvaluationNodeConfig;

// ============================================
// Workflow Edge Type
// ============================================

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  validated: boolean;
  validationErrors: string[];
}

// ============================================
// Workflow State
// ============================================

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  executionResults: Record<string, unknown>;
  error: string | null;
}

// ============================================
// Component Palette Items
// ============================================

export interface PaletteItem {
  id: string;
  type: WorkflowNodeType;
  subType?: PreprocessingSubType | ModelSubType;
  label: string;
  description: string;
  icon: string;
  category: "data" | "preprocessing" | "model" | "evaluation";
  color: string;
}

// ============================================
// Validation Rules
// ============================================

export interface ValidationRule {
  nodeType: WorkflowNodeType;
  requiredPredecessors: WorkflowNodeType[];
  maxInstances?: number;
  requiredConfig?: string[];
}

// ============================================
// Execution Types
// ============================================

export interface ExecutionStep {
  nodeId: string;
  nodeType: WorkflowNodeType;
  order: number;
  dependencies: string[];
}

export interface WorkflowExecutionPlan {
  steps: ExecutionStep[];
  totalSteps: number;
  estimatedTime?: number;
}

export interface NodeExecutionResult {
  nodeId: string;
  status: "success" | "error";
  data?: unknown;
  error?: string;
  executionTime?: number;
}

// ============================================
// API Types
// ============================================

export interface WorkflowExecutionRequest {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  executionPlan: WorkflowExecutionPlan;
}

export interface WorkflowExecutionResponse {
  success: boolean;
  results: Record<string, NodeExecutionResult>;
  finalOutput?: unknown;
  totalExecutionTime: number;
}

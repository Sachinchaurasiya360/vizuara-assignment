import type { PaletteItem } from "../types/workflow.types";

export const PALETTE_ITEMS: PaletteItem[] = [
  // ============================================
  // Data Category
  // ============================================
  {
    id: "dataset",
    type: "dataset",
    label: "Dataset Upload",
    description: "Upload and load your dataset (CSV/Excel)",
    icon: "📊",
    category: "data",
    color: "#3b82f6", // blue
  },

  // ============================================
  // Preprocessing Category
  // ============================================
  {
    id: "scaling",
    type: "preprocessing",
    subType: "scaling",
    label: "Feature Scaling",
    description: "Standardize or normalize numeric features",
    icon: "📏",
    category: "preprocessing",
    color: "#8b5cf6", // purple
  },
  {
    id: "normalization",
    type: "preprocessing",
    subType: "normalization",
    label: "Normalization",
    description: "Scale features to 0-1 range",
    icon: "📐",
    category: "preprocessing",
    color: "#8b5cf6",
  },
  {
    id: "encoding",
    type: "preprocessing",
    subType: "encoding",
    label: "Encoding",
    description: "Convert categorical variables to numeric",
    icon: "🔤",
    category: "preprocessing",
    color: "#8b5cf6",
  },
  {
    id: "missing_values",
    type: "preprocessing",
    subType: "missing_values",
    label: "Handle Missing Values",
    description: "Fill or remove missing data",
    icon: "🔧",
    category: "preprocessing",
    color: "#8b5cf6",
  },
  {
    id: "outlier_removal",
    type: "preprocessing",
    subType: "outlier_removal",
    label: "Remove Outliers",
    description: "Detect and remove statistical outliers",
    icon: "🎯",
    category: "preprocessing",
    color: "#8b5cf6",
  },

  // ============================================
  // Split
  // ============================================
  {
    id: "split",
    type: "split",
    label: "Train-Test Split",
    description: "Split data into training and testing sets",
    icon: "✂️",
    category: "data",
    color: "#10b981", // green
  },

  // ============================================
  // Models Category
  // ============================================
  {
    id: "logistic_regression",
    type: "model",
    subType: "logistic_regression",
    label: "Logistic Regression",
    description: "Binary classification model",
    icon: "🎲",
    category: "model",
    color: "#f59e0b", // amber
  },
  {
    id: "decision_tree",
    type: "model",
    subType: "decision_tree",
    label: "Decision Tree",
    description: "Tree-based classification/regression",
    icon: "🌳",
    category: "model",
    color: "#f59e0b",
  },
  {
    id: "random_forest",
    type: "model",
    subType: "random_forest",
    label: "Random Forest",
    description: "Ensemble of decision trees",
    icon: "🌲",
    category: "model",
    color: "#f59e0b",
  },
  {
    id: "linear_regression",
    type: "model",
    subType: "linear_regression",
    label: "Linear Regression",
    description: "Linear relationship prediction",
    icon: "📈",
    category: "model",
    color: "#f59e0b",
  },

  // ============================================
  // Evaluation Category
  // ============================================
  {
    id: "evaluation",
    type: "evaluation",
    label: "Model Evaluation",
    description: "Evaluate model performance metrics",
    icon: "📊",
    category: "evaluation",
    color: "#ef4444", // red
  },
];

export const PALETTE_CATEGORIES = [
  { id: "data", label: "Data", icon: "📁" },
  { id: "preprocessing", label: "Preprocessing", icon: "⚙️" },
  { id: "model", label: "Models", icon: "🤖" },
  { id: "evaluation", label: "Evaluation", icon: "📈" },
] as const;

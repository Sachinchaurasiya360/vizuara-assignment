import React, { useState } from "react";
import {
  X,
  Settings,
  Save,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Upload,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { useWorkflowStore } from "../store/workflowStore";
import { uploadFile } from "@/api/pipeline.api";
import type {
  WorkflowNode,
  DatasetNodeConfig,
  PreprocessingNodeConfig,
  SplitNodeConfig,
  ModelNodeConfig,
} from "../types/workflow.types";

interface ConfigurationPanelProps {
  nodeId: string | null;
  onClose: () => void;
}

// ============================================
// Smart Suggestion Box
// ============================================

interface Suggestion {
  title: string;
  description: string;
  nextSteps?: string[];
  tip?: string;
  explanation?: string[];
  methods?: string[];
}

function SuggestionBox({ node }: { node: WorkflowNode }) {
  const getSuggestion = (): Suggestion => {
    switch (node.type) {
      case "dataset":
        return {
          title: "📊 Dataset Upload",
          description: "Upload your CSV or Excel file to begin.",
          nextSteps: [
            "After uploading, you can connect to Preprocessing nodes to clean your data",
            "Or connect directly to Train-Test Split if your data is already clean",
          ],
          tip: "Supported formats: .csv, .xlsx, .xls (max 50MB)",
        };

      case "preprocessing": {
        const config = (node as PreprocessingNodeConfig).config;
        const baseInfo = {
          title: "⚙️ Data Preprocessing",
          nextSteps: [
            "After preprocessing, connect to another preprocessing node to chain transformations",
            "Or connect to Train-Test Split to prepare for model training",
          ],
        };

        switch (config.subType) {
          case "scaling":
            return {
              ...baseInfo,
              description:
                "Standardize numeric features to improve model performance.",
              methods: [
                "**Standardization (Z-score)**: Scales to mean=0, std=1. Best for most ML algorithms.",
                "**Normalization (0-1)**: Scales values between 0 and 1. Good for neural networks.",
                "**Min-Max Scaling**: Similar to normalization. Use when you need specific range.",
                "**Robust Scaling**: Uses median and IQR. Best when data has outliers.",
              ],
              tip: "💡 Use Standardization for tree-based models, Normalization for neural networks.",
            };

          case "normalization":
            return {
              ...baseInfo,
              description:
                "Scale features to a 0-1 range for better convergence.",
              tip: "💡 Normalization is essential for gradient-based algorithms and neural networks.",
            };

          case "encoding":
            return {
              ...baseInfo,
              description: "Convert categorical text to numbers for ML models.",
              methods: [
                "**One-Hot Encoding**: Creates binary columns for each category. Best for nominal data (e.g., colors, countries).",
                "**Label Encoding**: Assigns integers to categories. Use for ordinal data (e.g., small, medium, large).",
                "**Ordinal Encoding**: Custom order for categories. When order matters.",
              ],
              tip: "💡 Use One-Hot for categories without order, Label for ordered categories.",
            };

          case "missing_values":
            return {
              ...baseInfo,
              description: "Handle missing or null values in your dataset.",
              methods: [
                "**Drop rows**: Remove rows with missing values. Use when few missing values.",
                "**Fill with mean**: Replace with average. Good for numeric data without outliers.",
                "**Fill with median**: Replace with middle value. Better with outliers.",
                "**Fill with mode**: Replace with most common value. Best for categorical data.",
                "**Fill with constant**: Replace with a specific value you choose.",
              ],
              tip: "💡 Mean works for normal distributions, Median for skewed data.",
            };

          case "outlier_removal":
            return {
              ...baseInfo,
              description:
                "Detect and remove statistical outliers from your data.",
              methods: [
                "**IQR Method**: Removes values beyond 1.5 × IQR from quartiles. Standard approach.",
                "**Z-score**: Removes values beyond N standard deviations from mean.",
              ],
              tip: "💡 Be careful: outliers might be important data points, not errors!",
            };

          default:
            return {
              ...baseInfo,
              description:
                "Choose a preprocessing type to see detailed information.",
              tip: "💡 Select the preprocessing type from the dropdown below.",
            };
        }
      }

      case "split":
        return {
          title: "✂️ Train-Test Split",
          description: "Divide your data into training and testing sets.",
          explanation: [
            "**Training Set**: Used to train the model (typically 70-80%).",
            "**Testing Set**: Used to evaluate model performance (typically 20-30%).",
          ],
          nextSteps: [
            "After splitting, connect to a Model node to train your ML algorithm",
          ],
          tip: "💡 Common splits: 80/20, 70/30, or 75/25. Larger datasets can use smaller test sets.",
        };

      case "model": {
        const config = (node as ModelNodeConfig).config;
        const baseInfo = {
          title: "🤖 Model Training",
          nextSteps: [
            "After training, connect to Model Evaluation to see performance metrics",
          ],
        };

        switch (config.subType) {
          case "logistic_regression":
            return {
              ...baseInfo,
              description: "Binary classification using logistic function.",
              explanation: [
                "**Best for**: Yes/No predictions (e.g., spam/not spam, pass/fail)",
                "**Task Type**: Classification",
                "**Advantages**: Fast, interpretable, works well with linearly separable data",
                "**When to use**: Simple classification problems, need probability scores",
              ],
              tip: "💡 Select a categorical target column with 2-3 classes for best results.",
            };

          case "decision_tree":
            return {
              ...baseInfo,
              description: "Tree-based model using if-then rules.",
              explanation: [
                "**Best for**: Both classification and regression",
                "**Task Type**: Classification or Regression",
                "**Advantages**: Easy to understand, handles non-linear data, no scaling needed",
                "**When to use**: Need interpretable model, data has complex patterns",
              ],
              tip: "💡 Can handle both numeric and categorical features without preprocessing.",
            };

          case "random_forest":
            return {
              ...baseInfo,
              description: "Ensemble of decision trees for better accuracy.",
              explanation: [
                "**Best for**: Complex datasets with many features",
                "**Task Type**: Classification or Regression",
                "**Advantages**: Very accurate, handles overfitting, works with missing data",
                "**When to use**: Need high accuracy, have enough computing power",
              ],
              tip: "💡 Usually more accurate than single decision tree but slower to train.",
            };

          case "linear_regression":
            return {
              ...baseInfo,
              description:
                "Predict continuous numeric values using linear relationship.",
              explanation: [
                "**Best for**: Predicting numbers (e.g., price, temperature, sales)",
                "**Task Type**: Regression",
                "**Advantages**: Simple, fast, interpretable",
                "**When to use**: Linear relationship between features and target",
              ],
              tip: "💡 Select a numeric target column (e.g., price, age, score).",
            };

          default:
            return {
              ...baseInfo,
              description: "Choose a model type to see detailed information.",
              tip: "💡 Drag a specific model from the palette or select from dropdown.",
            };
        }
      }

      case "evaluation":
        return {
          title: "📊 Model Evaluation",
          description:
            "Analyze your model's performance with metrics and visualizations.",
          explanation: [
            "**For Classification**: Accuracy, Precision, Recall, F1-Score, Confusion Matrix",
            "**For Regression**: MAE, MSE, RMSE, R² Score",
          ],
          tip: "💡 This is the final step. Results will show how well your model performs.",
        };

      default:
        return {
          title: "⚙️ Configuration",
          description: "Configure this node's settings.",
          tip: "💡 Fill in all required fields to proceed.",
        };
    }
  };

  const suggestion = getSuggestion();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-sm mb-1">
              {suggestion.title}
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              {suggestion.description}
            </p>
          </div>
        </div>

        {suggestion.explanation && (
          <div className="mb-3 space-y-1.5">
            {suggestion.explanation.map((item, idx) => (
              <p key={idx} className="text-xs text-blue-700 leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        )}

        {suggestion.methods && (
          <div className="mb-3 space-y-2">
            <p className="text-xs font-semibold text-blue-900">
              Available Methods:
            </p>
            {suggestion.methods.map((method, idx) => (
              <div
                key={idx}
                className="text-xs text-blue-700 leading-relaxed pl-2 border-l-2 border-blue-300"
              >
                {method}
              </div>
            ))}
          </div>
        )}

        {suggestion.nextSteps && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              Next Steps:
            </p>
            <ul className="space-y-1.5">
              {suggestion.nextSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-blue-700 flex items-start gap-2"
                >
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestion.tip && (
          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              {suggestion.tip}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function ConfigurationPanel({
  nodeId,
  onClose,
}: ConfigurationPanelProps) {
  const { getNodeById, updateNode, validateNode } = useWorkflowStore();
  const node = nodeId ? getNodeById(nodeId) : null;

  if (!node) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 border-l border-slate-200">
        <div className="text-center p-8">
          <Settings className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">
            Select a node to configure its settings
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const isValid = validateNode(node.id);
    if (isValid) {
      updateNode(node.id, { status: "configured" });
      onClose();
    } else {
      // Validation failed - errors are already shown in the UI
      alert("Please fix validation errors before saving.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚙️</div>
          <div>
            <h2 className="font-bold text-slate-900">Node Configuration</h2>
            <p className="text-xs text-slate-500 capitalize">{node.type}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Smart Suggestions */}
        <SuggestionBox node={node} />

        {/* Validation Errors */}
        {node.validationErrors.length > 0 && (
          <Alert variant="destructive" className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Validation Errors:</p>
              <ul className="list-disc list-inside text-xs mt-1">
                {node.validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          </Alert>
        )}

        {/* Node-specific configuration */}
        {node.type === "dataset" && (
          <DatasetConfig node={node as DatasetNodeConfig} />
        )}
        {node.type === "preprocessing" && (
          <PreprocessingConfig node={node as PreprocessingNodeConfig} />
        )}
        {node.type === "split" && (
          <SplitConfig node={node as SplitNodeConfig} />
        )}
        {node.type === "model" && (
          <ModelConfig node={node as ModelNodeConfig} />
        )}
        {node.type === "evaluation" && <EvaluationConfig />}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Dataset Configuration
// ============================================

function DatasetConfig({ node }: { node: DatasetNodeConfig }) {
  const { updateNode } = useWorkflowStore();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload file to backend
      const response = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      console.log("Upload response:", response);

      // Response is FileUploadResponse type with direct properties
      // Update node with file info and columns
      updateNode(node.id, {
        config: {
          ...node.config,
          fileName: response.fileName,
          fileId: response.fileId,
          columns: response.columns,
          rowCount: response.rowCount,
          columnCount: response.columnCount,
        },
      });

      console.log("Node updated with columns:", response.columns);
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-4">
      <Label className="mb-2 block">Upload Dataset</Label>

      {uploading ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Uploading... {uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <Input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Upload className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      )}

      {node.config.fileName && !uploading && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-green-900">
                📄 {node.config.fileName}
              </p>
              {node.config.rowCount && (
                <p className="text-xs text-green-700 mt-1">
                  {node.config.rowCount.toLocaleString()} rows ×{" "}
                  {node.config.columnCount} columns
                </p>
              )}
              {node.config.columns && node.config.columns.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-green-800 mb-1">
                    Columns detected:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {node.config.columns.slice(0, 5).map((col: any) => (
                      <span
                        key={col.name}
                        className="text-xs px-2 py-0.5 bg-white border border-green-300 rounded"
                      >
                        {col.name}
                      </span>
                    ))}
                    {node.config.columns.length > 5 && (
                      <span className="text-xs text-green-700">
                        +{node.config.columns.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// ============================================
// Preprocessing Configuration
// ============================================

function PreprocessingConfig({ node }: { node: PreprocessingNodeConfig }) {
  const { updateNode } = useWorkflowStore();

  const handleSubTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNode(node.id, {
      config: {
        ...node.config,
        subType: e.target.value as PreprocessingNodeConfig["config"]["subType"],
      },
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="mb-2 block">Preprocessing Type</Label>
        <Select
          value={node.config.subType || ""}
          onChange={handleSubTypeChange}
        >
          <option value="">Select type...</option>
          <option value="scaling">Feature Scaling</option>
          <option value="normalization">Normalization</option>
          <option value="encoding">Categorical Encoding</option>
          <option value="missing_values">Handle Missing Values</option>
          <option value="outlier_removal">Remove Outliers</option>
        </Select>
      </Card>

      {node.config.subType === "scaling" && (
        <Card className="p-4">
          <Label className="mb-2 block">Scaling Method</Label>
          <Select
            value={node.config.method || "standardize"}
            onChange={(e) =>
              updateNode(node.id, {
                config: {
                  ...node.config,
                  method: e.target
                    .value as PreprocessingNodeConfig["config"]["method"],
                },
              })
            }
          >
            <option value="standardize">Standardization (Z-score)</option>
            <option value="normalize">Normalization (0-1)</option>
            <option value="minmax">Min-Max Scaling</option>
            <option value="robust">Robust Scaling</option>
          </Select>
        </Card>
      )}

      {node.config.subType === "encoding" && (
        <Card className="p-4">
          <Label className="mb-2 block">Encoding Method</Label>
          <Select
            value={node.config.encodingMethod || "onehot"}
            onChange={(e) =>
              updateNode(node.id, {
                config: {
                  ...node.config,
                  encodingMethod: e.target
                    .value as PreprocessingNodeConfig["config"]["encodingMethod"],
                },
              })
            }
          >
            <option value="onehot">One-Hot Encoding</option>
            <option value="label">Label Encoding</option>
            <option value="ordinal">Ordinal Encoding</option>
          </Select>
        </Card>
      )}

      {node.config.subType === "missing_values" && (
        <Card className="p-4">
          <Label className="mb-2 block">Missing Value Strategy</Label>
          <Select
            value={node.config.missingStrategy || "mean"}
            onChange={(e) =>
              updateNode(node.id, {
                config: {
                  ...node.config,
                  missingStrategy: e.target
                    .value as PreprocessingNodeConfig["config"]["missingStrategy"],
                },
              })
            }
          >
            <option value="drop">Drop rows</option>
            <option value="mean">Fill with mean</option>
            <option value="median">Fill with median</option>
            <option value="mode">Fill with mode</option>
            <option value="constant">Fill with constant</option>
          </Select>
        </Card>
      )}
    </div>
  );
}

// ============================================
// Split Configuration
// ============================================

function SplitConfig({ node }: { node: SplitNodeConfig }) {
  const { updateNode } = useWorkflowStore();

  const handleTestSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) / 100;
    updateNode(node.id, {
      config: { ...node.config, testSize: value },
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="mb-2 block">
          Test Size: {Math.round(node.config.testSize * 100)}%
        </Label>
        <Input
          type="range"
          min="10"
          max="50"
          step="5"
          value={Math.round(node.config.testSize * 100)}
          onChange={handleTestSizeChange}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Train: {Math.round((1 - node.config.testSize) * 100)}%</span>
          <span>Test: {Math.round(node.config.testSize * 100)}%</span>
        </div>
      </Card>

      <Card className="p-4">
        <Label className="mb-2 block">Random State</Label>
        <Input
          type="number"
          value={node.config.randomState || 42}
          onChange={(e) =>
            updateNode(node.id, {
              config: {
                ...node.config,
                randomState: parseInt(e.target.value),
              },
            })
          }
        />
      </Card>

      <Card className="p-4">
        <Label className="flex items-center gap-2">
          <Input
            type="checkbox"
            checked={node.config.shuffle}
            onChange={(e) =>
              updateNode(node.id, {
                config: { ...node.config, shuffle: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
          Shuffle data before split
        </Label>
      </Card>
    </div>
  );
}

// ============================================
// Model Configuration
// ============================================

function ModelConfig({ node }: { node: ModelNodeConfig }) {
  const { updateNode, getUpstreamNodes } = useWorkflowStore();

  // Get available columns from upstream dataset
  const upstreamNodes = getUpstreamNodes(node.id);
  const datasetNode = upstreamNodes.find((n) => n.type === "dataset");
  const availableColumns = (datasetNode?.config as any)?.columns || [];

  // Debug logging
  console.log("ModelConfig Debug:", {
    nodeId: node.id,
    upstreamNodes: upstreamNodes.map((n) => ({ id: n.id, type: n.type })),
    datasetNode: datasetNode
      ? {
          id: datasetNode.id,
          type: datasetNode.type,
          config: datasetNode.config,
        }
      : null,
    availableColumns,
    columnsCount: availableColumns.length,
  });

  const handleFeatureToggle = (columnName: string) => {
    const currentFeatures = node.config.featureColumns || [];
    const newFeatures = currentFeatures.includes(columnName)
      ? currentFeatures.filter((f) => f !== columnName)
      : [...currentFeatures, columnName];

    updateNode(node.id, {
      config: { ...node.config, featureColumns: newFeatures },
    });
  };

  return (
    <div className="space-y-4">
      {node.config.subType && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {node.config.subType === "logistic_regression" && "🎲"}
              {node.config.subType === "decision_tree" && "🌳"}
              {node.config.subType === "random_forest" && "🌲"}
              {node.config.subType === "linear_regression" && "📈"}
            </span>
            <div>
              <p className="font-semibold text-sm text-blue-900 capitalize">
                {node.config.subType.replace("_", " ")}
              </p>
              <p className="text-xs text-blue-600">Model Type (Pre-selected)</p>
            </div>
          </div>
        </Card>
      )}

      {!node.config.subType && (
        <Card className="p-4">
          <Label className="mb-2 block">Model Type</Label>
          <Select
            value={node.config.subType || ""}
            onChange={(e) =>
              updateNode(node.id, {
                config: {
                  ...node.config,
                  subType: e.target
                    .value as ModelNodeConfig["config"]["subType"],
                },
              })
            }
          >
            <option value="">Select model...</option>
            <option value="logistic_regression">Logistic Regression</option>
            <option value="decision_tree">Decision Tree</option>
            <option value="random_forest">Random Forest</option>
            <option value="linear_regression">Linear Regression</option>
          </Select>
        </Card>
      )}

      <Card className="p-4">
        <Label className="mb-2 block">Task Type</Label>
        <Select
          value={node.config.taskType || ""}
          onChange={(e) =>
            updateNode(node.id, {
              config: {
                ...node.config,
                taskType: e.target.value as "classification" | "regression",
              },
            })
          }
        >
          <option value="">Select task...</option>
          <option value="classification">Classification</option>
          <option value="regression">Regression</option>
        </Select>
      </Card>

      <Card className="p-4">
        <Label className="mb-2 block">Target Column</Label>
        {availableColumns.length > 0 ? (
          <Select
            value={node.config.targetColumn || ""}
            onChange={(e) =>
              updateNode(node.id, {
                config: { ...node.config, targetColumn: e.target.value },
              })
            }
          >
            <option value="">Select target column...</option>
            {availableColumns.map((col: any) => (
              <option key={col.name} value={col.name}>
                {col.name} ({col.type})
              </option>
            ))}
          </Select>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Connect to dataset first"
              disabled
              className="bg-slate-100"
            />
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Connect this node to a dataset to see available columns
            </p>
          </>
        )}
      </Card>

      {availableColumns.length > 0 && (
        <Card className="p-4">
          <Label className="mb-2 block">Feature Columns</Label>
          <p className="text-xs text-slate-500 mb-3">
            Select columns to use as features for training
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableColumns.map((col: any) => (
              <Label
                key={col.name}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded"
              >
                <Input
                  type="checkbox"
                  checked={
                    node.config.featureColumns?.includes(col.name) || false
                  }
                  onChange={() => handleFeatureToggle(col.name)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {col.name}{" "}
                  <span className="text-slate-500">({col.type})</span>
                </span>
              </Label>
            ))}
          </div>
          {node.config.featureColumns &&
            node.config.featureColumns.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                ✓ {node.config.featureColumns.length} feature(s) selected
              </p>
            )}
        </Card>
      )}
    </div>
  );
}

// ============================================
// Evaluation Configuration
// ============================================

function EvaluationConfig() {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-600">
        This node will automatically evaluate the connected model and display
        performance metrics.
      </p>
    </Card>
  );
}

import React, { useState } from "react";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type {
  ModelConfig,
  ModelType,
  TaskType,
  ColumnInfo,
  HyperparameterConfig,
} from "@/types/pipeline.types";

interface ModelSelectorProps {
  columns: ColumnInfo[];
  taskType: TaskType;
  onTrain: (config: ModelConfig) => void;
  isLoading?: boolean;
}

// Model metadata
const MODELS: Record<
  TaskType,
  Array<{ type: ModelType; name: string; description: string }>
> = {
  classification: [
    {
      type: "logistic_regression",
      name: "Logistic Regression",
      description: "Simple, fast, interpretable",
    },
    {
      type: "decision_tree",
      name: "Decision Tree",
      description: "Intuitive, handles non-linear data",
    },
    {
      type: "random_forest",
      name: "Random Forest",
      description: "Ensemble method, robust",
    },
    {
      type: "gradient_boosting",
      name: "Gradient Boosting",
      description: "High accuracy, powerful",
    },
    {
      type: "svm",
      name: "Support Vector Machine",
      description: "Effective in high dimensions",
    },
    {
      type: "knn",
      name: "K-Nearest Neighbors",
      description: "Instance-based learning",
    },
    {
      type: "naive_bayes",
      name: "Naive Bayes",
      description: "Fast, works well with small data",
    },
    {
      type: "neural_network",
      name: "Neural Network",
      description: "Deep learning, complex patterns",
    },
  ],
  regression: [
    {
      type: "linear_regression",
      name: "Linear Regression",
      description: "Simple, interpretable",
    },
    {
      type: "ridge",
      name: "Ridge Regression",
      description: "Regularized, prevents overfitting",
    },
    {
      type: "lasso",
      name: "Lasso Regression",
      description: "Feature selection, sparse models",
    },
    {
      type: "elasticnet",
      name: "ElasticNet",
      description: "Combines Ridge and Lasso",
    },
    {
      type: "decision_tree",
      name: "Decision Tree",
      description: "Non-linear relationships",
    },
    {
      type: "random_forest",
      name: "Random Forest",
      description: "Ensemble, robust",
    },
    {
      type: "gradient_boosting",
      name: "Gradient Boosting",
      description: "High accuracy",
    },
    {
      type: "svm",
      name: "Support Vector Regression",
      description: "Effective with kernels",
    },
  ],
};

// Hyperparameters for each model
const HYPERPARAMETERS: Record<ModelType, HyperparameterConfig[]> = {
  logistic_regression: [
    {
      name: "C",
      type: "number",
      value: 1.0,
      min: 0.01,
      max: 10,
      step: 0.1,
      description: "Inverse regularization strength",
    },
    {
      name: "max_iter",
      type: "number",
      value: 100,
      min: 50,
      max: 1000,
      step: 50,
      description: "Maximum iterations",
    },
  ],
  decision_tree: [
    {
      name: "max_depth",
      type: "number",
      value: 10,
      min: 1,
      max: 50,
      step: 1,
      description: "Maximum tree depth",
    },
    {
      name: "min_samples_split",
      type: "number",
      value: 2,
      min: 2,
      max: 20,
      step: 1,
      description: "Minimum samples to split",
    },
  ],
  random_forest: [
    {
      name: "n_estimators",
      type: "number",
      value: 100,
      min: 10,
      max: 500,
      step: 10,
      description: "Number of trees",
    },
    {
      name: "max_depth",
      type: "number",
      value: 10,
      min: 1,
      max: 50,
      step: 1,
      description: "Maximum tree depth",
    },
  ],
  gradient_boosting: [
    {
      name: "n_estimators",
      type: "number",
      value: 100,
      min: 10,
      max: 500,
      step: 10,
      description: "Number of boosting stages",
    },
    {
      name: "learning_rate",
      type: "number",
      value: 0.1,
      min: 0.01,
      max: 1,
      step: 0.01,
      description: "Learning rate",
    },
  ],
  svm: [
    {
      name: "C",
      type: "number",
      value: 1.0,
      min: 0.1,
      max: 10,
      step: 0.1,
      description: "Regularization parameter",
    },
    {
      name: "kernel",
      type: "select",
      value: "rbf",
      options: ["linear", "poly", "rbf", "sigmoid"],
      description: "Kernel type",
    },
  ],
  knn: [
    {
      name: "n_neighbors",
      type: "number",
      value: 5,
      min: 1,
      max: 20,
      step: 1,
      description: "Number of neighbors",
    },
    {
      name: "weights",
      type: "select",
      value: "uniform",
      options: ["uniform", "distance"],
      description: "Weight function",
    },
  ],
  naive_bayes: [],
  neural_network: [
    {
      name: "hidden_layer_sizes",
      type: "number",
      value: 100,
      min: 10,
      max: 500,
      step: 10,
      description: "Neurons in hidden layer",
    },
    {
      name: "learning_rate_init",
      type: "number",
      value: 0.001,
      min: 0.0001,
      max: 0.1,
      step: 0.0001,
      description: "Initial learning rate",
    },
  ],
  linear_regression: [],
  ridge: [
    {
      name: "alpha",
      type: "number",
      value: 1.0,
      min: 0.01,
      max: 10,
      step: 0.1,
      description: "Regularization strength",
    },
  ],
  lasso: [
    {
      name: "alpha",
      type: "number",
      value: 1.0,
      min: 0.01,
      max: 10,
      step: 0.1,
      description: "Regularization strength",
    },
  ],
  elasticnet: [
    {
      name: "alpha",
      type: "number",
      value: 1.0,
      min: 0.01,
      max: 10,
      step: 0.1,
      description: "Regularization strength",
    },
    {
      name: "l1_ratio",
      type: "number",
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
      description: "L1 vs L2 mix",
    },
  ],
};

export function ModelSelector({
  columns,
  taskType,
  onTrain,
  isLoading,
}: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<ModelType>(
    MODELS[taskType][0].type
  );
  const [targetColumn, setTargetColumn] = useState("");
  const [featureColumns, setFeatureColumns] = useState<string[]>([]);
  const [hyperparameters, setHyperparameters] = useState<
    Record<string, unknown>
  >({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const models = MODELS[taskType];
  const selectedModelInfo = models.find((m) => m.type === selectedModel);
  const modelHyperparams = HYPERPARAMETERS[selectedModel] || [];

  const handleModelChange = (modelType: ModelType) => {
    setSelectedModel(modelType);
    // Reset hyperparameters to defaults
    const defaults: Record<string, unknown> = {};
    HYPERPARAMETERS[modelType]?.forEach((param) => {
      defaults[param.name] = param.value;
    });
    setHyperparameters(defaults);
  };

  const handleTrain = () => {
    const config: ModelConfig = {
      modelType: selectedModel,
      taskType,
      targetColumn,
      featureColumns:
        featureColumns.length > 0
          ? featureColumns
          : columns.map((c) => c.name).filter((c) => c !== targetColumn),
      hyperparameters:
        Object.keys(hyperparameters).length > 0 ? hyperparameters : undefined,
    };

    onTrain(config);
  };

  const toggleFeatureColumn = (columnName: string) => {
    setFeatureColumns((prev) =>
      prev.includes(columnName)
        ? prev.filter((c) => c !== columnName)
        : [...prev, columnName]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Model Selection & Training
        </CardTitle>
        <CardDescription>
          Choose and configure your machine learning model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model-type">Model Type</Label>
          <Select
            id="model-type"
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value as ModelType)}
          >
            {models.map((model) => (
              <option key={model.type} value={model.type}>
                {model.name}
              </option>
            ))}
          </Select>
          {selectedModelInfo && (
            <p className="text-sm text-slate-500">
              {selectedModelInfo.description}
            </p>
          )}
        </div>

        {/* Target Column */}
        <div className="space-y-2">
          <Label htmlFor="target-column">Target Column</Label>
          <Select
            id="target-column"
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
          >
            <option value="">Select target column</option>
            {columns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name} ({col.type})
              </option>
            ))}
          </Select>
          <p className="text-sm text-slate-500">
            The column you want to predict
          </p>
        </div>

        {/* Feature Selection */}
        <div className="space-y-2">
          <Label>Feature Columns (optional)</Label>
          <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
            {columns
              .filter((col) => col.name !== targetColumn)
              .map((col) => (
                <div
                  key={col.name}
                  className="flex items-center space-x-2 py-1"
                >
                  <input
                    type="checkbox"
                    id={`feature-${col.name}`}
                    checked={featureColumns.includes(col.name)}
                    onChange={() => toggleFeatureColumn(col.name)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <Label
                    htmlFor={`feature-${col.name}`}
                    className="cursor-pointer flex-1"
                  >
                    {col.name}{" "}
                    <span className="text-slate-500">({col.type})</span>
                  </Label>
                </div>
              ))}
          </div>
          <p className="text-sm text-slate-500">
            {featureColumns.length === 0
              ? "All columns except target will be used"
              : `${featureColumns.length} column(s) selected`}
          </p>
        </div>

        {/* Advanced Hyperparameters */}
        {modelHyperparams.length > 0 && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>Advanced Hyperparameters</span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                {modelHyperparams.map((param) => (
                  <div key={param.name} className="space-y-2">
                    <Label htmlFor={param.name}>{param.name}</Label>
                    {param.type === "select" ? (
                      <Select
                        id={param.name}
                        value={String(
                          hyperparameters[param.name] || param.value
                        )}
                        onChange={(e) =>
                          setHyperparameters({
                            ...hyperparameters,
                            [param.name]: e.target.value,
                          })
                        }
                      >
                        {param.options?.map((opt) => (
                          <option key={String(opt)} value={String(opt)}>
                            {String(opt)}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        id={param.name}
                        type="number"
                        value={Number(
                          hyperparameters[param.name] || param.value
                        )}
                        onChange={(e) =>
                          setHyperparameters({
                            ...hyperparameters,
                            [param.name]: Number(e.target.value),
                          })
                        }
                        min={param.min}
                        max={param.max}
                        step={param.step}
                      />
                    )}
                    <p className="text-xs text-slate-500">
                      {param.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleTrain}
          disabled={isLoading || !targetColumn}
          className="w-full"
        >
          {isLoading ? "Training Model..." : "Train Model"}
        </Button>
      </CardContent>
    </Card>
  );
}

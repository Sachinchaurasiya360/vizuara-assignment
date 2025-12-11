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

// Model metadata - focusing on core models with student-friendly descriptions
const MODELS: Record<
  TaskType,
  Array<{ type: ModelType; name: string; description: string; icon: string }>
> = {
  classification: [
    {
      type: "logistic_regression",
      name: "Logistic Regression",
      description:
        "Good for simple yes/no predictions. Like predicting if a student will pass based on study hours. Fast and easy to understand!",
      icon: "📊",
    },
    {
      type: "decision_tree",
      name: "Decision Tree Classifier",
      description:
        "Works like a flowchart with questions! Can handle complex patterns. Like deciding if you should carry an umbrella based on weather, season, and forecast.",
      icon: "🌳",
    },
  ],
  regression: [
    {
      type: "linear_regression",
      name: "Linear Regression",
      description:
        "Finds straight-line relationships. Like predicting marks based on study hours - more study = more marks! Simple but powerful.",
      icon: "📈",
    },
    {
      type: "decision_tree",
      name: "Decision Tree Regressor",
      description:
        "Like a decision flowchart for numbers. Can predict house prices based on size, location, and age using tree-like decisions.",
      icon: "🌳",
    },
  ],
};

// Hyperparameters for each model
const HYPERPARAMETERS: Partial<Record<ModelType, HyperparameterConfig[]>> = {
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
  linear_regression: [],
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
    // Frontend validation before sending to backend
    if (!targetColumn) {
      alert("⚠️ Please select a target column before training.");
      return;
    }

    // Check target column characteristics
    const targetColData = columns.find((c) => c.name === targetColumn);
    if (targetColData) {
      const uniqueValues = targetColData.uniqueCount || 0;

      // Validate task type matches data characteristics
      if (taskType === "classification" && uniqueValues > 10) {
        const confirmMsg = `⚠️ Warning: The target column "${targetColumn}" has ${uniqueValues} unique values.\n\nThis looks like it might be better suited for REGRESSION, not classification.\n\n✓ Classification: Use for categorical data with 2-10 classes (e.g., Yes/No, Pass/Fail)\n✓ Regression: Use for continuous numeric values (e.g., prices, scores, temperatures)\n\nDo you want to continue with classification anyway?`;

        if (!window.confirm(confirmMsg)) {
          return;
        }
      }

      if (taskType === "regression" && uniqueValues <= 2) {
        const confirmMsg = `⚠️ Warning: The target column "${targetColumn}" has only ${uniqueValues} unique value(s).\n\nThis looks like it might be better suited for CLASSIFICATION, not regression.\n\nDo you want to continue with regression anyway?`;

        if (!window.confirm(confirmMsg)) {
          return;
        }
      }
    }

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
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Choose Model (select one)
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {models.map((model) => (
              <div
                key={model.type}
                onClick={() => handleModelChange(model.type)}
                className={`
                  group relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-300
                  ${
                    selectedModel === model.type
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-[1.01]"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  {/* Radio button */}
                  <div className="flex items-center pt-1">
                    <input
                      type="radio"
                      name="model-selection"
                      checked={selectedModel === model.type}
                      onChange={() => handleModelChange(model.type)}
                      className="w-5 h-5 text-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Model icon */}
                  <div className="text-4xl">{model.icon}</div>

                  {/* Model details */}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-1 ${
                        selectedModel === model.type
                          ? "text-blue-700"
                          : "text-gray-800"
                      }`}
                    >
                      {model.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {selectedModel === model.type && (
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Column */}
        <div className="space-y-2">
          <Label htmlFor="target-column" className="flex items-center gap-2">
            Target Column
            <span className="text-xs text-slate-500 font-normal">
              (What you want to predict)
            </span>
          </Label>
          <Select
            id="target-column"
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
            className="border-2"
          >
            <option value="">Select the column to predict...</option>
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

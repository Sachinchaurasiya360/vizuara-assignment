import React, { useMemo } from "react";
import {
  Download,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { usePipelineStore } from "@/store/usePipelineStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PipelineNarration } from "@/components/pipeline/PipelineNarration";
import { generatePipelineNarration } from "@/services/pipelineNarrator";

export function ResultsStep() {
  const {
    results,
    modelConfig,
    preprocessingConfig,
    splitConfig,
    resetPipeline,
  } = usePipelineStore();

  // Generate narration only when results are available (memoized for performance)
  const narration = useMemo(() => {
    if (!results) return "";

    try {
      return generatePipelineNarration({
        preprocessingConfig,
        splitConfig,
        modelConfig,
        results,
      });
    } catch (error) {
      // Gracefully handle any errors in narration generation
      console.error("Failed to generate pipeline narration:", error);
      return "";
    }
  }, [results, preprocessingConfig, splitConfig, modelConfig]);

  if (!results || !modelConfig) {
    return (
      <Alert variant="destructive">
        No results available. Please train a model first.
      </Alert>
    );
  }

  const handleExport = () => {
    const exportData = {
      model: modelConfig.modelType,
      taskType: modelConfig.taskType,
      metrics: results.testMetrics,
      trainingTime: results.trainingTime,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `model-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to start a new pipeline? This will clear all current data."
      )
    ) {
      resetPipeline();
    }
  };

  // Get primary metric based on task type
  const getPrimaryMetric = () => {
    if (modelConfig.taskType === "classification") {
      return {
        label: "Accuracy",
        value: results.testMetrics?.accuracy || 0,
        format: (val: number) => `${(Number(val) * 100).toFixed(2)}%`,
      };
    } else {
      return {
        label: "R² Score",
        value: results.testMetrics?.r2Score || 0,
        format: (val: number) => Number(val).toFixed(4),
      };
    }
  };

  const primaryMetric = getPrimaryMetric();

  // Prepare feature importance data for chart
  const featureImportanceData =
    results.featureImportance
      ?.sort((a, b) => b.importance - a.importance)
      .slice(0, 10)
      .map((item) => ({
        feature:
          item.feature.length > 15
            ? item.feature.substring(0, 12) + "..."
            : item.feature,
        importance: item.importance,
        fullName: item.feature,
      })) || [];

  return (
    <div className="space-y-6">
      {/* Beginner-friendly results explanation */}
      <div className=" border border-indigo-200 rounded-lg p-5">
        <h4 className="font-semibold text-indigo-900 mb-2 text-lg flex items-center gap-2">
          🎉 Step 5: Understanding Your Results
        </h4>
        <p className="text-sm text-indigo-800 mb-3 leading-relaxed">
          <strong>Congratulations!</strong> Your AI model has finished learning!
          Now let's see how well it performed.
        </p>
        <div className="bg-white/50 rounded-lg p-3 space-y-2">
          <p className="text-xs text-indigo-900">
            <strong>💡 What do these metrics mean?</strong>
          </p>
          {modelConfig.taskType === "classification" ? (
            <ul className="text-xs text-indigo-800 space-y-1 ml-4">
              <li>
                • <strong>Accuracy:</strong> Out of 100 predictions, how many
                were correct? Higher is better! (90% = 90 correct out of 100)
              </li>
              <li>
                • <strong>Precision:</strong> When the model says "Yes", how
                often is it right? (High precision = fewer false alarms)
              </li>
              <li>
                • <strong>Recall:</strong> Out of all actual "Yes" cases, how
                many did the model catch? (High recall = finds most cases)
              </li>
              <li>
                • <strong>F1 Score:</strong> A balanced measure combining
                Precision and Recall (like your overall grade)
              </li>
            </ul>
          ) : (
            <ul className="text-xs text-indigo-800 space-y-1 ml-4">
              <li>
                • <strong>R² Score:</strong> How well the model fits the data
                (1.0 = perfect, 0.0 = poor). Like correlation in math!
              </li>
              <li>
                • <strong>RMSE:</strong> Average error in predictions (Lower is
                better - smaller mistakes)
              </li>
              <li>
                • <strong>MAE:</strong> Average absolute error (Like average
                difference between predicted and actual)
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Pipeline Narration - Human-Readable Summary */}
      {narration && <PipelineNarration narration={narration} />}

      {/* Header with Status */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Training Complete!
              </h2>
              <p className="text-slate-600">
                {modelConfig.modelType
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New Pipeline
          </Button>
        </div>
      </div>

      {/* Execution Status */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            Model Execution Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="text-lg font-semibold text-green-600">✓ Success</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Training Time</p>
              <p className="text-lg font-semibold">{results.trainingTime}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Train Samples</p>
              <p className="text-lg font-semibold">
                {results.modelInfo?.trainSamples || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Test Samples</p>
              <p className="text-lg font-semibold">
                {results.modelInfo?.testSamples || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Model performance on test dataset</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Primary Metric Highlight */}
          <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">
                {primaryMetric.label}
              </p>
              <p className="text-4xl font-bold text-blue-600">
                {primaryMetric.format(primaryMetric.value)}
              </p>
            </div>
          </div>

          {/* All Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modelConfig.taskType === "classification" ? (
              <>
                {results.testMetrics?.accuracy !== undefined && (
                  <MetricBox
                    label="Accuracy"
                    value={
                      (Number(results.testMetrics.accuracy) * 100).toFixed(2) +
                      "%"
                    }
                    color="blue"
                  />
                )}
                {results.testMetrics?.precision !== undefined && (
                  <MetricBox
                    label="Precision"
                    value={
                      (Number(results.testMetrics.precision) * 100).toFixed(2) +
                      "%"
                    }
                    color="green"
                  />
                )}
                {results.testMetrics?.recall !== undefined && (
                  <MetricBox
                    label="Recall"
                    value={
                      (Number(results.testMetrics.recall) * 100).toFixed(2) +
                      "%"
                    }
                    color="purple"
                  />
                )}
                {results.testMetrics?.f1Score !== undefined && (
                  <MetricBox
                    label="F1 Score"
                    value={
                      (Number(results.testMetrics.f1Score) * 100).toFixed(2) +
                      "%"
                    }
                    color="orange"
                  />
                )}
              </>
            ) : (
              <>
                {results.testMetrics?.r2Score !== undefined && (
                  <MetricBox
                    label="R² Score"
                    value={Number(results.testMetrics.r2Score).toFixed(4)}
                    color="blue"
                  />
                )}
                {results.testMetrics?.rmse !== undefined && (
                  <MetricBox
                    label="RMSE"
                    value={Number(results.testMetrics.rmse).toFixed(4)}
                    color="red"
                  />
                )}
                {results.testMetrics?.mae !== undefined && (
                  <MetricBox
                    label="MAE"
                    value={Number(results.testMetrics.mae).toFixed(4)}
                    color="orange"
                  />
                )}
                {results.testMetrics?.mse !== undefined && (
                  <MetricBox
                    label="MSE"
                    value={Number(results.testMetrics.mse).toFixed(4)}
                    color="purple"
                  />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance Visualization */}
      {featureImportanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Feature Importance
            </CardTitle>
            <CardDescription>
              Top features contributing to model predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis
                  dataKey="feature"
                  type="category"
                  width={100}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => Number(value).toFixed(4)}
                  labelFormatter={(label) => {
                    const item = featureImportanceData.find(
                      (d) => d.feature === label
                    );
                    return item?.fullName || label;
                  }}
                />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                  {featureImportanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${220 - index * 20}, 70%, 50%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Predictions Sample */}
      {results.predictionsSample && results.predictionsSample.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Predictions</CardTitle>
            <CardDescription>First 10 predictions on test data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold text-slate-700">
                      Index
                    </th>
                    <th className="text-left p-2 font-semibold text-slate-700">
                      Actual
                    </th>
                    <th className="text-left p-2 font-semibold text-slate-700">
                      Predicted
                    </th>
                    <th className="text-left p-2 font-semibold text-slate-700">
                      Match
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.predictionsSample.slice(0, 10).map((pred, idx) => {
                    const isMatch =
                      String(pred.actual) === String(pred.predicted);
                    return (
                      <tr key={idx} className="border-b hover:bg-slate-50">
                        <td className="p-2 text-slate-600">{pred.index}</td>
                        <td className="p-2 font-medium">{pred.actual}</td>
                        <td className="p-2 font-medium">{pred.predicted}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              isMatch
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isMatch ? "✓" : "✗"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-slate-50">
              <p className="text-sm text-slate-600 mb-1">Target Column</p>
              <p className="text-lg font-semibold">
                {modelConfig.targetColumn}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <p className="text-sm text-slate-600 mb-1">Features Used</p>
              <p className="text-lg font-semibold">
                {modelConfig.featureColumns.length}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <p className="text-sm text-slate-600 mb-1">Task Type</p>
              <p className="text-lg font-semibold capitalize">
                {modelConfig.taskType}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-green-200 bg-green-50 text-green-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    red: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div
      className={`p-4 border rounded-lg ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <p className="text-xs font-medium mb-1 opacity-75">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

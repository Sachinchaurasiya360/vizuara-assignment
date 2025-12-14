import { useEffect, useState } from "react";
import {
  Trophy,
  TrendingUp,
  Target,
  Zap,
  AlertCircle,
  Download,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getComparisonResults } from "../api/evaluation.api";
import { useEvaluationStore } from "../store/evaluationStore";

export function ComparisonStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    evaluationId,
    models,
    comparisonResults,
    setComparisonResults,
    setCurrentStep,
  } = useEvaluationStore();

  useEffect(() => {
    if (evaluationId && !comparisonResults) {
      loadComparison();
    }
  }, [evaluationId]);

  const loadComparison = async () => {
    if (!evaluationId) return;

    setLoading(true);
    setError(null);

    try {
      const results = await getComparisonResults(evaluationId);
      setComparisonResults(results);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load comparison results"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!comparisonResults) return;

    const data = comparisonResults.models.map((model) => ({
      Model: model.modelName,
      Accuracy: model.metrics?.accuracy?.toFixed(4) || "N/A",
      Precision: model.metrics?.precision?.toFixed(4) || "N/A",
      Recall: model.metrics?.recall?.toFixed(4) || "N/A",
      F1Score: model.metrics?.f1Score?.toFixed(4) || "N/A",
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Comparing models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Comparison Failed
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setCurrentStep(2)} variant="outline">
                Back to Models
              </Button>
              <Button onClick={loadComparison}>Retry</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!comparisonResults) {
    return null;
  }

  const bestModel = comparisonResults.bestModel;
  const chartData = comparisonResults.models
    .filter((m) => m.metrics)
    .map((model) => ({
      name: model.modelName,
      Accuracy: Number((model.metrics!.accuracy * 100).toFixed(2)),
      Precision: Number((model.metrics!.precision * 100).toFixed(2)),
      Recall: Number((model.metrics!.recall * 100).toFixed(2)),
      "F1 Score": Number((model.metrics!.f1Score * 100).toFixed(2)),
    }));

  const radarData = comparisonResults.models
    .filter((m) => m.metrics)
    .map((model) => ({
      metric: model.modelName,
      accuracy: Number((model.metrics!.accuracy * 100).toFixed(2)),
      precision: Number((model.metrics!.precision * 100).toFixed(2)),
      recall: Number((model.metrics!.recall * 100).toFixed(2)),
      f1: Number((model.metrics!.f1Score * 100).toFixed(2)),
    }));

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Model Comparison Results
          </h2>
          <p className="text-gray-600">
            Comparing {comparisonResults.totalModels} models
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Best Model Card */}
      {bestModel && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">
                Best Performing Model: {bestModel.modelName}
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-yellow-700">Accuracy</p>
                  <p className="text-xl font-bold text-yellow-900">
                    {(bestModel.metrics!.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-yellow-700">Precision</p>
                  <p className="text-xl font-bold text-yellow-900">
                    {(bestModel.metrics!.precision * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-yellow-700">Recall</p>
                  <p className="text-xl font-bold text-yellow-900">
                    {(bestModel.metrics!.recall * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-yellow-700">F1 Score</p>
                  <p className="text-xl font-bold text-yellow-900">
                    {(bestModel.metrics!.f1Score * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Metrics Comparison Chart */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Metrics Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: "Percentage (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="Accuracy" fill="#3b82f6" />
            <Bar dataKey="Precision" fill="#10b981" />
            <Bar dataKey="Recall" fill="#f59e0b" />
            <Bar dataKey="F1 Score" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {comparisonResults.models.map((model, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900">
                {model.modelName}
              </h3>
              {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
            </div>

            {model.error ? (
              <div className="text-sm text-red-600">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {model.error}
              </div>
            ) : model.metrics ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Accuracy
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(model.metrics.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    Precision
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(model.metrics.precision * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Recall
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(model.metrics.recall * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">F1 Score</span>
                  <span className="font-semibold text-gray-900">
                    {(model.metrics.f1Score * 100).toFixed(2)}%
                  </span>
                </div>

                {model.metrics.confusionMatrix && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">
                      Confusion Matrix
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded">
                        <span className="text-green-700">TP: </span>
                        <span className="font-semibold">
                          {model.metrics.confusionMatrix.tp}
                        </span>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <span className="text-red-700">FN: </span>
                        <span className="font-semibold">
                          {model.metrics.confusionMatrix.fn}
                        </span>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <span className="text-red-700">FP: </span>
                        <span className="font-semibold">
                          {model.metrics.confusionMatrix.fp}
                        </span>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <span className="text-green-700">TN: </span>
                        <span className="font-semibold">
                          {model.metrics.confusionMatrix.tn}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentStep(2)}
          variant="outline"
          className="flex-1"
        >
          Add More Models
        </Button>
        <Button onClick={() => (window.location.href = "/")} className="flex-1">
          Start New Evaluation
        </Button>
      </div>
    </div>
  );
}

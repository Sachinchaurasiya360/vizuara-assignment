import React from 'react';
import { TrendingUp, Target, Award, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TrainingResponse, ModelMetrics, FeatureImportance } from '@/types/pipeline.types';

interface MetricsCardProps {
  results: TrainingResponse;
  taskType: 'classification' | 'regression';
}

export function MetricsCard({ results, taskType }: MetricsCardProps) {
  const { metrics, featureImportance, confusionMatrix } = results;

  const renderClassificationMetrics = (metrics: ModelMetrics) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.accuracy !== undefined && (
        <MetricItem
          icon={<Target className="h-5 w-5" />}
          label="Accuracy"
          value={metrics.accuracy}
          color="text-blue-600"
        />
      )}
      {metrics.precision !== undefined && (
        <MetricItem
          icon={<Award className="h-5 w-5" />}
          label="Precision"
          value={metrics.precision}
          color="text-green-600"
        />
      )}
      {metrics.recall !== undefined && (
        <MetricItem
          icon={<Activity className="h-5 w-5" />}
          label="Recall"
          value={metrics.recall}
          color="text-purple-600"
        />
      )}
      {metrics.f1Score !== undefined && (
        <MetricItem
          icon={<TrendingUp className="h-5 w-5" />}
          label="F1 Score"
          value={metrics.f1Score}
          color="text-orange-600"
        />
      )}
    </div>
  );

  const renderRegressionMetrics = (metrics: ModelMetrics) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.r2Score !== undefined && (
        <MetricItem
          icon={<Target className="h-5 w-5" />}
          label="R² Score"
          value={metrics.r2Score}
          color="text-blue-600"
        />
      )}
      {metrics.rmse !== undefined && (
        <MetricItem
          icon={<Activity className="h-5 w-5" />}
          label="RMSE"
          value={metrics.rmse}
          color="text-red-600"
          format={(val) => val.toFixed(4)}
        />
      )}
      {metrics.mae !== undefined && (
        <MetricItem
          icon={<TrendingUp className="h-5 w-5" />}
          label="MAE"
          value={metrics.mae}
          color="text-orange-600"
          format={(val) => val.toFixed(4)}
        />
      )}
      {metrics.mse !== undefined && (
        <MetricItem
          icon={<Award className="h-5 w-5" />}
          label="MSE"
          value={metrics.mse}
          color="text-purple-600"
          format={(val) => val.toFixed(4)}
        />
      )}
    </div>
  );

  const renderConfusionMatrix = (matrix: number[][]) => {
    const labels = matrix.map((_, idx) => `Class ${idx}`);
    
    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-4">Confusion Matrix</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-slate-50"></th>
                {labels.map((label, idx) => (
                  <th key={idx} className="border p-2 bg-slate-50 text-sm">
                    Predicted {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <th className="border p-2 bg-slate-50 text-sm">Actual {labels[i]}</th>
                  {row.map((value, j) => (
                    <td
                      key={j}
                      className={`border p-2 text-center font-medium ${
                        i === j ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFeatureImportance = (features: FeatureImportance[]) => {
    const data = features
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);

    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
      '#10b981', '#06b6d4', '#6366f1', '#f97316',
    ];

    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-4">Feature Importance (Top 10)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="feature" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance Metrics</CardTitle>
        <CardDescription>
          Training completed in {results.trainingTime.toFixed(2)}s
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Metrics */}
        {taskType === 'classification' 
          ? renderClassificationMetrics(metrics)
          : renderRegressionMetrics(metrics)
        }

        {/* Training vs Validation */}
        {metrics.trainingScore !== undefined && metrics.validationScore !== undefined && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Model Fit</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Training Score</p>
                <p className="text-2xl font-bold">{(metrics.trainingScore * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Validation Score</p>
                <p className="text-2xl font-bold">{(metrics.validationScore * 100).toFixed(2)}%</p>
              </div>
            </div>
            {Math.abs(metrics.trainingScore - metrics.validationScore) > 0.1 && (
              <p className="text-xs text-orange-600 mt-2">
                ⚠️ Large gap between training and validation scores may indicate overfitting
              </p>
            )}
          </div>
        )}

        {/* Confusion Matrix */}
        {confusionMatrix && taskType === 'classification' && renderConfusionMatrix(confusionMatrix)}

        {/* Feature Importance */}
        {featureImportance && featureImportance.length > 0 && renderFeatureImportance(featureImportance)}
      </CardContent>
    </Card>
  );
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  format?: (val: number) => string;
}

function MetricItem({ icon, label, value, color, format }: MetricItemProps) {
  const displayValue = format ? format(value) : `${(value * 100).toFixed(2)}%`;

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className={`flex items-center gap-2 ${color} mb-2`}>
        {icon}
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <p className="text-2xl font-bold">{displayValue}</p>
    </div>
  );
}

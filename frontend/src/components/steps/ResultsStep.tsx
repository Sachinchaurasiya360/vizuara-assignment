import React from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MetricsCard } from '@/components/pipeline/MetricsCard';
import { usePipelineStore } from '@/store/usePipelineStore';

export function ResultsStep() {
  const { results, modelConfig, resetPipeline } = usePipelineStore();

  if (!results || !modelConfig) {
    return <Alert variant="destructive">No results available. Please train a model first.</Alert>;
  }

  const handleExport = () => {
    // Export logic would go here
    console.log('Exporting results...');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to start a new pipeline? This will clear all current data.')) {
      resetPipeline();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Training Complete!</h2>
          <p className="text-slate-600">
            Model: {modelConfig.modelType.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New Pipeline
          </Button>
        </div>
      </div>

      <MetricsCard results={results} taskType={modelConfig.taskType} />

      {/* Model Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-slate-600">Target Column</p>
          <p className="text-lg font-semibold">{modelConfig.targetColumn}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-slate-600">Features Used</p>
          <p className="text-lg font-semibold">{modelConfig.featureColumns.length}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-slate-600">Training Time</p>
          <p className="text-lg font-semibold">{results.trainingTime.toFixed(2)}s</p>
        </div>
      </div>
    </div>
  );
}

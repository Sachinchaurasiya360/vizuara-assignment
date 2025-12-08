import React from 'react';
import { Workflow, ChevronRight } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Alert } from './components/ui/alert';
import { PipelineVisualization } from './components/pipeline/PipelineVisualization';
import { UploadStep } from './components/steps/UploadStep';
import { PreprocessStep } from './components/steps/PreprocessStep';
import { SplitStep } from './components/steps/SplitStep';
import { ModelStep } from './components/steps/ModelStep';
import { ResultsStep } from './components/steps/ResultsStep';
import { usePipelineStore } from './store/usePipelineStore';
import type { PipelineStepType } from './types/pipeline.types';
import './App.css';

const STEP_COMPONENTS: Record<PipelineStepType, React.ComponentType> = {
  upload: UploadStep,
  preprocess: PreprocessStep,
  split: SplitStep,
  model: ModelStep,
  results: ResultsStep,
};

const STEP_TITLES: Record<PipelineStepType, string> = {
  upload: 'Upload Dataset',
  preprocess: 'Preprocess Data',
  split: 'Train-Test Split',
  model: 'Train Model',
  results: 'View Results',
};

function App() {
  const { currentStep, error, setError } = usePipelineStore();
  const CurrentStepComponent = STEP_COMPONENTS[currentStep || 'upload'];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  ML Pipeline Builder
                </h1>
                <p className="text-sm text-slate-600">
                  No-code machine learning pipeline creation
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Pipeline Visualization */}
          <div className="mb-8">
            <PipelineVisualization />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert 
              variant="destructive" 
              title="Error" 
              className="mb-6"
            >
              <div className="flex justify-between items-start">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-900 hover:text-red-700 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </Alert>
          )}

          {/* Current Step */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold">
                {STEP_TITLES[currentStep || 'upload']}
              </h2>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            
            <CurrentStepComponent />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-slate-600">
              Built with React, TypeScript, TailwindCSS, and React Flow
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;

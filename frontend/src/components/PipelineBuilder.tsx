import React from "react";
import { useNavigate } from "react-router-dom";
import { Workflow, ChevronRight, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Alert } from "./ui/alert";
import { PipelineVisualization } from "./pipeline/PipelineVisualization";
import { UploadStep } from "./steps/UploadStep";
import { PreprocessStep } from "./steps/PreprocessStep";
import { SplitStep } from "./steps/SplitStep";
import { ModelStep } from "./steps/ModelStep";
import { ResultsStep } from "./steps/ResultsStep";
import { usePipelineStore } from "../store/usePipelineStore";
import type { PipelineStepType } from "../types/pipeline.types";

const STEP_COMPONENTS: Record<PipelineStepType, React.ComponentType> = {
  upload: UploadStep,
  preprocess: PreprocessStep,
  split: SplitStep,
  model: ModelStep,
  results: ResultsStep,
};

const STEP_TITLES: Record<PipelineStepType, string> = {
  upload: "Upload Dataset",
  preprocess: "Preprocess Data",
  split: "Train-Test Split",
  model: "Train Model",
  results: "View Results",
};

export function PipelineBuilder() {
  const navigate = useNavigate();
  const { currentStep, error, setError, resetPipeline } = usePipelineStore();
  const CurrentStepComponent = STEP_COMPONENTS[currentStep || "upload"];

  const handleBackToHome = () => {
    resetPipeline();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-xl shadow-md">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  ML Pipeline Builder
                </h1>
                <p className="text-sm text-slate-600">
                  No-code machine learning pipeline creation
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="gap-2 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pipeline Visualization */}
        <div className="mb-8 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <PipelineVisualization />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            title="Error"
            className="mb-6 animate-in slide-in-from-top-2"
          >
            <div className="flex justify-between items-start">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-900 hover:text-red-700 font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </Alert>
        )}

        {/* Current Step */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-black rounded-full" />
            <h2 className="text-2xl font-bold text-slate-900">
              {STEP_TITLES[currentStep || "upload"]}
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
  );
}

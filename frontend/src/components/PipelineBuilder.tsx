import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Workflow,
  Home,
  CheckCircle2,
  Circle,
  AlertCircle,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
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

const STEP_DESCRIPTIONS: Record<PipelineStepType, string> = {
  upload: "Upload your CSV dataset to begin the pipeline",
  preprocess: "Clean, transform, and prepare your data",
  split: "Configure how to split your data for training",
  model: "Select and train your machine learning model",
  results: "View performance metrics and insights",
};

const STEP_ORDER: PipelineStepType[] = [
  "upload",
  "preprocess",
  "split",
  "model",
  "results",
];

export function PipelineBuilder() {
  const navigate = useNavigate();
  const [showVisualization, setShowVisualization] = useState(true);
  const { currentStep, error, setError, resetPipeline, steps, goToStep } =
    usePipelineStore();
  const CurrentStepComponent = STEP_COMPONENTS[currentStep || "upload"];

  const handleBackToHome = () => {
    resetPipeline();
    navigate("/");
  };

  const getCurrentStepIndex = () => {
    return STEP_ORDER.indexOf(currentStep || "upload");
  };

  const getStepStatus = (stepType: PipelineStepType) => {
    const step = steps.find((s) => s.type === stepType);
    return step?.status || "pending";
  };

  const canNavigateToStep = (stepType: PipelineStepType) => {
    const step = steps.find((s) => s.type === stepType);
    return step && (step.status === "completed" || step.type === currentStep);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-black rounded-2xl blur-md opacity-20"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-black to-slate-800 rounded-2xl shadow-lg">
                  <Workflow className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-slate-700 bg-clip-text text-transparent">
                    ML Pipeline Builder
                  </h1>
                  <Sparkles className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Visual no-code machine learning workflow
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowVisualization(!showVisualization)}
                className="gap-2 hidden md:flex hover:bg-slate-50"
              >
                <LayoutGrid className="h-4 w-4" />
                {showVisualization ? "Hide" : "Show"} Flow
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="gap-2 hover:bg-slate-50 border-slate-300"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Step Navigator */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              {/* Progress Overview Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Progress</h3>
                  <span className="text-sm font-medium text-slate-500">
                    {getCurrentStepIndex() + 1} / {STEP_ORDER.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-gradient-to-r from-black to-slate-700 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((getCurrentStepIndex() + 1) / STEP_ORDER.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                <h3 className="font-bold text-slate-900 mb-4 px-2">
                  Pipeline Steps
                </h3>
                <nav className="space-y-1">
                  {STEP_ORDER.map((stepType, index) => {
                    const status = getStepStatus(stepType);
                    const isCurrent = currentStep === stepType;
                    const canNavigate = canNavigateToStep(stepType);

                    return (
                      <button
                        key={stepType}
                        onClick={() => canNavigate && goToStep(stepType)}
                        disabled={!canNavigate}
                        className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                          ${
                            isCurrent
                              ? "bg-black text-white shadow-lg shadow-black/20"
                              : canNavigate
                              ? "hover:bg-slate-50 text-slate-700"
                              : "opacity-40 cursor-not-allowed text-slate-400"
                          }
                        `}
                      >
                        <div className="flex-shrink-0">
                          {status === "completed" ? (
                            <CheckCircle2
                              className={`h-5 w-5 ${
                                isCurrent ? "text-white" : "text-green-600"
                              }`}
                            />
                          ) : status === "error" ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Circle
                              className={`h-5 w-5 ${
                                isCurrent ? "text-white" : "text-slate-300"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div
                            className={`text-sm font-semibold ${
                              isCurrent ? "text-white" : ""
                            }`}
                          >
                            {STEP_TITLES[stepType]}
                          </div>
                          <div
                            className={`text-xs mt-0.5 ${
                              isCurrent ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            Step {index + 1}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/60 p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-black/5 rounded-lg">
                    <Sparkles className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {STEP_TITLES[currentStep || "upload"]}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {STEP_DESCRIPTIONS[currentStep || "upload"]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Pipeline Visualization */}
            {showVisualization && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200/60 overflow-hidden animate-fade-in">
                <div className="border-b border-slate-200/60 px-6 py-4 bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5" />
                    Pipeline Visualization
                  </h2>
                </div>
                <PipelineVisualization />
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                title="Error Occurred"
                className="animate-in slide-in-from-top-2 border-red-200 shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span>{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-900 hover:text-red-700 font-semibold transition-colors text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </Alert>
            )}

            {/* Current Step Content */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200/60 overflow-hidden animate-fade-in">
              <div className="border-b border-slate-200/60 px-8 py-6 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-1.5 bg-gradient-to-b from-black to-slate-600 rounded-full" />
                      <h2 className="text-3xl font-bold text-slate-900">
                        {STEP_TITLES[currentStep || "upload"]}
                      </h2>
                    </div>
                    <p className="text-slate-600 ml-6">
                      {STEP_DESCRIPTIONS[currentStep || "upload"]}
                    </p>
                  </div>
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-slate-500">
                      Current Step
                    </div>
                    <div className="text-2xl font-bold text-black">
                      {getCurrentStepIndex() + 1}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <CurrentStepComponent />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200/60 mt-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-600">
                Built with React, TypeScript, TailwindCSS, and React Flow
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate("/about")}
                className="text-sm text-slate-600 hover:text-black transition-colors font-medium"
              >
                About Developer
              </button>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="text-xs text-slate-500">
                © 2025 ML Pipeline Builder
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

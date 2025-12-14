import { useEffect } from "react";
import { useEvaluationStore } from "../store/evaluationStore";
import { GroundTruthStep } from "../components/GroundTruthStep";
import { PredictionStep } from "../components/PredictionStep";
import { ComparisonStep } from "../components/ComparisonStep";

export function ModelEvaluationPage() {
  const { currentStep, error, clearError, reset } = useEvaluationStore();

  useEffect(() => {
    // Reset on mount
    reset();
  }, [reset]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GroundTruthStep />;
      case 2:
        return <PredictionStep />;
      case 3:
        return <ComparisonStep />;
      default:
        return <GroundTruthStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-black rounded-2xl blur-md opacity-20"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-black to-slate-800 rounded-2xl shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-slate-700 bg-clip-text text-transparent">
                Model Evaluation Tool
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Compare pre-trained models without training
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
        {/* Sample Data Download Card */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-xl">📦</span>
                Need Sample Data?
              </h4>
              <p className="text-sm text-purple-800">
                Download sample datasets to test the evaluation tool
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/sample-data/evaluation-ground-truth.csv"
                download="ground-truth-sample.csv"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Ground Truth
              </a>
              <a
                href="/sample-data/evaluation-model-predictions.csv"
                download="model-predictions-sample.csv"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Predictions
              </a>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Progress</h3>
            <span className="text-sm font-medium text-slate-500">
              Step {currentStep} / 3
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
            <div
              className="bg-gradient-to-r from-black to-slate-700 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { num: 1, label: "Ground Truth", icon: "📊" },
              { num: 2, label: "Predictions", icon: "🎯" },
              { num: 3, label: "Compare", icon: "📈" },
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  currentStep === step.num
                    ? "bg-black text-white shadow-lg shadow-black/20"
                    : currentStep > step.num
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-slate-50 text-slate-400 border border-slate-200"
                }`}
              >
                <div className="text-2xl">{step.icon}</div>
                <div>
                  <div className="text-xs font-semibold">Step {step.num}</div>
                  <div className="text-sm font-medium">{step.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 text-2xl">⚠️</div>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div>{renderStep()}</div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import { Brain } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ModelSelector } from "@/components/pipeline/ModelSelector";
import { usePipelineStore } from "@/store/usePipelineStore";
import { trainModel } from "@/api/pipeline.api";
import type { ModelConfig, TaskType } from "@/types/pipeline.types";

export function ModelStep() {
  const {
    uploadedFile,
    splitConfig,
    results,
    setModelConfig,
    setResults,
    setLoading,
    setCurrentStep,
    setError,
  } = usePipelineStore();
  const [isTraining, setIsTraining] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>("regression");

  if (!uploadedFile || !splitConfig) {
    return (
      <Alert variant="destructive">Please complete previous steps first</Alert>
    );
  }

  const handleTrain = async (config: ModelConfig) => {
    setIsTraining(true);
    setLoading(true);
    setError(null);

    try {
      const response = await trainModel(uploadedFile.fileId, config);
      setModelConfig(config);
      setResults(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to train model";
      console.error("Training error:", errorMessage);
      setError(errorMessage);

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsTraining(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Beginner-friendly explanation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-5">
        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5" />
          🤖 Step 4: Choose Your AI Brain!
        </h4>
        <p className="text-sm text-green-900 mb-3 leading-relaxed">
          <strong>What is a Model?</strong> It's like choosing which type of
          brain to use. Different problems need different thinking styles. Let's
          pick the right one for your task!
        </p>
        <div className="bg-white/50 rounded-lg p-3 mb-3 space-y-3">
          <div>
            <p className="text-sm text-green-900 font-semibold mb-1">
              📂 Classification (Sorting into Categories):
            </p>
            <p className="text-xs text-green-800 ml-4 mb-1">
              Use when you want to put things into groups or categories.
            </p>
            <p className="text-xs text-green-700 ml-4 italic">
              🎯 <strong>Examples:</strong> Is this email spam or not spam? Will
              a student pass or fail? Is this a cat or dog photo? Will it rain
              or not rain tomorrow?
            </p>
          </div>
          <div>
            <p className="text-sm text-green-900 font-semibold mb-1">
              📈 Regression (Predicting Numbers):
            </p>
            <p className="text-xs text-green-800 ml-4 mb-1">
              Use when you want to predict a specific number or value.
            </p>
            <p className="text-xs text-green-700 ml-4 italic">
              🎯 <strong>Examples:</strong> What will be the house price? How
              many marks will I score? What's tomorrow's temperature? How tall
              will a plant grow?
            </p>
          </div>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
          <p className="text-xs text-blue-900 font-semibold mb-1">
            💡 Quick Guide:
          </p>
          <p className="text-xs text-blue-800">
            • If your answer is <strong>YES/NO</strong> or{" "}
            <strong>CATEGORY</strong> → Choose Classification
            <br />• If your answer is a <strong>NUMBER</strong> → Choose
            Regression
          </p>
        </div>
      </div>

      {/* Task Type Selection */}
      <div className="max-w-md">
        <Label htmlFor="task-type">Task Type</Label>
        <Select
          id="task-type"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as TaskType)}
          className="mt-2"
        >
          <option value="classification">Classification</option>
          <option value="regression">Regression</option>
        </Select>
        <p className="text-sm text-slate-500 mt-2">
          {taskType === "classification"
            ? "Predict categorical outcomes (e.g., spam/not spam)"
            : "Predict continuous values (e.g., house prices)"}
        </p>
      </div>

      <ModelSelector
        columns={uploadedFile.columns}
        taskType={taskType}
        onTrain={handleTrain}
        isLoading={isTraining}
      />

      {isTraining && (
        <div className="flex justify-center p-12">
          <Loader
            size="lg"
            text="Training model... This may take a few moments"
          />
        </div>
      )}

      {/* Show success and Next Step button after training */}
      {results && !isTraining && (
        <div className="mt-6 space-y-4">
          <Alert
            variant="success"
            title="Training Complete!"
            className="border-green-300 bg-green-50"
          >
            Your model has been trained successfully. Click below to view the
            results and performance metrics.
          </Alert>
          <div className="flex justify-center">
            <button
              onClick={() => setCurrentStep("results")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-slate-800 font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              View Results & Metrics →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

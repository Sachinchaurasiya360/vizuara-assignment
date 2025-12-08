import React, { useState } from "react";
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
    setModelConfig,
    setResults,
    setLoading,
    setCurrentStep,
    setError,
  } = usePipelineStore();
  const [isTraining, setIsTraining] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>("classification");

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
      const response = await trainModel(
        uploadedFile.fileId,
        config,
        splitConfig
      );
      setModelConfig(config);
      setResults(response);

      setTimeout(() => {
        setCurrentStep("results");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to train model");
    } finally {
      setIsTraining(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Workflow,
  Play,
  RotateCcw,
  Home,
  Save,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { preprocessData, splitData, trainModel } from "@/api/pipeline.api";
import { ComponentPalette } from "../components/ComponentPalette";
import { WorkflowCanvas } from "../components/WorkflowCanvas";
import { ConfigurationPanel } from "../components/ConfigurationPanel";
import { useWorkflowStore } from "../store/workflowStore";

// ============================================
// Execution Results Panel
// ============================================

function ExecutionResults({
  plan,
  nodes,
  onClose,
  executionResults,
  executingStepIndex,
}: {
  plan: any;
  nodes: any[];
  onClose: () => void;
  executionResults: any;
  executingStepIndex: number;
}) {
  const isExecuting = executingStepIndex >= 0;
  const hasResults =
    executionResults && Object.keys(executionResults).length > 0;
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <h2 className="font-bold text-slate-900">Execution Plan</h2>
            <p className="text-xs text-slate-500">
              {plan.totalSteps} steps ready
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <AlertCircle className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status Message */}
        {isExecuting ? (
          <Alert className="bg-blue-50 border-blue-200 flex items-start gap-2">
            <div className="h-5 w-5 mt-0.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 text-sm">
                Executing Workflow...
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Running step {executingStepIndex + 1} of {plan.totalSteps}
              </p>
            </div>
          </Alert>
        ) : hasResults ? (
          <Alert className="bg-green-50 border-green-200 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 text-sm">
                Execution Complete!
              </p>
              <p className="text-xs text-green-700 mt-1">
                Workflow executed successfully. View results below.
              </p>
            </div>
          </Alert>
        ) : (
          <Alert className="bg-green-50 border-green-200 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 text-sm">
                Workflow Validated!
              </p>
              <p className="text-xs text-green-700 mt-1">
                Starting execution with {plan.totalSteps} steps...
              </p>
            </div>
          </Alert>
        )}

        {/* Execution Steps */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-slate-700">
            Execution Order:
          </h3>
          {plan.steps.map((step: any, index: number) => {
            const node = nodes.find((n) => n.id === step.nodeId);
            const stepResult = executionResults?.[step.nodeId];
            const isCurrentStep = index === executingStepIndex;
            const isCompleted = stepResult?.status === "success";
            const hasError = stepResult?.status === "error";

            return (
              <div
                key={step.nodeId}
                className={`border rounded-lg p-3 transition-all ${
                  isCurrentStep
                    ? "bg-blue-50 border-blue-300 shadow-md"
                    : isCompleted
                    ? "bg-green-50 border-green-200"
                    : hasError
                    ? "bg-red-50 border-red-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrentStep
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : hasError
                        ? "bg-red-600 text-white"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    {isCurrentStep
                      ? "⏳"
                      : isCompleted
                      ? "✓"
                      : hasError
                      ? "✗"
                      : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {node?.type === "dataset" && "📊"}
                        {node?.type === "preprocessing" && "⚙️"}
                        {node?.type === "split" && "✂️"}
                        {node?.type === "model" && "🤖"}
                        {node?.type === "evaluation" && "📊"}
                      </span>
                      <span className="font-semibold text-sm text-slate-900 capitalize">
                        {node?.type || "Unknown"}
                      </span>
                      {isCurrentStep && (
                        <span className="text-xs text-blue-600 font-medium">
                          Running...
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-xs text-green-600 font-medium">
                          Complete
                        </span>
                      )}
                      {hasError && (
                        <span className="text-xs text-red-600 font-medium">
                          Failed
                        </span>
                      )}
                    </div>
                    {hasError && stepResult.error && (
                      <p className="text-xs text-red-700 mt-1 bg-red-100 p-2 rounded">
                        {stepResult.error}
                      </p>
                    )}

                    {/* Show results for completed steps */}
                    {isCompleted && stepResult.data && (
                      <div className="mt-2 space-y-2">
                        {/* Dataset results */}
                        {node?.type === "dataset" && stepResult.fileId && (
                          <div className="text-xs bg-white p-2 rounded border border-green-200">
                            <p className="font-semibold text-green-800 mb-1">
                              ✓ File uploaded
                            </p>
                            <p className="text-slate-600">
                              FileId: {stepResult.fileId.substring(0, 16)}...
                            </p>
                          </div>
                        )}

                        {/* Preprocessing results */}
                        {node?.type === "preprocessing" &&
                          stepResult.data.data && (
                            <div className="text-xs bg-white p-2 rounded border border-green-200">
                              <p className="font-semibold text-green-800 mb-1">
                                ✓ Data preprocessed
                              </p>
                              {stepResult.data.data.totalRows && (
                                <p className="text-slate-600">
                                  {stepResult.data.data.totalRows} rows
                                  processed
                                </p>
                              )}
                            </div>
                          )}

                        {/* Split results */}
                        {node?.type === "split" && stepResult.data.data && (
                          <div className="text-xs bg-white p-2 rounded border border-green-200">
                            <p className="font-semibold text-green-800 mb-1">
                              ✓ Data split complete
                            </p>
                            <div className="flex justify-between mt-1">
                              <span className="text-slate-600">Train:</span>
                              <span className="font-medium">
                                {stepResult.data.data.trainSize} samples
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Test:</span>
                              <span className="font-medium">
                                {stepResult.data.data.testSize} samples
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Model results with metrics */}
                        {node?.type === "model" && stepResult.data.data && (
                          <div className="text-xs bg-white p-3 rounded border border-green-200 space-y-2">
                            <p className="font-semibold text-green-800 mb-2">
                              🎯 Model Performance
                            </p>

                            {stepResult.data.data.testMetrics && (
                              <div className="space-y-1">
                                <p className="font-semibold text-slate-700 text-xs">
                                  Test Set Metrics:
                                </p>
                                {Object.entries(
                                  stepResult.data.data.testMetrics
                                )
                                  .filter(
                                    ([key]) =>
                                      !key.includes("confusion") &&
                                      !key.includes("Matrix")
                                  )
                                  .slice(0, 6)
                                  .map(([key, value]: any) => (
                                    <div
                                      key={key}
                                      className="flex justify-between"
                                    >
                                      <span className="text-slate-600 capitalize">
                                        {key.replace(/([A-Z])/g, " $1").trim()}:
                                      </span>
                                      <span className="font-medium">
                                        {typeof value === "number"
                                          ? value.toFixed(4)
                                          : value}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {stepResult.data.data.modelInfo && (
                              <div className="pt-2 border-t border-green-100">
                                <p className="text-slate-600">
                                  Model:{" "}
                                  {stepResult.data.data.modelInfo.type?.replace(
                                    /_/g,
                                    " "
                                  )}
                                </p>
                                <p className="text-slate-600">
                                  Training time:{" "}
                                  {stepResult.data.data.trainingTime}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 mt-1">
                      Node ID: {step.nodeId.substring(0, 8)}...
                    </p>
                    {step.dependencies.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        Depends on: {step.dependencies.length} node(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Steps Info */}
        {!hasResults && !isExecuting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">
              💡 Execution started...
            </h3>
            <ul className="space-y-2 text-xs text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Nodes will execute in the order shown above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>
                  Each step processes data and passes results to the next node
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Watch the progress indicators for real-time status</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <Button onClick={onClose} variant="outline" className="w-full gap-2">
          Close Results
        </Button>
      </div>
    </div>
  );
}

export function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [executionPlan, setExecutionPlan] = useState<any>(null);
  const [executionResults, setExecutionResults] = useState<any>(null);
  const [executingStepIndex, setExecutingStepIndex] = useState<number>(-1);

  const {
    nodes,
    edges,
    error,
    isExecuting,
    validateWorkflow,
    generateExecutionPlan,
    resetWorkflow,
    setError,
  } = useWorkflowStore();

  const handleExecute = async () => {
    setError(null);

    // Validate workflow
    if (!validateWorkflow()) {
      return;
    }

    // Generate execution plan
    const plan = generateExecutionPlan();
    if (!plan) {
      return;
    }

    // Show results panel with execution plan
    setExecutionPlan(plan);
    setShowResults(true);
    setSelectedNodeId(null); // Close config panel
    setExecutionResults({});
    setExecutingStepIndex(0);

    console.log("Execution Plan:", plan);

    // Execute workflow steps sequentially
    try {
      const results: any = {};
      let currentFileId = null;

      for (let i = 0; i < plan.steps.length; i++) {
        const step = plan.steps[i];
        const node = nodes.find((n) => n.id === step.nodeId);

        if (!node) continue;

        setExecutingStepIndex(i);
        console.log(`Executing step ${i + 1}/${plan.steps.length}:`, node.type);

        try {
          // Helper function to get fileId from dependencies
          const getFileIdFromDependencies = () => {
            // Check dependencies for the most recent fileId
            for (const depId of step.dependencies) {
              const depResult = results[depId];
              if (depResult?.fileId) {
                return depResult.fileId;
              }
            }
            return currentFileId;
          };

          switch (node.type) {
            case "dataset":
              // Dataset is already uploaded, just get the fileId
              currentFileId = (node.config as any).fileId;
              results[step.nodeId] = {
                type: "dataset",
                fileId: currentFileId,
                status: "success",
              };
              console.log(`✓ Dataset step complete. FileId: ${currentFileId}`);
              break;

            case "preprocessing":
              currentFileId = getFileIdFromDependencies();
              if (!currentFileId) throw new Error("No dataset file ID");

              // Build preprocessing config based on subType
              const subType = (node.config as any).subType;
              const columns = (node.config as any).columns || [];
              const preprocessConfig: any = {};

              // Map subType to proper config structure
              if (subType === "scaling") {
                preprocessConfig.scaling = [
                  {
                    method:
                      (node.config as any).options?.method || "standardize",
                    columns: columns,
                  },
                ];
              } else if (subType === "encoding") {
                preprocessConfig.encoding = [
                  {
                    method: (node.config as any).options?.method || "onehot",
                    columns: columns,
                  },
                ];
              } else if (subType === "missing_values") {
                preprocessConfig.missingValues = [
                  {
                    strategy: (node.config as any).options?.strategy || "mean",
                    columns: columns,
                  },
                ];
              } else if (subType === "outlier_removal") {
                preprocessConfig.outliers = [
                  {
                    method: "iqr",
                    threshold: (node.config as any).options?.threshold || 1.5,
                    columns: columns,
                  },
                ];
              }

              const preprocessResult = await preprocessData(
                currentFileId,
                preprocessConfig
              );
              // Preprocessing modifies data in-place, fileId stays the same
              results[step.nodeId] = {
                type: "preprocessing",
                fileId: currentFileId, // Keep the same fileId
                status: "success",
                data: preprocessResult,
              };
              console.log(
                `✓ Preprocessing step complete. Using FileId: ${currentFileId}`
              );
              break;

            case "split":
              currentFileId = getFileIdFromDependencies();
              if (!currentFileId) throw new Error("No dataset file ID");
              console.log(`→ Split using FileId: ${currentFileId}`);
              const splitConfig = {
                testSize: (node.config as any).testSize || 0.2,
                randomState: (node.config as any).randomState || 42,
                shuffle: (node.config as any).shuffle !== false,
              };
              const splitResult = await splitData(currentFileId, splitConfig);
              results[step.nodeId] = {
                type: "split",
                status: "success",
                data: splitResult,
              };
              console.log(`✓ Split step complete`);
              break;

            case "model":
              currentFileId = getFileIdFromDependencies();
              if (!currentFileId) throw new Error("No dataset file ID");
              console.log(`→ Model training using FileId: ${currentFileId}`);
              const modelConfig = {
                modelType: (node.config as any).subType,
                taskType: (node.config as any).taskType || "classification",
                targetColumn: (node.config as any).targetColumn,
                featureColumns: (node.config as any).featureColumns || [],
                hyperparameters: (node.config as any).hyperparameters || {},
              };
              const modelResult = await trainModel(currentFileId, modelConfig);
              results[step.nodeId] = {
                type: "model",
                status: "success",
                data: modelResult,
              };
              console.log(`✓ Model training complete`);
              break;

            case "evaluation":
              // Evaluation results come from the model training
              results[step.nodeId] = {
                type: "evaluation",
                status: "success",
                message: "Check model results",
              };
              break;
          }
        } catch (stepError: any) {
          console.error(`Error executing step ${i + 1}:`, stepError);
          results[step.nodeId] = {
            type: node.type,
            status: "error",
            error: stepError.message || "Execution failed",
          };
          setError(
            `Failed at step ${i + 1} (${node.type}): ${stepError.message}`
          );
          break;
        }
      }

      setExecutionResults(results);
      setExecutingStepIndex(-1);
      console.log("Execution completed. Results:", results);
    } catch (error: any) {
      console.error("Execution error:", error);
      setError(error.message || "Workflow execution failed");
      setExecutingStepIndex(-1);
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset the workflow? All nodes and connections will be removed."
      )
    ) {
      resetWorkflow();
      setSelectedNodeId(null);
    }
  };

  const handleSave = () => {
    // TODO: Implement workflow save/export
    const workflowData = { nodes, edges };
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    // TODO: Implement workflow load/import
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            console.log("Loaded workflow:", data);
            // TODO: Load into store
          } catch {
            alert("Failed to load workflow file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const canExecute = nodes.length > 0 && !isExecuting;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-black rounded-2xl blur-md opacity-20"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-black to-slate-800 rounded-2xl">
                  <Workflow className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-slate-700 bg-clip-text text-transparent">
                  Workflow Builder
                </h1>
                <p className="text-sm text-slate-500">
                  Drag-and-drop ML pipeline designer
                </p>
              </div>
            </div>

            {/* Center: Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {nodes.length}
                </div>
                <div className="text-xs text-slate-500">Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {edges.length}
                </div>
                <div className="text-xs text-slate-500">Connections</div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-2"
                disabled={nodes.length === 0}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoad}
                className="gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                Load
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
                disabled={nodes.length === 0}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleExecute}
                disabled={!canExecute}
                className="gap-2 bg-gradient-to-r from-black to-slate-700 hover:from-slate-800 hover:to-slate-900"
              >
                <Play className="h-4 w-4" />
                Execute Workflow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="px-6 pt-4">
          <Alert variant="destructive" className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Validation Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
              className="h-6 px-2"
            >
              ✕
            </Button>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Component Palette */}
        <div className="w-80 flex-shrink-0">
          <ComponentPalette onDragStart={() => {}} />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas onNodeSelect={setSelectedNodeId} />

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border-2 border-dashed border-slate-300">
                <Workflow className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  Start Building Your Workflow
                </h3>
                <p className="text-slate-500 max-w-md">
                  Drag components from the left panel onto this canvas to create
                  your ML pipeline. Connect nodes to define the data flow.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Configuration or Results */}
        <div className="w-96 flex-shrink-0">
          {showResults && executionPlan ? (
            <ExecutionResults
              plan={executionPlan}
              nodes={nodes}
              onClose={() => setShowResults(false)}
              executionResults={executionResults}
              executingStepIndex={executingStepIndex}
            />
          ) : (
            <ConfigurationPanel
              nodeId={selectedNodeId}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-slate-500">
              {nodes.filter((n) => n.validated).length} / {nodes.length} nodes
              configured
            </span>
            {nodes.length > 0 &&
              nodes.every((n) => n.validated) &&
              edges.every((e) => e.validated) && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Workflow Valid
                </span>
              )}
          </div>
          <div className="text-slate-400">
            Press Delete to remove selected nodes | Drag to create connections
          </div>
        </div>
      </footer>
    </div>
  );
}

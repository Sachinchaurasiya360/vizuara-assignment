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
import { ComponentPalette } from "../components/ComponentPalette";
import { WorkflowCanvas } from "../components/WorkflowCanvas";
import { ConfigurationPanel } from "../components/ConfigurationPanel";
import { useWorkflowStore } from "../store/workflowStore";

export function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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

  const handleExecute = () => {
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

    // TODO: Send to backend for execution
    console.log("Execution Plan:", plan);
    alert(
      `Workflow validated! Execution plan created with ${plan.totalSteps} steps.`
    );
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

        {/* Right Panel: Configuration */}
        <div className="w-96 flex-shrink-0">
          <ConfigurationPanel
            nodeId={selectedNodeId}
            onClose={() => setSelectedNodeId(null)}
          />
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

import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { PipelineNode } from "./PipelineNode";
import { usePipelineStore } from "@/store/usePipelineStore";
import type { PipelineStepType } from "@/types/pipeline.types";

// Define nodeTypes outside component to avoid React Flow warning
const nodeTypes = {
  pipelineNode: PipelineNode,
};

const STEP_LABELS: Record<PipelineStepType, string> = {
  upload: "Upload Data",
  preprocess: "Preprocess",
  split: "Train/Test Split",
  model: "Train Model",
  results: "View Results",
};

const STEP_DESCRIPTIONS: Record<PipelineStepType, string> = {
  upload: "Upload your dataset",
  preprocess: "Clean and transform data",
  split: "Split into train/test sets",
  model: "Train ML model",
  results: "Analyze performance",
};

export function PipelineVisualization() {
  const { steps, currentStep, goToStep } = usePipelineStore();

  // Create nodes from pipeline steps
  const initialNodes: Node[] = useMemo(() => {
    return steps.map((step, index) => ({
      id: step.id,
      type: "pipelineNode",
      position: { x: index * 280, y: 100 },
      data: {
        label: STEP_LABELS[step.type],
        type: step.type,
        status: step.status,
        description: STEP_DESCRIPTIONS[step.type],
      },
    }));
  }, [steps]);

  // Create edges between nodes
  const initialEdges: Edge[] = useMemo(() => {
    return steps.slice(0, -1).map((step, index) => {
      const nextStep = steps[index + 1];
      const isCompleted = step.status === "completed";
      const isCurrent =
        step.type === currentStep || nextStep.type === currentStep;

      return {
        id: `${step.id}-${nextStep.id}`,
        source: step.id,
        target: nextStep.id,
        type: "smoothstep",
        animated: isCompleted,
        style: {
          stroke: isCompleted ? "#10b981" : isCurrent ? "#94a3b8" : "#e2e8f0",
          strokeWidth: isCompleted ? 3 : isCurrent ? 2.5 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isCompleted ? "#10b981" : isCurrent ? "#94a3b8" : "#e2e8f0",
        },
      };
    });
  }, [steps, currentStep]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when steps change
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const step = steps.find((s) => s.id === node.id);
        if (step) {
          return {
            ...node,
            data: {
              ...node.data,
              status: step.status,
            },
          };
        }
        return node;
      })
    );
  }, [steps, setNodes]);

  // Update edges when steps change
  React.useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        const sourceStep = steps.find((s) => s.id === edge.source);
        const targetStep = steps.find((s) => s.id === edge.target);
        const isCompleted = sourceStep?.status === "completed";
        const isCurrent =
          sourceStep?.type === currentStep || targetStep?.type === currentStep;

        return {
          ...edge,
          animated: isCompleted,
          style: {
            stroke: isCompleted ? "#10b981" : isCurrent ? "#94a3b8" : "#e2e8f0",
            strokeWidth: isCompleted ? 3 : isCurrent ? 2.5 : 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: isCompleted ? "#10b981" : isCurrent ? "#94a3b8" : "#e2e8f0",
          },
        };
      })
    );
  }, [steps, setEdges, currentStep]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const step = steps.find((s) => s.id === node.id);
      if (step && (step.status === "completed" || step.type === currentStep)) {
        goToStep(step.type);
      }
    },
    [steps, currentStep, goToStep]
  );

  return (
    <div className="h-[350px] bg-gradient-to-br from-slate-50 to-slate-100/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background gap={16} size={1} color="#e2e8f0" />
        <Controls
          className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(node) => {
            const step = steps.find((s) => s.id === node.id);
            if (step?.status === "completed") return "#10b981";
            if (step?.status === "processing") return "#3b82f6";
            if (step?.status === "error") return "#ef4444";
            if (step?.type === currentStep) return "#000000";
            return "#cbd5e1";
          }}
          maskColor="rgba(248, 250, 252, 0.8)"
          className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
}

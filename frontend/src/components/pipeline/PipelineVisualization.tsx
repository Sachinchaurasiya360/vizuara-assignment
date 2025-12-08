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
      return {
        id: `${step.id}-${nextStep.id}`,
        source: step.id,
        target: nextStep.id,
        type: "smoothstep",
        animated: step.status === "completed",
        style: {
          stroke: step.status === "completed" ? "#10b981" : "#e5e7eb",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: step.status === "completed" ? "#10b981" : "#e5e7eb",
        },
      };
    });
  }, [steps]);

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
        return {
          ...edge,
          animated: sourceStep?.status === "completed",
          style: {
            stroke: sourceStep?.status === "completed" ? "#10b981" : "#e5e7eb",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: sourceStep?.status === "completed" ? "#10b981" : "#e5e7eb",
          },
        };
      })
    );
  }, [steps, setEdges]);

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
    <div className="h-[300px] bg-slate-50 rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const step = steps.find((s) => s.id === node.id);
            if (step?.status === "completed") return "#10b981";
            if (step?.status === "processing") return "#3b82f6";
            if (step?.status === "error") return "#ef4444";
            return "#e5e7eb";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}

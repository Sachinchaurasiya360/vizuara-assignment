import React, { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MarkerType,
  type Connection,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { WorkflowNodeComponent } from "./WorkflowNodeComponent";
import { useWorkflowStore } from "../store/workflowStore";
import type {
  PaletteItem,
  WorkflowNode as WFNode,
} from "../types/workflow.types";

const nodeTypes = {
  workflowNode: WorkflowNodeComponent,
};

interface WorkflowCanvasProps {
  onNodeSelect: (nodeId: string | null) => void;
}

export function WorkflowCanvas({ onNodeSelect }: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  const {
    nodes: workflowNodes,
    edges: workflowEdges,
    addNode,
    updateNode,
    deleteNode,
    addEdge: addWorkflowEdge,
    deleteEdge,
    selectNode,
    selectedNodeId,
    canConnectNodes,
  } = useWorkflowStore();

  // Convert workflow nodes to ReactFlow nodes
  const nodes: Node[] = useMemo(() => {
    return workflowNodes.map((node) => ({
      id: node.id,
      type: "workflowNode",
      position: node.position,
      data: node,
      selected: node.id === selectedNodeId,
    }));
  }, [workflowNodes, selectedNodeId]);

  // Convert workflow edges to ReactFlow edges
  const edges: Edge[] = useMemo(() => {
    return workflowEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: true,
      style: {
        stroke: edge.validated ? "#10b981" : "#ef4444",
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: edge.validated ? "#10b981" : "#ef4444",
      },
    }));
  }, [workflowEdges]);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(nodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges);

  // Sync ReactFlow nodes with workflow store nodes
  React.useEffect(() => {
    setRfNodes(nodes);
  }, [nodes, setRfNodes]);

  // Sync ReactFlow edges with workflow store edges
  React.useEffect(() => {
    setRfEdges(edges);
  }, [edges, setRfEdges]);

  // Handle node drag
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode]
  );

  // Handle connection creation
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      if (canConnectNodes(connection.source, connection.target)) {
        addWorkflowEdge({
          source: connection.source,
          target: connection.target,
        });
      } else {
        console.warn("Invalid connection attempt");
      }
    },
    [canConnectNodes, addWorkflowEdge]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
      onNodeSelect(node.id);
    },
    [selectNode, onNodeSelect]
  );

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    selectNode(null);
    onNodeSelect(null);
  }, [selectNode, onNodeSelect]);

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  // Handle drop (create new node)
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const paletteItemJson = event.dataTransfer.getData("paletteItem");

      if (!paletteItemJson || !reactFlowInstance || !reactFlowBounds) return;

      const paletteItem: PaletteItem = JSON.parse(paletteItemJson);
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create node configuration based on type
      const newNode: Omit<WFNode, "id"> = {
        type: paletteItem.type,
        label: paletteItem.label,
        position,
        status: "idle",
        validated: false,
        validationErrors: [],
        config: {},
      } as Omit<WFNode, "id">;

      // Add default configuration based on type
      if (paletteItem.type === "split") {
        newNode.config = {
          testSize: 0.2,
          randomState: 42,
          shuffle: true,
          stratify: false,
        };
      } else if (paletteItem.type === "preprocessing" && paletteItem.subType) {
        newNode.config = {
          subType: paletteItem.subType,
        };
      } else if (paletteItem.type === "model" && paletteItem.subType) {
        newNode.config = {
          subType: paletteItem.subType,
          featureColumns: [],
        };
      }

      const nodeId = addNode(newNode);
      selectNode(nodeId);
      onNodeSelect(nodeId);
    },
    [reactFlowInstance, addNode, selectNode, onNodeSelect]
  );

  // Handle node deletion
  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      nodesToDelete.forEach((node) => deleteNode(node.id));
    },
    [deleteNode]
  );

  // Handle edge deletion
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => deleteEdge(edge.id));
    },
    [deleteEdge]
  );

  return (
    <div ref={reactFlowWrapper} className="h-full w-full bg-slate-50">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as WFNode;
            switch (data.status) {
              case "completed":
                return "#10b981";
              case "error":
                return "#ef4444";
              case "running":
                return "#f59e0b";
              case "configured":
                return "#3b82f6";
              default:
                return "#94a3b8";
            }
          }}
          className="bg-white border border-slate-200 rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}

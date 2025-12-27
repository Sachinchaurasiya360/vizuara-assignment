import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowState,
  ExecutionStep,
  WorkflowExecutionPlan,
} from "../types/workflow.types";
import { v4 as uuidv4 } from "uuid";

interface WorkflowStore extends WorkflowState {
  // Node Actions
  addNode: (node: Omit<WorkflowNode, "id">) => string;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;

  // Edge Actions
  addEdge: (
    edge: Omit<WorkflowEdge, "id" | "validated" | "validationErrors">
  ) => void;
  deleteEdge: (edgeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<WorkflowEdge>) => void;

  // Validation
  validateWorkflow: () => boolean;
  validateNode: (nodeId: string) => boolean;
  validateEdge: (edgeId: string) => boolean;

  // Execution
  generateExecutionPlan: () => WorkflowExecutionPlan | null;
  setExecuting: (isExecuting: boolean) => void;
  setExecutionResults: (results: Record<string, unknown>) => void;
  setError: (error: string | null) => void;

  // Utility
  resetWorkflow: () => void;
  canConnectNodes: (sourceId: string, targetId: string) => boolean;
  getNodeById: (nodeId: string) => WorkflowNode | undefined;
  getUpstreamNodes: (nodeId: string) => WorkflowNode[];
  wouldCreateCycle: (sourceId: string, targetId: string) => boolean;
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isExecuting: false,
  executionResults: {},
  error: null,
};

export const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ============================================
      // Node Actions
      // ============================================

      addNode: (node) => {
        const id = uuidv4();
        const newNode: WorkflowNode = {
          ...node,
          id,
          status: "idle",
          validated: false,
          validationErrors: [],
        } as WorkflowNode;

        set(
          (state) => ({
            nodes: [...state.nodes, newNode],
          }),
          false,
          "addNode"
        );

        return id;
      },

      updateNode: (nodeId, updates) => {
        set(
          (state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? ({ ...node, ...updates, validated: false } as WorkflowNode)
                : node
            ),
          }),
          false,
          "updateNode"
        );
      },

      deleteNode: (nodeId) => {
        set(
          (state) => ({
            nodes: state.nodes.filter((node) => node.id !== nodeId),
            edges: state.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId
            ),
            selectedNodeId:
              state.selectedNodeId === nodeId ? null : state.selectedNodeId,
          }),
          false,
          "deleteNode"
        );
      },

      selectNode: (nodeId) => {
        set({ selectedNodeId: nodeId }, false, "selectNode");
      },

      // ============================================
      // Edge Actions
      // ============================================

      addEdge: (edge) => {
        const id = `${edge.source}-${edge.target}`;
        const newEdge: WorkflowEdge = {
          ...edge,
          id,
          validated: false,
          validationErrors: [],
        };

        set(
          (state) => {
            // Prevent duplicate edges
            const exists = state.edges.some(
              (e) => e.source === edge.source && e.target === edge.target
            );
            if (exists) return state;

            return {
              edges: [...state.edges, newEdge],
            };
          },
          false,
          "addEdge"
        );
      },

      deleteEdge: (edgeId) => {
        set(
          (state) => ({
            edges: state.edges.filter((edge) => edge.id !== edgeId),
          }),
          false,
          "deleteEdge"
        );
      },

      updateEdge: (edgeId, updates) => {
        set(
          (state) => ({
            edges: state.edges.map((edge) =>
              edge.id === edgeId ? { ...edge, ...updates } : edge
            ),
          }),
          false,
          "updateEdge"
        );
      },

      // ============================================
      // Validation
      // ============================================

      validateWorkflow: () => {
        const { nodes, edges } = get();

        // Check if workflow has at least one dataset node
        const datasetNodes = nodes.filter((n) => n.type === "dataset");
        if (datasetNodes.length === 0) {
          set({ error: "Workflow must have at least one dataset node" });
          return false;
        }

        // Check if all nodes are configured
        const unconfiguredNodes = nodes.filter(
          (n) => n.status === "idle" || !n.validated
        );
        if (unconfiguredNodes.length > 0) {
          set({
            error: `${unconfiguredNodes.length} node(s) are not configured`,
          });
          return false;
        }

        // Validate each node
        for (const node of nodes) {
          if (!get().validateNode(node.id)) {
            return false;
          }
        }

        // Validate edges
        for (const edge of edges) {
          if (!get().validateEdge(edge.id)) {
            return false;
          }
        }

        set({ error: null });
        return true;
      },

      validateNode: (nodeId) => {
        const { nodes, updateNode } = get();
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return false;

        const errors: string[] = [];

        // Type-specific validation
        switch (node.type) {
          case "dataset":
            if (!node.config.fileId) {
              errors.push("No file uploaded");
            }
            break;

          case "preprocessing": {
            const upstream = get().getUpstreamNodes(nodeId);
            if (upstream.length === 0) {
              errors.push("Must connect to a dataset or previous step");
            }
            if (!node.config.subType) {
              errors.push("Preprocessing type not selected");
            }
            if (
              node.config.columns &&
              node.config.columns.length === 0 &&
              node.config.subType !== "missing_values"
            ) {
              errors.push("No columns selected");
            }
            break;
          }

          case "split": {
            const upstream = get().getUpstreamNodes(nodeId);
            if (upstream.length === 0) {
              errors.push("Must connect to a dataset or preprocessing step");
            }
            if (node.config.testSize <= 0 || node.config.testSize >= 1) {
              errors.push("Test size must be between 0 and 1");
            }
            break;
          }

          case "model": {
            const upstream = get().getUpstreamNodes(nodeId);
            const hasSplit = upstream.some((n) => n.type === "split");
            if (!hasSplit) {
              errors.push("Must connect to a train-test split");
            }
            if (!node.config.subType) {
              errors.push("Model type not selected");
            }
            if (!node.config.targetColumn) {
              errors.push("Target column not selected");
            }
            if (
              !node.config.featureColumns ||
              node.config.featureColumns.length === 0
            ) {
              errors.push("No feature columns selected");
            }
            break;
          }

          case "evaluation": {
            const upstream = get().getUpstreamNodes(nodeId);
            const hasModel = upstream.some((n) => n.type === "model");
            if (!hasModel) {
              errors.push("Must connect to a trained model");
            }
            break;
          }
        }

        updateNode(nodeId, {
          validated: errors.length === 0,
          validationErrors: errors,
        });

        return errors.length === 0;
      },

      validateEdge: (edgeId) => {
        const { edges, nodes, updateEdge } = get();
        const edge = edges.find((e) => e.id === edgeId);
        if (!edge) return false;

        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (!sourceNode || !targetNode) {
          updateEdge(edgeId, {
            validated: false,
            validationErrors: ["Invalid connection"],
          });
          return false;
        }

        const errors: string[] = [];

        // Validation rules based on node types
        const validConnections: Record<string, string[]> = {
          dataset: ["preprocessing", "split", "model"],
          preprocessing: ["preprocessing", "split", "model"],
          split: ["model"],
          model: ["evaluation"],
          evaluation: [],
        };

        const allowedTargets = validConnections[sourceNode.type] || [];
        if (!allowedTargets.includes(targetNode.type)) {
          errors.push(
            `Cannot connect ${sourceNode.type} to ${targetNode.type}`
          );
        }

        // Prevent cycles
        if (get().wouldCreateCycle(edge.source, edge.target)) {
          errors.push("Connection would create a cycle");
        }

        updateEdge(edgeId, {
          validated: errors.length === 0,
          validationErrors: errors,
        });

        return errors.length === 0;
      },

      // Helper to detect cycles
      wouldCreateCycle: (sourceId: string, targetId: string): boolean => {
        const { edges } = get();
        const visited = new Set<string>();

        const dfs = (nodeId: string): boolean => {
          if (nodeId === sourceId) return true;
          if (visited.has(nodeId)) return false;
          visited.add(nodeId);

          const outgoing = edges.filter((e) => e.source === nodeId);
          for (const edge of outgoing) {
            if (dfs(edge.target)) return true;
          }

          return false;
        };

        return dfs(targetId);
      },

      // ============================================
      // Execution
      // ============================================

      generateExecutionPlan: () => {
        const { nodes, edges } = get();

        // Topological sort to determine execution order
        const inDegree = new Map<string, number>();
        const adjList = new Map<string, string[]>();

        // Initialize
        nodes.forEach((node) => {
          inDegree.set(node.id, 0);
          adjList.set(node.id, []);
        });

        // Build graph
        edges.forEach((edge) => {
          adjList.get(edge.source)?.push(edge.target);
          inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        });

        // Topological sort
        const queue: string[] = [];
        const executionOrder: ExecutionStep[] = [];

        // Find all nodes with no dependencies
        inDegree.forEach((degree, nodeId) => {
          if (degree === 0) {
            queue.push(nodeId);
          }
        });

        let order = 0;
        while (queue.length > 0) {
          const nodeId = queue.shift()!;
          const node = nodes.find((n) => n.id === nodeId)!;
          const dependencies = edges
            .filter((e) => e.target === nodeId)
            .map((e) => e.source);

          executionOrder.push({
            nodeId,
            nodeType: node.type,
            order: order++,
            dependencies,
          });

          adjList.get(nodeId)?.forEach((neighbor) => {
            const newDegree = (inDegree.get(neighbor) || 0) - 1;
            inDegree.set(neighbor, newDegree);
            if (newDegree === 0) {
              queue.push(neighbor);
            }
          });
        }

        // Check if all nodes were processed (no cycles)
        if (executionOrder.length !== nodes.length) {
          set({ error: "Workflow contains cycles" });
          return null;
        }

        return {
          steps: executionOrder,
          totalSteps: executionOrder.length,
        };
      },

      setExecuting: (isExecuting) => {
        set({ isExecuting }, false, "setExecuting");
      },

      setExecutionResults: (results) => {
        set({ executionResults: results }, false, "setExecutionResults");
      },

      setError: (error) => {
        set({ error }, false, "setError");
      },

      // ============================================
      // Utility
      // ============================================

      resetWorkflow: () => {
        set(initialState, false, "resetWorkflow");
      },

      canConnectNodes: (sourceId, targetId) => {
        const { nodes } = get();
        const source = nodes.find((n) => n.id === sourceId);
        const target = nodes.find((n) => n.id === targetId);

        if (!source || !target) return false;

        const validConnections: Record<string, string[]> = {
          dataset: ["preprocessing", "split", "model"],
          preprocessing: ["preprocessing", "split", "model"],
          split: ["model"],
          model: ["evaluation"],
          evaluation: [],
        };

        return validConnections[source.type]?.includes(target.type) || false;
      },

      getNodeById: (nodeId) => {
        return get().nodes.find((n) => n.id === nodeId);
      },

      getUpstreamNodes: (nodeId) => {
        const { nodes, edges } = get();
        const upstream: WorkflowNode[] = [];

        const findUpstream = (id: string) => {
          const incomingEdges = edges.filter((e) => e.target === id);
          incomingEdges.forEach((edge) => {
            const node = nodes.find((n) => n.id === edge.source);
            if (node && !upstream.some((n) => n.id === node.id)) {
              upstream.push(node);
              findUpstream(edge.source);
            }
          });
        };

        findUpstream(nodeId);
        return upstream;
      },
    }),
    { name: "WorkflowStore" }
  )
);

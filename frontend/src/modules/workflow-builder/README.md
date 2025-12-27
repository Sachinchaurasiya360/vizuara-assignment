# Workflow Builder Module

## Overview

A true drag-and-drop no-code ML pipeline builder that allows users to visually construct, configure, and execute machine learning workflows.

## Architecture

```
workflow-builder/
├── components/
│   ├── ComponentPalette.tsx       # Left panel - draggable components
│   ├── WorkflowCanvas.tsx         # Center canvas - ReactFlow workspace
│   ├── WorkflowNodeComponent.tsx  # Custom node visualization
│   └── ConfigurationPanel.tsx     # Right panel - node settings
├── config/
│   └── paletteConfig.ts          # Available components definition
├── pages/
│   └── WorkflowBuilderPage.tsx   # Main page orchestrator
├── store/
│   └── workflowStore.ts          # Zustand state management
├── types/
│   └── workflow.types.ts         # TypeScript definitions
└── index.ts                       # Module exports
```

## Features

### ✨ Core Capabilities

- **Drag-and-Drop Interface**: Intuitive component palette with visual dragging
- **Visual Pipeline Construction**: Connect nodes via edges to define data flow
- **Real-time Validation**: Immediate feedback on invalid connections and configurations
- **Node Configuration**: Side panel for detailed settings per node
- **DAG Execution Planning**: Topological sort for correct execution order
- **Cycle Detection**: Prevents invalid circular dependencies
- **Save/Load Workflows**: Export and import workflow definitions as JSON

### 🎯 Available Components

#### Data Components

- **Dataset Upload**: Load CSV/Excel files

#### Preprocessing Components

- **Feature Scaling**: Standardize, normalize, min-max, robust scaling
- **Normalization**: Scale features to 0-1 range
- **Categorical Encoding**: One-hot, label, ordinal encoding
- **Handle Missing Values**: Drop, mean, median, mode, constant fill
- **Remove Outliers**: IQR or Z-score based outlier detection

#### Split Component

- **Train-Test Split**: Configurable split ratio with shuffle and stratification options

#### Model Components

- **Logistic Regression**: Binary classification
- **Decision Tree**: Classification/regression tree
- **Random Forest**: Ensemble tree model
- **Linear Regression**: Linear relationship prediction

#### Evaluation Component

- **Model Evaluation**: Automatic performance metrics calculation

## Validation Rules

### Connection Rules

```
dataset → [preprocessing, split, model]
preprocessing → [preprocessing, split, model]
split → [model]
model → [evaluation]
evaluation → []  (terminal node)
```

### Node Validation

- **Dataset**: Must have uploaded file
- **Preprocessing**: Must connect upstream, have subtype and columns selected
- **Split**: Must connect upstream, test size in (0, 1)
- **Model**: Must connect to split, have model type, target column, and feature columns
- **Evaluation**: Must connect to trained model

## State Management

Uses Zustand for predictable state management:

```typescript
{
  nodes: WorkflowNode[]        // All workflow nodes
  edges: WorkflowEdge[]        // All connections
  selectedNodeId: string | null // Currently selected node
  isExecuting: boolean         // Execution status
  executionResults: {}         // Results from execution
  error: string | null         // Validation/execution errors
}
```

## Usage

### Basic Flow

1. **Drag Component**: Drag from palette onto canvas
2. **Configure Node**: Click node → configure in right panel → save
3. **Connect Nodes**: Drag from output handle to input handle
4. **Validate**: System validates automatically
5. **Execute**: Click "Execute Workflow" to run pipeline

### Execution Plan

Workflow generates a DAG execution plan using topological sort:

```typescript
{
  steps: [
    { nodeId: "dataset-1", nodeType: "dataset", order: 0, dependencies: [] },
    { nodeId: "split-1", nodeType: "split", order: 1, dependencies: ["dataset-1"] },
    { nodeId: "model-1", nodeType: "model", order: 2, dependencies: ["split-1"] },
    { nodeId: "eval-1", nodeType: "evaluation", order: 3, dependencies: ["model-1"] }
  ],
  totalSteps: 4
}
```

## Installation

### Prerequisites

Install required dependencies:

```bash
cd frontend
npm install uuid
npm install --save-dev @types/uuid
```

### Integration

The module is already integrated into the app via:

- Route: `/workflow-builder` in `App.tsx`
- Landing page: Updated with "Drag & Drop Builder" button

## Backend Integration (TODO)

Create a new API endpoint to execute workflows:

```javascript
// server/src/routes/workflow.js
router.post("/execute", async (req, res) => {
  const { nodes, edges, executionPlan } = req.body;

  // Execute nodes in topological order
  for (const step of executionPlan.steps) {
    const node = nodes.find((n) => n.id === step.nodeId);
    // Execute based on node.type and node.config
    // Pass data from dependencies
  }

  return results;
});
```

## Comparison: Workflow Builder vs Classic Pipeline

| Feature        | Workflow Builder             | Classic Pipeline            |
| -------------- | ---------------------------- | --------------------------- |
| Interface      | Drag-and-drop canvas         | Step-by-step wizard         |
| Flexibility    | Fully customizable           | Fixed 5-step flow           |
| Visualization  | Real-time graph              | Static progress bar         |
| Reusability    | Save/load workflows          | One-time use                |
| Complexity     | Multiple preprocessing steps | Single preprocessing config |
| Learning Curve | Visual, intuitive            | Guided, simpler             |

## Future Enhancements

- [ ] Backend API for workflow execution
- [ ] Real-time execution progress visualization
- [ ] Workflow templates library
- [ ] Collaborative editing
- [ ] Version control for workflows
- [ ] Custom node creation
- [ ] Nested subworkflows
- [ ] Performance optimization for large workflows
- [ ] Undo/redo functionality
- [ ] Auto-layout algorithm
- [ ] Export to code (Python/R)

## Technical Notes

### ReactFlow Integration

- Uses ReactFlow v11 for graph visualization
- Custom node types for ML-specific components
- Edge validation prevents invalid connections
- MiniMap for navigation in large workflows

### Performance

- Memoized node/edge conversions
- Efficient state updates via Zustand
- Debounced validation checks
- Lazy loading for large workflows

## Developer Guide

### Adding New Node Types

1. Define in `types/workflow.types.ts`:

   ```typescript
   export interface MyNodeConfig extends BaseNodeConfig {
     type: "mynode";
     config: { ... };
   }
   ```

2. Add to palette in `config/paletteConfig.ts`

3. Update validation in `store/workflowStore.ts`

4. Add configuration UI in `components/ConfigurationPanel.tsx`

5. Update connection rules

### Debugging

Enable Zustand devtools:

- Open Redux DevTools extension
- Monitor "WorkflowStore" for state changes
- Track action history

## License

Part of the ML Pipeline Builder project.

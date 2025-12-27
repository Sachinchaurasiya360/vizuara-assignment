# Workflow Builder - Installation & Setup

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install uuid
npm install --save-dev @types/uuid
```

### 2. Verify Installation

The module is already integrated:

- ✅ Route added to `App.tsx`
- ✅ Landing page updated
- ✅ All components created

### 3. Run the Application

Terminal 1 (Backend):

```bash
cd server
npm start
```

Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
```

### 4. Access Workflow Builder

Navigate to: `http://localhost:5173/workflow-builder`

Or click "Drag & Drop Builder" from the landing page.

## Module Structure

```
frontend/src/modules/workflow-builder/
├── components/
│   ├── ComponentPalette.tsx          ✅ Created
│   ├── WorkflowCanvas.tsx            ✅ Created
│   ├── WorkflowNodeComponent.tsx     ✅ Created
│   └── ConfigurationPanel.tsx        ✅ Created
├── config/
│   └── paletteConfig.ts              ✅ Created
├── pages/
│   └── WorkflowBuilderPage.tsx       ✅ Created
├── store/
│   └── workflowStore.ts              ✅ Created
├── types/
│   └── workflow.types.ts             ✅ Created
├── index.ts                           ✅ Created
└── README.md                          ✅ Created
```

## What's Included

### Core Features

- ✅ Drag-and-drop component palette
- ✅ Interactive ReactFlow canvas
- ✅ Custom ML workflow nodes
- ✅ Configuration panel for node settings
- ✅ Real-time validation system
- ✅ DAG execution plan generation
- ✅ Cycle detection
- ✅ Save/load workflows
- ✅ Complete type definitions
- ✅ Zustand state management

### Components Available

- 📊 Dataset Upload
- 📏 Feature Scaling
- 📐 Normalization
- 🔤 Categorical Encoding
- 🔧 Handle Missing Values
- 🎯 Outlier Removal
- ✂️ Train-Test Split
- 🎲 Logistic Regression
- 🌳 Decision Tree
- 🌲 Random Forest
- 📈 Linear Regression
- 📊 Model Evaluation

## Usage Example

1. **Start with Dataset**

   - Drag "Dataset Upload" onto canvas
   - Click node to configure
   - Upload CSV/Excel file
   - Save configuration

2. **Add Preprocessing** (Optional)

   - Drag "Feature Scaling" or other preprocessing
   - Connect dataset → preprocessing
   - Configure columns and methods

3. **Split Data**

   - Drag "Train-Test Split"
   - Connect preprocessing/dataset → split
   - Configure split ratio (default 80/20)

4. **Train Model**

   - Drag model type (e.g., "Decision Tree")
   - Connect split → model
   - Configure target column, features, task type

5. **Evaluate**

   - Drag "Model Evaluation"
   - Connect model → evaluation

6. **Execute**
   - Click "Execute Workflow"
   - System validates and generates execution plan

## Validation System

The workflow automatically validates:

✅ **Node Configuration**

- Dataset has uploaded file
- Preprocessing has selected columns
- Split has valid ratio
- Model has target and features

✅ **Connections**

- Valid node type combinations
- No circular dependencies
- Proper upstream connections

✅ **Workflow**

- At least one dataset node
- All nodes configured
- Valid execution order (DAG)

## Troubleshooting

### Issue: "uuid is not defined"

**Solution**: Run `npm install uuid` in frontend directory

### Issue: Nodes not appearing on drag

**Solution**: Ensure ReactFlow is properly initialized and onDrop handler is working

### Issue: Cannot connect nodes

**Solution**: Check validation rules - some connections are intentionally restricted

### Issue: Configuration panel not showing

**Solution**: Click on a node to select it first

## Next Steps

### For Users

1. Build your first workflow
2. Save and share workflow JSON
3. Experiment with different model combinations

### For Developers

1. Implement backend workflow execution API
2. Add real-time execution visualization
3. Create workflow templates
4. Add custom node types

## Backend Integration (TODO)

To enable full workflow execution, create:

```javascript
// server/src/routes/workflow.js

import express from "express";
const router = express.Router();

router.post("/execute", async (req, res) => {
  const { nodes, edges, executionPlan } = req.body;
  const results = {};

  // Execute nodes in topological order
  for (const step of executionPlan.steps) {
    const node = nodes.find((n) => n.id === step.nodeId);

    switch (node.type) {
      case "dataset":
        // Upload and process file
        break;
      case "preprocessing":
        // Apply transformation based on subType
        break;
      case "split":
        // Split data
        break;
      case "model":
        // Train model
        break;
      case "evaluation":
        // Calculate metrics
        break;
    }

    results[step.nodeId] = nodeResult;
  }

  res.json({ success: true, results });
});

export default router;
```

Then add to `server/src/index.js`:

```javascript
import workflowRouter from "./routes/workflow.js";
app.use("/api/workflow", workflowRouter);
```

## Support

For issues or questions:

1. Check the main README.md
2. Review validation errors in the UI
3. Check browser console for detailed logs
4. Verify all dependencies are installed

## Comparison with Classic Builder

| Aspect         | Workflow Builder    | Classic Builder   |
| -------------- | ------------------- | ----------------- |
| URL            | `/workflow-builder` | `/builder`        |
| Style          | Drag-and-drop       | Step wizard       |
| Flexibility    | High - custom flows | Low - fixed steps |
| Preprocessing  | Multiple nodes      | Single config     |
| Visualization  | Real-time graph     | Static progress   |
| Save/Load      | ✅ Yes              | ❌ No             |
| Learning Curve | Medium              | Easy              |

Choose Workflow Builder for:

- Complex pipelines with multiple preprocessing steps
- Reusable workflows
- Visual pipeline design
- Experimentation

Choose Classic Builder for:

- Quick one-off tasks
- Learning ML concepts
- Simple linear workflows

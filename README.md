# 🚀 ML Pipeline Builder & Workflow Platform

A comprehensive, visual, no-code machine learning platform built with React, TypeScript, and Node.js. Create, evaluate, and deploy end-to-end ML workflows without writing a single line of code. Features an intelligent chatbot assistant to guide you through every step of your machine learning journey.

## ✨ Key Features

### 🤖 AI Chatbot Assistant

- **Intelligent Guidance**: Context-aware chatbot that helps you navigate the platform and make informed decisions
- **Real-time Support**: Get instant answers to questions about ML concepts, pipeline steps, and troubleshooting
- **Step-by-Step Assistance**: Guided walkthroughs for complex workflows and model configurations
- **Interactive Help**: Ask questions at any point in your workflow and receive relevant, actionable advice
- **Best Practices**: Recommendations for preprocessing, model selection, and parameter tuning

### 🎯 Core ML Pipeline Builder

- **✅ File Upload**: Support for CSV and Excel files with validation and preview
- **✅ Data Preprocessing**: Multiple options including standardization, normalization, and feature engineering
- **✅ Train-Test Split**: Configurable ratios (80-20, 70-30, 75-25) with visual representation
- **✅ Model Selection**: Logistic Regression, Decision Tree, Random Forest, and Linear Regression
- **✅ Results Visualization**: Comprehensive metrics, charts, and performance analytics
- **✅ Export & Share**: Download results as JSON, save pipelines for reuse

### 🔧 Advanced Workflow Builder

- **Drag-and-Drop Interface**: True no-code visual canvas powered by ReactFlow
- **Component Palette**: Rich library of ML components (data loading, preprocessing, models, evaluation)
- **Custom Node Configuration**: Detailed settings panel for each workflow node
- **Visual Pipeline Construction**: Connect nodes via edges to define complex data flows
- **DAG Validation**: Automatic cycle detection and execution order planning
- **Save/Load Workflows**: Export and import workflow definitions as JSON
- **Real-time Feedback**: Immediate validation of connections and configurations

### 📊 Model Evaluation & Comparison

- **Multi-Model Comparison**: Compare multiple model predictions side-by-side
- **Ground Truth Analysis**: Upload actual labels for performance evaluation
- **Prediction Upload**: Support for model predictions from external sources
- **Comprehensive Metrics**: Accuracy, Precision, Recall, F1, Confusion Matrix, ROC-AUC
- **Visual Comparisons**: Interactive charts comparing model performance
- **Error Analysis**: Detailed breakdown of prediction errors and patterns

### 🎨 User Experience

- **Visual Pipeline Flow**: React Flow visualization showing all pipeline stages
- **Step-by-Step Navigation**: Progress-tracked sidebar with clear indicators
- **No Code Required**: 100% GUI-based interactions with intuitive controls
- **Beginner-Friendly**: Contextual tooltips, explanations, and chatbot assistance
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, card-based layout with smooth animations and transitions

### 📈 Visualization & Analytics

- **Performance Metrics Dashboard**: Accuracy, Precision, Recall, F1 Score (Classification) or R², RMSE, MAE (Regression)
- **Feature Importance Charts**: Interactive bar charts showing top contributing features
- **Predictions Table**: Sample predictions with actual vs predicted comparison
- **Training Insights**: Real-time training progress and convergence visualization
- **Data Exploration**: Preview tables with statistics and distribution analysis

## 🏗️ Architecture

### Frontend Stack

```
frontend/
├── src/
│   ├── components/
│   │   ├── steps/              # Pipeline step components (Upload, Preprocess, Split, Model, Results)
│   │   ├── pipeline/           # Reusable pipeline widgets (FileUpload, ModelSelector, MetricsCard)
│   │   ├── ui/                 # Base UI components (buttons, cards, tables, inputs)
│   │   ├── LandingPage.tsx     # Main landing page with feature showcase
│   │   ├── PipelineBuilder.tsx # Guided pipeline builder interface
│   │   └── AboutMe.tsx         # About & documentation page
│   ├── modules/
│   │   ├── model-evaluation/   # Model comparison and evaluation module
│   │   │   ├── components/     # GroundTruthStep, PredictionStep, ComparisonStep
│   │   │   ├── api/            # Evaluation API endpoints
│   │   │   ├── store/          # Zustand state management
│   │   │   └── pages/          # ModelEvaluationPage
│   │   └── workflow-builder/   # Advanced drag-and-drop workflow builder
│   │       ├── components/     # ComponentPalette, WorkflowCanvas, ConfigurationPanel
│   │       ├── config/         # Available components and node definitions
│   │       ├── store/          # Workflow state management
│   │       └── types/          # TypeScript type definitions
│   ├── api/                    # API client and endpoint wrappers
│   ├── services/               # Business logic (PipelineNarrator, etc.)
│   ├── store/                  # Global Zustand state management
│   └── types/                  # Shared TypeScript type definitions
```

**Tech Stack:**

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS 4 with custom design system
- **State Management**: Zustand for reactive state
- **Routing**: React Router v7
- **Visualization**:
  - ReactFlow for pipeline/workflow visualization
  - Recharts for data analytics and charts
- **UI Components**: Custom component library with Lucide icons
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Stack

```
server/
├── src/
│   ├── modules/
│   │   └── model-evaluation/   # Model evaluation module
│   │       ├── routes/         # Evaluation API routes
│   │       └── services/       # Evaluation logic and metrics
│   ├── routes/                 # Core API endpoints
│   │   ├── upload.js           # Dataset upload handler
│   │   ├── preprocess.js       # Data preprocessing endpoint
│   │   ├── split.js            # Train-test split logic
│   │   └── train.js            # Model training endpoint
│   ├── utils/                  # Utility modules
│   │   ├── mlModels.js         # ML algorithm implementations
│   │   ├── metrics.js          # Performance metrics calculations
│   │   ├── dataProcessing.js   # Data transformation utilities
│   │   └── storage.js          # File storage management
│   └── index.js                # Express server entry point
├── uploads/                    # Dataset uploads storage
├── evaluation-uploads/         # Model evaluation data storage
└── test-data/                  # Sample datasets for testing
```

**Tech Stack:**

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **ML Algorithms**: Custom implementations (Logistic Regression, Decision Tree, Random Forest, Linear Regression)
- **Data Processing**:
  - csv-parser for CSV files
  - xlsx for Excel file parsing
  - Custom data transformation utilities
- **File Handling**: Multer for multipart/form-data
- **Storage**: In-memory data storage with file-based persistence
- **CORS**: Enabled for cross-origin requests

### Application Routes

- `/` - Landing page with feature overview and navigation
- `/builder` - Guided ML pipeline builder (step-by-step interface)
- `/workflow-builder` - Advanced drag-and-drop workflow constructor
- `/model-evaluation` - Multi-model comparison and evaluation tool
- `/about` - Platform documentation and about section

### API Endpoints

**Core Pipeline APIs:**

- `POST /api/upload` - Upload and validate datasets (CSV/Excel)
- `POST /api/preprocess` - Apply preprocessing transformations
- `POST /api/split` - Configure and execute train-test split
- `POST /api/train` - Train ML models with selected algorithm
- `GET /api/health` - Server health check

**Model Evaluation APIs:**

- `POST /api/evaluation/ground-truth` - Upload ground truth labels
- `POST /api/evaluation/predictions` - Upload model predictions
- `POST /api/evaluation/compare` - Compare multiple model performances

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher (v22.18.0 recommended)
- **npm**: v9+ or yarn v1.22+
- **OS**: Windows, macOS, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Installation

1. **Clone the Repository**

```bash
git clone <repository-url>
cd "Vizuara Assignment"
```

2. **Install Backend Dependencies**

```bash
cd server
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

### Running the Application

#### Option 1: Development Mode (Recommended)

**Backend Server** (Terminal 1)

```bash
cd server
npm run dev
# Server runs on http://localhost:3001
# Auto-reloads on file changes
```

**Frontend Development Server** (Terminal 2)

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
# Hot module replacement enabled
```

#### Option 2: Production Mode

**Backend**

```bash
cd server
npm start
```

**Frontend** (build and serve)

```bash
cd frontend
npm run build
npm run preview
```

#### Option 3: PowerShell (Windows)

```powershell
# Terminal 1 - Backend
cd "c:\Codes\Vizuara Assignment\server"
npm run dev

# Terminal 2 - Frontend
cd "c:\Codes\Vizuara Assignment\frontend"
npm run dev
```

3. **Access the Application**

```
Frontend: http://localhost:5173
Backend API: http://localhost:3001/api
Health Check: http://localhost:3001/api/health
```

### Quick Start Guide

1. **Navigate to** `http://localhost:5173` in your browser
2. **Explore Features** from the landing page:
   - Click "Get Started" for the guided pipeline builder
   - Try "Workflow Builder" for advanced drag-and-drop interface
   - Use "Model Evaluation" to compare model predictions
3. **Ask the Chatbot** for help at any step
4. **Upload Sample Data** from `test-data/` folder to try features

## 📖 User Guide

### 🎓 Guided Pipeline Builder (Step-by-Step)

#### Step 1: Upload Dataset

- Click the upload area or drag and drop a file
- **Supported formats**: `.csv`, `.xlsx`, `.xls`
- **Maximum file size**: 50MB
- **Requirements**: First row must contain column headers
- **Preview**: View your data immediately after upload
- **Chatbot Tip**: Ask "What makes a good dataset?" for guidance

#### Step 2: Preprocess Data (Optional)

- **Standardization**: Scales features to mean=0, std=1 (recommended for algorithms sensitive to scale)
- **Normalization**: Scales features to range [0, 1]
- **Feature Engineering**: Create new features from existing ones
- **Handle Missing Values**: Automatic detection and handling options
- **Chatbot Tip**: Ask "Should I standardize or normalize?" for advice

#### Step 3: Train-Test Split

- **Recommended**: 80-20 split (80% training, 20% testing)
- **Other Options**: 70-30, 75-25
- **Visual Indicator**: See exact distribution with color-coded bars
- **Preview**: View samples from both train and test sets
- **Chatbot Tip**: Ask "Why do we split data?" to learn more

#### Step 4: Select & Train Model

**Choose Task Type:**

- **Classification**: Predict categories (spam/ham, yes/no, multiple classes)
- **Regression**: Predict continuous numbers (prices, temperatures, scores)

**Select Algorithm:**

- **Logistic Regression**: Fast, interpretable, great for linearly separable data
- **Decision Tree**: Handles non-linear patterns, easy to interpret
- **Random Forest**: Ensemble method, higher accuracy, robust to overfitting
- **Linear Regression**: For continuous target prediction (regression only)

**Configure:**

- Select target column (what you want to predict)
- Review feature columns
- Click "Train Model"
- **Chatbot Tip**: Ask "Which model should I use?" for personalized recommendations

#### Step 5: View & Analyze Results

**Execution Status**:

- Success/failure indicator
- Training time and performance summary

**Performance Metrics**:

- **Classification**: Accuracy, Precision, Recall, F1 Score, Confusion Matrix
- **Regression**: R², RMSE, MAE, MSE
- Primary metric highlighted for quick assessment

**Visualizations**:

- **Feature Importance Chart**: See which features matter most
- **Predictions Table**: Compare actual vs predicted values
- **Performance Trends**: Visualize model behavior

**Export Options**:

- Download results as JSON
- Save pipeline configuration for reuse
- **Chatbot Tip**: Ask "How do I interpret these metrics?" for explanations

### 🛠️ Advanced Workflow Builder

#### Getting Started with Workflows

1. **Open Workflow Builder** from the landing page
2. **Drag Components** from the left palette onto the canvas
3. **Connect Nodes** by dragging from output handles to input handles
4. **Configure Each Node** using the right-side panel
5. **Validate Pipeline** to check for errors
6. **Execute Workflow** to run your complete pipeline
7. **Chatbot Tip**: Ask "How do I build a workflow?" for step-by-step guidance

#### Available Component Categories

**Data Components**:

- Dataset Upload
- Data Preview
- Feature Selection

**Preprocessing Components**:

- Feature Scaling (Standard, MinMax, Robust)
- Normalization
- Categorical Encoding (One-Hot, Label, Ordinal)
- Handle Missing Values (Drop, Mean, Median, Mode, Constant)
- Feature Engineering

**Model Components**:

- Logistic Regression
- Decision Tree
- Random Forest
- Linear Regression
- Custom Model Import

**Evaluation Components**:

- Train-Test Split
- Cross-Validation
- Metrics Calculation
- Confusion Matrix
- ROC Curve

#### Workflow Features

- **Real-time Validation**: Instant feedback on invalid connections
- **Cycle Detection**: Prevents circular dependencies
- **Auto-Layout**: Organize nodes automatically
- **Save/Load**: Export workflows as JSON for sharing
- **Undo/Redo**: Full edit history
- **Chatbot Tip**: Ask "How do I save my workflow?" for instructions

### 📊 Model Evaluation & Comparison

#### Comparing Multiple Models

1. **Upload Ground Truth**: CSV with actual labels/values
2. **Upload Model Predictions**: One or more CSV files with predictions
3. **Compare Performance**: Side-by-side metrics and visualizations
4. **Analyze Differences**: See where models agree/disagree
5. **Export Comparison**: Download comprehensive report
6. **Chatbot Tip**: Ask "How do I compare models?" for best practices

#### Evaluation Metrics

**Classification Metrics**:

- Accuracy, Precision, Recall, F1 Score
- Confusion Matrix with heatmap
- ROC Curve and AUC
- Per-class metrics

**Regression Metrics**:

- R² (Coefficient of Determination)
- RMSE (Root Mean Squared Error)
- MAE (Mean Absolute Error)
- MSE (Mean Squared Error)

### 🤖 Using the Chatbot Assistant

#### How to Interact

- **Ask Questions**: Type or speak your questions naturally
- **Get Recommendations**: Ask for suggestions on model selection, preprocessing, etc.
- **Troubleshooting**: Describe errors or issues for instant help
- **Learn Concepts**: Ask about ML terms, algorithms, or best practices
- **Context-Aware**: Chatbot knows your current pipeline state

#### Example Questions

- "What's the difference between standardization and normalization?"
- "Which model should I use for my data?"
- "Why is my accuracy low?"
- "How do I handle missing values?"
- "What does this error mean?"
- "Explain feature importance"
- "Should I use more training data?"

#### Chatbot Features

- **Natural Language**: Ask questions in plain English
- **Code Examples**: Get code snippets when needed
- **Interactive Tutorials**: Step-by-step walkthroughs
- **Resource Links**: Relevant documentation and articles
- **Multi-turn Conversations**: Follow-up questions maintained in context

## 🎨 Design Principles

### Visual Pipeline Flow

- React Flow visualization showing data → preprocessing → model → output
- Color-coded status (green = completed, black = current, gray = pending)
- Animated connections between completed steps

### No-Code Interface

- All interactions through buttons, dropdowns, and file uploads
- Preset configurations for common use cases
- No manual coding or scripting required

### Beginner-Friendly

- Helpful tooltips explaining each step
- Info boxes with context (e.g., "Why split data?")
- Clear labels and descriptions
- Visual feedback for all actions

### Clean, Modern UI

- Card-based layout with clear hierarchy
- Responsive grid system
- Consistent color scheme and spacing
- Smooth animations and transitions

## 🧪 Testing

### Manual Testing Steps

1. **Upload Flow**

   - Upload `test-data/valid-sample.csv`
   - Verify preview table shows data correctly

2. **Preprocessing**

   - Apply standardization
   - Check that new columns are created (\_scaled suffix)

3. **Split**

   - Select 80-20 split
   - Verify visual bar shows correct percentages
   - Check train/test previews

4. **Model Training**
   - Select Classification task
   - Choose Logistic Regression
   - Select target column
   - Train and verify results display

### Automated Tests

```bash
# Run backend tests (if implemented)
cd server
npm test

# Run frontend tests (if implemented)
cd frontend
npm test
```

## 📁 Sample Data

A sample CSV file is provided in `test-data/valid-sample.csv` for testing the pipeline.

## 🔧 Configuration

### Backend Configuration

- Port: 3001 (configurable in `server/src/index.js`)
- Upload directory: `server/uploads`
- CORS: Enabled for http://localhost:5173

### Frontend Configuration

- Port: 5173 (configurable in `vite.config.ts`)
- API Base URL: http://localhost:3001/api

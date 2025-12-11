# 🚀 ML Pipeline Builder

A visual, no-code machine learning pipeline platform built with React, TypeScript, and Node.js. Create end-to-end ML workflows without writing a single line of code!

## ✨ Features

### 🎯 Core Functionality

- **✅ File Upload**: Support for CSV and Excel files with validation
- **✅ Data Preprocessing**: Standardization and Normalization options
- **✅ Train-Test Split**: Configurable ratios (80-20, 70-30, 75-25)
- **✅ Model Selection**: Logistic Regression & Decision Tree
- **✅ Results Visualization**: Comprehensive metrics and charts

### 🎨 User Experience

- **Visual Pipeline Flow**: React Flow visualization showing all steps
- **Step-by-Step Navigation**: Sidebar with progress tracking
- **No Code Required**: 100% GUI-based interactions
- **Beginner-Friendly**: Helpful tooltips and explanations throughout
- **Responsive Design**: Works on desktop, tablet, and mobile

### 📊 Visualization & Output

- **Performance Metrics**: Accuracy, Precision, Recall, F1 Score (Classification) or R², RMSE, MAE (Regression)
- **Feature Importance Chart**: Interactive bar chart showing top contributing features
- **Predictions Table**: Sample predictions with actual vs predicted comparison
- **Export Functionality**: Download results as JSON

## 🏗️ Architecture

### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── steps/          # Pipeline step components
│   │   ├── pipeline/       # Reusable pipeline widgets
│   │   └── ui/            # Base UI components
│   ├── api/               # API client and endpoints
│   ├── store/             # Zustand state management
│   └── types/             # TypeScript type definitions
```

**Stack:**

- React 18 + TypeScript
- TailwindCSS for styling
- React Flow for pipeline visualization
- Recharts for data visualization
- Zustand for state management
- Vite for build tooling

### Backend

```
server/
├── src/
│   ├── routes/            # API endpoints
│   ├── utils/             # ML algorithms & data processing
│   │   ├── mlModels.js    # ML implementations
│   │   ├── metrics.js     # Performance metrics
│   │   └── dataProcessing.js
│   └── index.js           # Server entry point
```

**Stack:**

- Node.js + Express
- Custom ML implementations (Logistic Regression, Decision Tree, Random Forest)
- CSV/Excel parsing with xlsx
- In-memory data storage

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ (v22.18.0 recommended)
- npm or yarn

### Installation

1. **Clone the repository**

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

**Option 1: Run Both Servers Separately**

1. **Start Backend** (Terminal 1)

```bash
cd server
npm start
# Server runs on http://localhost:3001
```

2. **Start Frontend** (Terminal 2)

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**Option 2: PowerShell (Windows)**

```powershell
# Terminal 1 - Backend
cd "c:\Codes\Vizuara Assignment\server"
npm start

# Terminal 2 - Frontend
cd "c:\Codes\Vizuara Assignment\frontend"
npm run dev
```

3. **Open Browser**

```
Navigate to: http://localhost:5173
```

## 📖 User Guide

### Step-by-Step Workflow

#### 1️⃣ Upload Dataset

- Click the upload area or drag and drop a CSV/Excel file
- Supported formats: `.csv`, `.xlsx`, `.xls`
- Maximum file size: 50MB
- File should have column headers in the first row

#### 2️⃣ Preprocess Data (Optional)

- **Standardization**: Scales features to have mean=0 and std=1
- **Normalization**: Scales features to range [0, 1]
- Can skip this step if data is already clean

#### 3️⃣ Train-Test Split

- Choose split ratio: 80-20 (recommended), 70-30, or 75-25
- Training set: Used to train the model
- Test set: Used to evaluate model performance

#### 4️⃣ Select & Train Model

- Choose task type:
  - **Classification**: Predict categories (e.g., spam/not spam)
  - **Regression**: Predict numbers (e.g., prices)
- Select model:
  - **Logistic Regression**: Fast, interpretable linear classifier
  - **Decision Tree**: Handles non-linear patterns
- Select target column (what you want to predict)
- Click "Train Model"

#### 5️⃣ View Results

- **Execution Status**: Success/failure with training time
- **Performance Metrics**: Primary metric highlighted + detailed grid
- **Feature Importance**: Bar chart showing top contributing features
- **Sample Predictions**: Table with actual vs predicted values
- **Export**: Download results as JSON

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

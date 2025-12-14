# Model Evaluation & Comparison Tool

## Overview

A completely isolated module for evaluating and comparing multiple pre-trained machine learning models without requiring any training. This tool allows you to:

- Upload ground truth labels for your test dataset
- Upload predictions from multiple models
- Compare model performance with detailed metrics
- Visualize results with interactive charts

## Architecture

This module is **completely isolated** from the main ML Pipeline Builder:

### Backend Structure

```
server/src/modules/model-evaluation/
├── routes/
│   └── evaluation.routes.js     # API endpoints
├── services/
│   ├── csv.service.js          # CSV parsing and validation
│   ├── metrics.service.js      # Metrics calculation
│   └── storage.service.js      # In-memory storage
```

### Frontend Structure

```
frontend/src/modules/model-evaluation/
├── pages/
│   └── ModelEvaluationPage.tsx  # Main page with step flow
├── components/
│   ├── GroundTruthStep.tsx     # Step 1: Upload ground truth
│   ├── PredictionStep.tsx      # Step 2: Upload predictions
│   └── ComparisonStep.tsx      # Step 3: View comparison
├── api/
│   └── evaluation.api.ts       # API client
└── store/
    └── evaluationStore.ts      # Isolated Zustand store
```

## Usage

### Step 1: Upload Ground Truth

Upload a CSV file containing the actual labels for your test dataset.

**Required Format:**

```csv
id,actual
1,positive
2,negative
3,positive
...
```

**Requirements:**

- CSV file with headers
- Must contain `id` column (unique identifier for each sample)
- Must contain `actual` column (true labels)
- IDs must be unique

### Step 2: Upload Model Predictions

Add predictions from one or more models you want to compare.

**Required Format:**

```csv
id,predicted
1,positive
2,positive
3,negative
...
```

**Requirements:**

- CSV file with headers
- Must contain `id` column matching ground truth IDs
- Must contain `predicted` column (model predictions)
- Can upload multiple models

**Example:**

1. Upload predictions from Random Forest model
2. Upload predictions from XGBoost model
3. Upload predictions from Neural Network model
4. Continue to comparison

### Step 3: Compare Models

View comprehensive comparison results including:

#### Metrics Displayed:

- **Accuracy**: Overall correctness of predictions
- **Precision**: Proportion of positive predictions that are correct
- **Recall**: Proportion of actual positives correctly identified
- **F1 Score**: Harmonic mean of precision and recall

#### Visualizations:

- Bar chart comparing all metrics across models
- Confusion matrix for each model (TP, TN, FP, FN)
- Best model highlighted with crown icon
- Exportable results as CSV

## API Endpoints

All endpoints are prefixed with `/api/model-evaluation`

### POST /ground-truth

Upload ground truth CSV file.

**Request:**

- `Content-Type: multipart/form-data`
- `file`: CSV file

**Response:**

```json
{
  "success": true,
  "data": {
    "evaluationId": "uuid-string",
    "recordCount": 100,
    "preview": [...]
  }
}
```

### POST /:evaluationId/predictions

Upload model prediction CSV file.

**Request:**

- `Content-Type: multipart/form-data`
- `file`: CSV file
- `modelName`: String

**Response:**

```json
{
  "success": true,
  "data": {
    "modelId": "uuid-string",
    "modelName": "Random Forest",
    "metrics": {
      "accuracy": 0.85,
      "precision": 0.87,
      "recall": 0.83,
      "f1Score": 0.85
    },
    "recordCount": 100
  }
}
```

### GET /:evaluationId/results

Get comparison results for all models.

**Response:**

```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "uuid",
        "name": "Random Forest",
        "metrics": {...}
      }
    ],
    "comparison": {
      "bestModel": "Random Forest",
      "averageAccuracy": 0.83
    }
  }
}
```

## Technical Details

### State Management

- Uses isolated Zustand store (`useEvaluationStore`)
- No shared state with main pipeline
- Complete separation of concerns

### Error Handling

- Comprehensive validation at each step
- User-friendly error messages
- Automatic file cleanup
- Prevents invalid CSV formats

### File Upload

- Maximum file size: 10MB
- Only CSV files accepted
- Automatic validation of required columns
- Duplicate ID detection

### Storage

- In-memory storage for development
- Session-based evaluation IDs
- Automatic cleanup after processing
- Production-ready for database integration

## Integration

### How it's Integrated

1. **Route Added**: `/model-evaluation` route in App.tsx
2. **Landing Page Button**: "Model Evaluation Tool" button added to landing page
3. **Isolated Module**: No modifications to existing pipeline code
4. **Independent Navigation**: Direct access via landing page

### Zero Impact on Main Pipeline

- ✅ No shared state
- ✅ No shared components
- ✅ Separate API routes
- ✅ Isolated error boundaries
- ✅ Independent styling
- ✅ Separate upload directories

## Development

### Running Locally

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production

```bash
cd frontend
npm run build
```

### Testing

1. Navigate to http://localhost:5174
2. Click "Model Evaluation Tool" on landing page
3. Follow 3-step process to test functionality

## Future Enhancements

Potential improvements for future versions:

- Database integration for persistent storage
- Support for multi-class classification
- ROC curve and AUC visualization
- Cross-validation support
- Model explainability features
- Batch prediction upload
- Historical comparison across evaluations
- Export detailed reports (PDF/Excel)

## Troubleshooting

### "Evaluation not found" error

- Ensure ground truth was uploaded successfully
- Check that evaluation ID is valid
- Verify backend storage is working

### "Column not found" error

- Verify CSV has required columns (`id`, `actual` or `predicted`)
- Check CSV format (headers on first row)
- Ensure no extra spaces in column names

### "ID mismatch" warning

- Ground truth and prediction IDs must match
- Check for typos in ID column
- Verify all prediction IDs exist in ground truth

### File upload fails

- Check file size (max 10MB)
- Verify CSV format
- Ensure file is not corrupted

## License

MIT License - Part of ML Pipeline Builder Project

## Author

Created as an isolated module for the Vizuara Assignment project.

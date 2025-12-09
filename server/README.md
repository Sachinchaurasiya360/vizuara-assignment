# ML Pipeline Server

Backend server for the ML Pipeline Builder application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

- `POST /api/upload` - Upload dataset
- `POST /api/preprocess` - Preprocess data
- `POST /api/split` - Configure train-test split
- `POST /api/train` - Train ML model
- `GET /api/health` - Health check

## Features

- CSV and Excel file support
- Data preprocessing (missing values, encoding, scaling)
- Train-test split
- Multiple ML algorithms (Linear Regression, Logistic Regression, Decision Tree, Random Forest)
- Model evaluation metrics

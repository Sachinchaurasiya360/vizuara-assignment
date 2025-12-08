# ML Pipeline Backend

Production-ready backend for No-Code Machine Learning Pipeline Builder.

## Stack

- **Node.js** v18+ with TypeScript 5.3
- **Express** 4.18 for REST API
- **Zod** for request validation
- **Winston** for logging
- **Node-cache** for in-memory state management
- **PapaParse & XLSX** for CSV/Excel processing
- **ml.js** for machine learning models

## Architecture

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Error handling, validation
│   ├── routes/           # API routes
│   ├── utils/            # Cache & storage managers
│   ├── validators/       # Zod schemas
│   ├── types/            # TypeScript interfaces
│   ├── config/           # Configuration & logger
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── uploads/             # Temp file storage
└── temp/                # Processing files
```

## API Endpoints

### Upload

- `POST /api/upload` - Upload CSV/Excel file
- `GET /api/files/:fileId` - Get file info

### Preprocessing

- `POST /api/preprocess` - Apply transformations
  - Missing values: drop, mean, median, mode, constant
  - Scaling: standard, minmax, robust
  - Encoding: label, onehot, target

### Train-Test Split

- `POST /api/split` - Split dataset
  - Configurable test size (0.1-0.9)
  - Seeded shuffle for reproducibility
  - Stratification support

### Model Training

- `POST /api/train` - Train ML model
  - **Classification**: LogisticRegression, DecisionTree, RandomForest (fallback)
  - **Regression**: LinearRegression, DecisionTree, Ridge, Lasso
  - Metrics: Accuracy, Precision, Recall, F1, R², MAE, MSE, RMSE
  - Confusion matrix for classification

### Results

- `GET /api/results/:modelId` - Get training results
- `GET /api/pipeline/:fileId` - Get pipeline state
- `GET /api/health` - Health check

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Build

```bash
npm run build
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Frontend URL
- `MAX_FILE_SIZE` - Max upload size in bytes
- `CACHE_TTL` - Cache expiration time
- `RATE_LIMIT_MAX` - Max requests per window

## Features

### Memory Management

- Automatic cache cleanup every 5 minutes
- Emergency cleanup when memory > 1GB
- LRU strategy removes 25% oldest entries
- Graceful shutdown handling

### Security

- Helmet for HTTP headers
- CORS configuration
- Rate limiting (100 req/15min)
- Request validation with Zod
- File type validation
- Size limits

### Error Handling

- Global error handler
- Structured logging
- Validation error details
- Custom error codes

## Type Safety

All API requests/responses are fully typed with TypeScript and validated with Zod schemas.

## Scalability

- Stateless design (cache-based)
- Multi-user support via unique file IDs
- Memory-efficient DataFrame storage
- Automatic cleanup of old data

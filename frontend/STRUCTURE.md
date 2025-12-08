# ML Pipeline Builder - Folder Structure

```
frontend/
│
├── src/
│   │
│   ├── api/                          # API Layer
│   │   ├── client.ts                # Axios client with interceptors
│   │   └── pipeline.api.ts          # Pipeline-specific API endpoints
│   │
│   ├── components/
│   │   │
│   │   ├── ui/                      # Base UI Components (Shadcn-style)
│   │   │   ├── button.tsx          # Button component with variants
│   │   │   ├── card.tsx            # Card container component
│   │   │   ├── input.tsx           # Input field component
│   │   │   ├── select.tsx          # Select dropdown component
│   │   │   ├── table.tsx           # Table component
│   │   │   ├── label.tsx           # Form label component
│   │   │   ├── loader.tsx          # Loading spinner
│   │   │   ├── alert.tsx           # Alert/notification component
│   │   │   └── progress.tsx        # Progress bar component
│   │   │
│   │   ├── pipeline/               # ML Pipeline Components
│   │   │   ├── FileUpload.tsx              # File upload with drag-drop
│   │   │   ├── DataPreviewTable.tsx        # Data preview & stats
│   │   │   ├── PreprocessingOptions.tsx    # Preprocessing config
│   │   │   ├── TrainTestSplitSelector.tsx  # Train-test split
│   │   │   ├── ModelSelector.tsx           # Model selection & config
│   │   │   ├── MetricsCard.tsx             # Results & metrics
│   │   │   ├── PipelineNode.tsx            # Custom React Flow node
│   │   │   └── PipelineVisualization.tsx   # Pipeline flow diagram
│   │   │
│   │   ├── steps/                  # Step-by-step Components
│   │   │   ├── UploadStep.tsx      # Step 1: Upload
│   │   │   ├── PreprocessStep.tsx  # Step 2: Preprocess
│   │   │   ├── SplitStep.tsx       # Step 3: Split
│   │   │   ├── ModelStep.tsx       # Step 4: Model & Train
│   │   │   └── ResultsStep.tsx     # Step 5: Results
│   │   │
│   │   └── ErrorBoundary.tsx       # Error boundary wrapper
│   │
│   ├── store/                       # State Management
│   │   └── usePipelineStore.ts     # Zustand store for pipeline state
│   │
│   ├── types/                       # TypeScript Types
│   │   └── pipeline.types.ts       # All pipeline-related types
│   │
│   ├── lib/                         # Utilities
│   │   └── utils.ts                # Helper functions (cn, etc.)
│   │
│   ├── assets/                      # Static Assets
│   │
│   ├── App.tsx                      # Main App component
│   ├── App.css                      # App-specific styles
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles & Tailwind
│
├── public/                          # Public static files
│
├── .env.example                     # Environment variables template
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript base config
├── tsconfig.app.json               # TypeScript app config
├── tsconfig.node.json              # TypeScript Node config
├── vite.config.ts                  # Vite configuration
├── eslint.config.js                # ESLint configuration
└── README.md                        # Documentation
```

## Key Directories Explained

### `src/api/`

Contains all API-related code including the HTTP client and endpoint definitions.

### `src/components/ui/`

Reusable UI components styled with TailwindCSS following Shadcn UI patterns.

### `src/components/pipeline/`

ML pipeline-specific components that handle different aspects of the ML workflow.

### `src/components/steps/`

Top-level components for each step in the pipeline workflow.

### `src/store/`

Zustand state management for global application state.

### `src/types/`

Comprehensive TypeScript type definitions shared across the application.

### `src/lib/`

Utility functions and helpers used throughout the application.

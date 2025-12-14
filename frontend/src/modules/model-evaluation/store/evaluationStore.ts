import { create } from "zustand";

interface GroundTruthData {
  filename: string;
  rowCount: number;
  columns: string[];
}

interface Model {
  name: string;
  filename: string;
  rowCount: number;
  uploadedAt: string;
}

interface ComparisonResults {
  models: ModelComparison[];
  totalModels: number;
  bestModel: ModelComparison | null;
}

interface ModelComparison {
  modelName: string;
  modelId: string;
  metrics?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: {
      tp: number;
      tn: number;
      fp: number;
      fn: number;
    };
    totalSamples: number;
  };
  error?: string;
}

interface EvaluationStore {
  currentStep: number;
  evaluationId: string | null;
  groundTruth: GroundTruthData | null;
  groundTruthFile: File | null;
  models: Model[];
  comparisonResults: ComparisonResults | null;
  isUploadingGroundTruth: boolean;
  isUploadingPrediction: boolean;
  isLoadingResults: boolean;
  error: string | null;
  setCurrentStep: (step: number) => void;
  setEvaluationId: (id: string) => void;
  setGroundTruth: (data: GroundTruthData | null, file: File | null) => void;
  addModel: (model: Model) => void;
  setComparisonResults: (results: ComparisonResults | null) => void;
  setUploadingGroundTruth: (isUploading: boolean) => void;
  setUploadingPrediction: (isUploading: boolean) => void;
  setLoadingResults: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Isolated store for Model Evaluation module
 * Does not interact with main pipeline store
 */
export const useEvaluationStore = create<EvaluationStore>((set, get) => ({
  // Current step in evaluation flow
  currentStep: 1,

  // Evaluation ID (generated when ground truth is uploaded)
  evaluationId: null,

  // Ground truth data
  groundTruth: null,
  groundTruthFile: null,

  // Models being evaluated
  models: [],

  // Comparison results
  comparisonResults: null,

  // Loading states
  isUploadingGroundTruth: false,
  isUploadingPrediction: false,
  isLoadingResults: false,

  // Error handling
  error: null,

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),

  setEvaluationId: (id) => set({ evaluationId: id }),

  setGroundTruth: (data, file) =>
    set({ groundTruth: data, groundTruthFile: file }),

  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),

  setComparisonResults: (results) => set({ comparisonResults: results }),

  setUploadingGroundTruth: (isUploading) =>
    set({ isUploadingGroundTruth: isUploading }),

  setUploadingPrediction: (isUploading) =>
    set({ isUploadingPrediction: isUploading }),

  setLoadingResults: (isLoading) => set({ isLoadingResults: isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      currentStep: 1,
      evaluationId: null,
      groundTruth: null,
      groundTruthFile: null,
      models: [],
      comparisonResults: null,
      isUploadingGroundTruth: false,
      isUploadingPrediction: false,
      isLoadingResults: false,
      error: null,
    }),
}));

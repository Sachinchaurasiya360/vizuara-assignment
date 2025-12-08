import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  PipelineState,
  PipelineStepType,
  FileUploadResponse,
  PreprocessingConfig,
  TrainTestSplitConfig,
  ModelConfig,
  TrainingResponse,
} from '@/types/pipeline.types';

interface PipelineStore extends PipelineState {
  // Actions
  setCurrentStep: (step: PipelineStepType) => void;
  setUploadedFile: (file: FileUploadResponse) => void;
  setPreprocessingConfig: (config: PreprocessingConfig) => void;
  setSplitConfig: (config: TrainTestSplitConfig) => void;
  setModelConfig: (config: ModelConfig) => void;
  setResults: (results: TrainingResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateStepStatus: (stepType: PipelineStepType, status: PipelineState['steps'][0]['status']) => void;
  resetPipeline: () => void;
  goToStep: (step: PipelineStepType) => void;
}

const initialSteps = [
  { id: 'upload', type: 'upload' as PipelineStepType, status: 'pending' as const },
  { id: 'preprocess', type: 'preprocess' as PipelineStepType, status: 'pending' as const },
  { id: 'split', type: 'split' as PipelineStepType, status: 'pending' as const },
  { id: 'model', type: 'model' as PipelineStepType, status: 'pending' as const },
  { id: 'results', type: 'results' as PipelineStepType, status: 'pending' as const },
];

const initialState: PipelineState = {
  steps: initialSteps,
  currentStep: 'upload',
  uploadedFile: null,
  preprocessingConfig: null,
  splitConfig: null,
  modelConfig: null,
  results: null,
  isLoading: false,
  error: null,
};

export const usePipelineStore = create<PipelineStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCurrentStep: (step) =>
        set({ currentStep: step }, false, 'setCurrentStep'),

      setUploadedFile: (file) =>
        set(
          (state) => ({
            uploadedFile: file,
            steps: state.steps.map((s) =>
              s.type === 'upload' ? { ...s, status: 'completed' as const, data: file } : s
            ),
          }),
          false,
          'setUploadedFile'
        ),

      setPreprocessingConfig: (config) =>
        set(
          (state) => ({
            preprocessingConfig: config,
            steps: state.steps.map((s) =>
              s.type === 'preprocess' ? { ...s, status: 'completed' as const, data: config } : s
            ),
          }),
          false,
          'setPreprocessingConfig'
        ),

      setSplitConfig: (config) =>
        set(
          (state) => ({
            splitConfig: config,
            steps: state.steps.map((s) =>
              s.type === 'split' ? { ...s, status: 'completed' as const, data: config } : s
            ),
          }),
          false,
          'setSplitConfig'
        ),

      setModelConfig: (config) =>
        set(
          (state) => ({
            modelConfig: config,
            steps: state.steps.map((s) =>
              s.type === 'model' ? { ...s, status: 'completed' as const, data: config } : s
            ),
          }),
          false,
          'setModelConfig'
        ),

      setResults: (results) =>
        set(
          (state) => ({
            results,
            steps: state.steps.map((s) =>
              s.type === 'results' ? { ...s, status: 'completed' as const, data: results } : s
            ),
          }),
          false,
          'setResults'
        ),

      setLoading: (loading) =>
        set({ isLoading: loading }, false, 'setLoading'),

      setError: (error) =>
        set({ error }, false, 'setError'),

      updateStepStatus: (stepType, status) =>
        set(
          (state) => ({
            steps: state.steps.map((s) =>
              s.type === stepType ? { ...s, status } : s
            ),
          }),
          false,
          'updateStepStatus'
        ),

      resetPipeline: () =>
        set(initialState, false, 'resetPipeline'),

      goToStep: (step) =>
        set({ currentStep: step }, false, 'goToStep'),
    }),
    { name: 'pipeline-store' }
  )
);

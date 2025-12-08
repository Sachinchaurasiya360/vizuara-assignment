import { apiClient } from "./client";
import type {
  FileUploadResponse,
  PreprocessingConfig,
  PreprocessingResponse,
  TrainTestSplitConfig,
  TrainTestSplitResponse,
  ModelConfig,
  TrainingResponse,
} from "@/types/pipeline.types";

// ============================================
// File Upload APIs
// ============================================

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<FileUploadResponse> => {
  const response = await apiClient.uploadFile("/upload", file, onProgress);
  return response.data as FileUploadResponse;
};

export const getFilePreview = async (
  fileId: string
): Promise<FileUploadResponse> => {
  const response = await apiClient.get<FileUploadResponse>(
    `/files/${fileId}/preview`
  );
  return response.data!;
};

// ============================================
// Preprocessing APIs
// ============================================

export const preprocessData = async (
  fileId: string,
  config: PreprocessingConfig
): Promise<PreprocessingResponse> => {
  const response = await apiClient.post<PreprocessingResponse>("/preprocess", {
    fileId,
    config,
  });
  return response.data!;
};

export const getPreprocessingPreview = async (
  fileId: string,
  config: PreprocessingConfig
): Promise<PreprocessingResponse> => {
  const response = await apiClient.post<PreprocessingResponse>(
    "/preprocess/preview",
    {
      fileId,
      config,
    }
  );
  return response.data!;
};

// ============================================
// Train-Test Split APIs
// ============================================

export const splitData = async (
  fileId: string,
  config: TrainTestSplitConfig
): Promise<TrainTestSplitResponse> => {
  const response = await apiClient.post<TrainTestSplitResponse>("/split", {
    fileId,
    config,
  });
  return response.data!;
};

// ============================================
// Model Training APIs
// ============================================

export const trainModel = async (
  fileId: string,
  modelConfig: ModelConfig,
  splitConfig: TrainTestSplitConfig
): Promise<TrainingResponse> => {
  const response = await apiClient.post<TrainingResponse>("/train", {
    fileId,
    modelConfig,
    splitConfig,
  });
  return response.data!;
};

export const getModelResults = async (
  modelId: string
): Promise<TrainingResponse> => {
  const response = await apiClient.get<TrainingResponse>(
    `/models/${modelId}/results`
  );
  return response.data!;
};

// ============================================
// Pipeline Management APIs
// ============================================

export const savePipeline = async (
  pipelineData: unknown
): Promise<{ pipelineId: string }> => {
  const response = await apiClient.post<{ pipelineId: string }>(
    "/pipelines",
    pipelineData
  );
  return response.data!;
};

export const getPipeline = async (pipelineId: string): Promise<unknown> => {
  const response = await apiClient.get(`/pipelines/${pipelineId}`);
  return response.data;
};

export const listPipelines = async (): Promise<unknown[]> => {
  const response = await apiClient.get<unknown[]>("/pipelines");
  return response.data!;
};

export const deletePipeline = async (pipelineId: string): Promise<void> => {
  await apiClient.delete(`/pipelines/${pipelineId}`);
};

// ============================================
// Export Predictions
// ============================================

export const exportPredictions = async (
  modelId: string,
  format: "csv" | "json"
): Promise<Blob> => {
  const response = await apiClient.get(
    `/models/${modelId}/export?format=${format}`
  );
  return response.data as unknown as Blob;
};

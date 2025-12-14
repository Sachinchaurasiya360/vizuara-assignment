import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://vizuara-backends.vercel.app/";

/**
 * Upload ground truth CSV
 */
export async function uploadGroundTruth(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/api/model-evaluation/ground-truth`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

/**
 * Upload prediction CSV for a model
 */
export async function uploadPredictions(
  evaluationId: string,
  modelName: string,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("modelName", modelName);

  const response = await axios.post(
    `${API_URL}/api/model-evaluation/${evaluationId}/predictions`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

/**
 * Get comparison results for all models
 */
export async function getComparisonResults(evaluationId: string) {
  const response = await axios.get(
    `${API_URL}/api/model-evaluation/${evaluationId}/results`
  );

  const { data } = response.data;

  // Transform backend response to match frontend structure
  return {
    models: data.models.map((m: any) => ({
      modelName: m.name,
      modelId: m.id,
      metrics: m.metrics,
    })),
    totalModels: data.models.length,
    bestModel: data.comparison.bestModel
      ? {
          modelName: data.comparison.bestModel.name,
          modelId: data.comparison.bestModel.id,
          metrics: data.comparison.bestModel.metrics,
        }
      : null,
  };
}

/**
 * Get detailed results for a specific model
 */
export async function getModelResults(evaluationId: string, modelId: string) {
  const response = await axios.get(
    `${API_URL}/api/model-evaluation/${evaluationId}/model/${modelId}`
  );

  return response.data;
}

/**
 * In-memory storage for evaluation sessions
 * In production, this should be replaced with a database
 */
const evaluations = new Map();

/**
 * Save evaluation session
 */
export function saveEvaluation(evaluationId, data) {
  if (!evaluationId) {
    throw new Error("Evaluation ID is required");
  }

  if (!evaluations.has(evaluationId)) {
    evaluations.set(evaluationId, {
      id: evaluationId,
      createdAt: new Date().toISOString(),
      groundTruth: null,
      models: [],
    });
  }

  const evaluation = evaluations.get(evaluationId);

  // Update ground truth if provided
  if (data.groundTruth) {
    evaluation.groundTruth = data.groundTruth;
  }

  // Add model if provided
  if (data.model) {
    // Check if model already exists (prevent duplicates)
    const existingModelIndex = evaluation.models.findIndex(
      (m) => m.modelName === data.model.modelName
    );

    if (existingModelIndex >= 0) {
      // Update existing model
      evaluation.models[existingModelIndex] = data.model;
    } else {
      // Add new model
      evaluation.models.push(data.model);
    }
  }

  evaluation.updatedAt = new Date().toISOString();
  evaluations.set(evaluationId, evaluation);

  return evaluation;
}

/**
 * Get evaluation session
 */
export function getEvaluation(evaluationId) {
  if (!evaluationId) {
    throw new Error("Evaluation ID is required");
  }

  return evaluations.get(evaluationId) || null;
}

/**
 * Delete evaluation session
 */
export function deleteEvaluation(evaluationId) {
  if (!evaluationId) {
    throw new Error("Evaluation ID is required");
  }

  return evaluations.delete(evaluationId);
}

/**
 * Get all evaluations (for debugging/admin)
 */
export function getAllEvaluations() {
  return Array.from(evaluations.values());
}

/**
 * Clear all evaluations (for testing)
 */
export function clearAllEvaluations() {
  evaluations.clear();
}

import fs from "fs";
import csvParser from "csv-parser";

/**
 * Parse CSV file for evaluation
 */
export async function parseEvaluationCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

/**
 * Validate ground truth CSV format
 * Required columns: id, actual
 */
export function validateGroundTruthCSV(data) {
  if (!data || data.length === 0) {
    return {
      valid: false,
      error: "CSV file is empty",
    };
  }

  const firstRow = data[0];
  const hasId = "id" in firstRow || "ID" in firstRow;
  const hasActual = "actual" in firstRow || "Actual" in firstRow;

  if (!hasId) {
    return {
      valid: false,
      error: 'Ground truth CSV must contain an "id" column',
    };
  }

  if (!hasActual) {
    return {
      valid: false,
      error: 'Ground truth CSV must contain an "actual" column',
    };
  }

  // Check for duplicate IDs
  const ids = data.map((row) => row.id || row.ID);
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    return {
      valid: false,
      error: "Ground truth CSV contains duplicate IDs",
    };
  }

  // Check for missing values
  const missingIds = data.filter((row) => !row.id && !row.ID).length;
  const missingActual = data.filter(
    (row) => !row.actual && !row.Actual && row.actual !== 0 && row.Actual !== 0
  ).length;

  if (missingIds > 0 || missingActual > 0) {
    return {
      valid: false,
      error: `CSV contains ${missingIds} missing IDs and ${missingActual} missing actual values`,
    };
  }

  return { valid: true };
}

/**
 * Validate prediction CSV format
 * Required columns: id, predicted
 * Optional: probability
 */
export function validatePredictionCSV(data) {
  if (!data || data.length === 0) {
    return {
      valid: false,
      error: "CSV file is empty",
    };
  }

  const firstRow = data[0];
  const hasId = "id" in firstRow || "ID" in firstRow;
  const hasPredicted = "predicted" in firstRow || "Predicted" in firstRow;

  if (!hasId) {
    return {
      valid: false,
      error: 'Predictions CSV must contain an "id" column',
    };
  }

  if (!hasPredicted) {
    return {
      valid: false,
      error: 'Predictions CSV must contain a "predicted" column',
    };
  }

  // Check for duplicate IDs
  const ids = data.map((row) => row.id || row.ID);
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    return {
      valid: false,
      error: "Predictions CSV contains duplicate IDs",
    };
  }

  // Check for missing values
  const missingIds = data.filter((row) => !row.id && !row.ID).length;
  const missingPredicted = data.filter(
    (row) =>
      !row.predicted &&
      !row.Predicted &&
      row.predicted !== 0 &&
      row.Predicted !== 0
  ).length;

  if (missingIds > 0 || missingPredicted > 0) {
    return {
      valid: false,
      error: `CSV contains ${missingIds} missing IDs and ${missingPredicted} missing predicted values`,
    };
  }

  return { valid: true };
}

/**
 * Align predictions with ground truth by ID
 */
export function alignPredictions(groundTruth, predictions) {
  const groundTruthMap = new Map();

  // Build ground truth map (case-insensitive column names)
  groundTruth.forEach((row) => {
    const id = row.id || row.ID;
    const actual = row.actual || row.Actual;
    groundTruthMap.set(String(id), actual);
  });

  const aligned = {
    actual: [],
    predicted: [],
    probabilities: [],
    predictions: [],
    mismatches: [],
  };

  // Align predictions (case-insensitive column names)
  predictions.forEach((row) => {
    const id = String(row.id || row.ID);
    const predicted = row.predicted || row.Predicted;
    const probability =
      row.probability || row.Probability || row.prob || row.Prob;

    if (groundTruthMap.has(id)) {
      const actual = groundTruthMap.get(id);

      aligned.actual.push(actual);
      aligned.predicted.push(predicted);

      if (probability !== undefined && probability !== null) {
        aligned.probabilities.push(parseFloat(probability));
      }

      aligned.predictions.push({
        id,
        actual,
        predicted,
        probability: probability ? parseFloat(probability) : undefined,
      });
    } else {
      aligned.mismatches.push(id);
    }
  });

  return aligned;
}

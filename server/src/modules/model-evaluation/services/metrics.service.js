/**
 * Calculate comprehensive classification metrics
 */
export function calculateMetrics(actual, predicted) {
  if (actual.length !== predicted.length) {
    throw new Error("Actual and predicted arrays must have the same length");
  }

  if (actual.length === 0) {
    throw new Error("Cannot calculate metrics on empty arrays");
  }

  // Calculate confusion matrix
  const confusionMatrix = calculateConfusionMatrix(actual, predicted);

  // Calculate metrics from confusion matrix
  const accuracy = calculateAccuracy(confusionMatrix);
  const precision = calculatePrecision(confusionMatrix);
  const recall = calculateRecall(confusionMatrix);
  const f1Score = calculateF1Score(precision, recall);

  // Get unique classes
  const uniqueClasses = [
    ...new Set([...actual.map(String), ...predicted.map(String)]),
  ].sort();

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix,
    classes: uniqueClasses,
    totalSamples: actual.length,
  };
}

/**
 * Calculate confusion matrix
 */
function calculateConfusionMatrix(actual, predicted) {
  const classes = [
    ...new Set([...actual.map(String), ...predicted.map(String)]),
  ].sort();

  const matrix = {};

  // Initialize matrix
  classes.forEach((actualClass) => {
    matrix[actualClass] = {};
    classes.forEach((predictedClass) => {
      matrix[actualClass][predictedClass] = 0;
    });
  });

  // Fill matrix
  for (let i = 0; i < actual.length; i++) {
    const actualClass = String(actual[i]);
    const predictedClass = String(predicted[i]);
    matrix[actualClass][predictedClass]++;
  }

  return matrix;
}

/**
 * Calculate accuracy
 */
function calculateAccuracy(confusionMatrix) {
  let correct = 0;
  let total = 0;

  Object.keys(confusionMatrix).forEach((actualClass) => {
    Object.keys(confusionMatrix[actualClass]).forEach((predictedClass) => {
      const count = confusionMatrix[actualClass][predictedClass];
      total += count;
      if (actualClass === predictedClass) {
        correct += count;
      }
    });
  });

  return total > 0 ? correct / total : 0;
}

/**
 * Calculate precision (macro-averaged for multi-class)
 */
function calculatePrecision(confusionMatrix) {
  const classes = Object.keys(confusionMatrix);
  let precisionSum = 0;

  classes.forEach((targetClass) => {
    let truePositives = confusionMatrix[targetClass][targetClass] || 0;
    let falsePositives = 0;

    // Calculate false positives (predicted as targetClass but actually other classes)
    classes.forEach((actualClass) => {
      if (actualClass !== targetClass) {
        falsePositives += confusionMatrix[actualClass][targetClass] || 0;
      }
    });

    const total = truePositives + falsePositives;
    const precision = total > 0 ? truePositives / total : 0;
    precisionSum += precision;
  });

  return classes.length > 0 ? precisionSum / classes.length : 0;
}

/**
 * Calculate recall (macro-averaged for multi-class)
 */
function calculateRecall(confusionMatrix) {
  const classes = Object.keys(confusionMatrix);
  let recallSum = 0;

  classes.forEach((targetClass) => {
    let truePositives = confusionMatrix[targetClass][targetClass] || 0;
    let falseNegatives = 0;

    // Calculate false negatives (actually targetClass but predicted as other classes)
    Object.keys(confusionMatrix[targetClass]).forEach((predictedClass) => {
      if (predictedClass !== targetClass) {
        falseNegatives += confusionMatrix[targetClass][predictedClass] || 0;
      }
    });

    const total = truePositives + falseNegatives;
    const recall = total > 0 ? truePositives / total : 0;
    recallSum += recall;
  });

  return classes.length > 0 ? recallSum / classes.length : 0;
}

/**
 * Calculate F1 score
 */
function calculateF1Score(precision, recall) {
  if (precision + recall === 0) {
    return 0;
  }
  return (2 * precision * recall) / (precision + recall);
}

/**
 * Compare multiple models
 */
export function compareModels(models) {
  if (!models || models.length === 0) {
    return {
      comparison: [],
      bestModel: null,
    };
  }

  // Sort models by F1 score (descending)
  const sortedModels = [...models].sort(
    (a, b) => b.metrics.f1Score - a.metrics.f1Score
  );

  const comparison = sortedModels.map((model, index) => ({
    rank: index + 1,
    modelName: model.modelName,
    accuracy: model.metrics.accuracy,
    precision: model.metrics.precision,
    recall: model.metrics.recall,
    f1Score: model.metrics.f1Score,
    totalSamples: model.metrics.totalSamples,
  }));

  return {
    comparison,
    bestModel: sortedModels[0],
  };
}

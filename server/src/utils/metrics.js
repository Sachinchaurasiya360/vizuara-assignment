/**
 * Calculate regression metrics
 */
export function calculateRegressionMetrics(yTrue, yPred) {
  const n = yTrue.length;

  // Mean Absolute Error
  const mae =
    yTrue.reduce((sum, val, i) => sum + Math.abs(val - yPred[i]), 0) / n;

  // Mean Squared Error
  const mse =
    yTrue.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0) / n;

  // Root Mean Squared Error
  const rmse = Math.sqrt(mse);

  // R² Score
  const yMean = yTrue.reduce((a, b) => a + b, 0) / n;
  const ssTot = yTrue.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const ssRes = yTrue.reduce(
    (sum, val, i) => sum + Math.pow(val - yPred[i], 2),
    0
  );
  const r2 = 1 - ssRes / ssTot;

  return {
    mae: mae.toFixed(4),
    mse: mse.toFixed(4),
    rmse: rmse.toFixed(4),
    r2: r2.toFixed(4),
  };
}

/**
 * Calculate classification metrics
 */
export function calculateClassificationMetrics(yTrue, yPred) {
  const n = yTrue.length;

  // Confusion matrix
  let tp = 0,
    tn = 0,
    fp = 0,
    fn = 0;

  for (let i = 0; i < n; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
  }

  // Accuracy
  const accuracy = (tp + tn) / n;

  // Precision
  const precision = tp / (tp + fp) || 0;

  // Recall
  const recall = tp / (tp + fn) || 0;

  // F1 Score
  const f1 = (2 * (precision * recall)) / (precision + recall) || 0;

  return {
    accuracy: accuracy.toFixed(4),
    precision: precision.toFixed(4),
    recall: recall.toFixed(4),
    f1Score: f1.toFixed(4),
    confusionMatrix: {
      truePositive: tp,
      trueNegative: tn,
      falsePositive: fp,
      falseNegative: fn,
    },
  };
}

/**
 * Generate feature importance (simplified)
 */
export function calculateFeatureImportance(X, y, predictions, featureNames) {
  const n = X.length;
  const m = X[0].length;
  const importance = [];

  for (let i = 0; i < m; i++) {
    const values = X.map((row) => row[i]);
    const variance = calculateVariance(values);
    importance.push({
      feature: featureNames[i] || `Feature ${i + 1}`,
      importance: variance.toFixed(4),
    });
  }

  // Normalize importance
  const total = importance.reduce(
    (sum, item) => sum + parseFloat(item.importance),
    0
  );
  importance.forEach((item) => {
    item.importance =
      ((parseFloat(item.importance) / total) * 100).toFixed(2) + "%";
  });

  return importance.sort(
    (a, b) => parseFloat(b.importance) - parseFloat(a.importance)
  );
}

function calculateVariance(values) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
}

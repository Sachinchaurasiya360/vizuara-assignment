/**
 * Calculate regression metrics
 */
export function calculateRegressionMetrics(yTrue, yPred) {
  const n = yTrue.length;

  if (n === 0) {
    throw new Error("Cannot calculate metrics on empty arrays");
  }

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
    mae: Number(mae.toFixed(4)),
    mse: Number(mse.toFixed(4)),
    rmse: Number(rmse.toFixed(4)),
    r2Score: Number(r2.toFixed(4)),
  };
}

/**
 * Calculate classification metrics
 */
export function calculateClassificationMetrics(yTrue, yPred) {
  const n = yTrue.length;

  if (n === 0) {
    throw new Error("Cannot calculate metrics on empty arrays");
  }

  if (yTrue.length !== yPred.length) {
    throw new Error(
      `Array length mismatch: yTrue=${yTrue.length}, yPred=${yPred.length}`
    );
  }

  // Confusion matrix - Convert to binary for consistency
  let tp = 0,
    tn = 0,
    fp = 0,
    fn = 0;

  for (let i = 0; i < n; i++) {
    const trueVal = Number(yTrue[i]);
    const predVal = Number(yPred[i]);

    if (trueVal === 1 && predVal === 1) tp++;
    else if (trueVal === 0 && predVal === 0) tn++;
    else if (trueVal === 0 && predVal === 1) fp++;
    else if (trueVal === 1 && predVal === 0) fn++;
  }

  // Validate confusion matrix is not all zeros
  if (tp === 0 && tn === 0 && fp === 0 && fn === 0) {
    console.warn(
      "⚠️ [WARNING] Confusion matrix is all zeros - check data labels"
    );
    console.warn(`Sample labels - yTrue: [${yTrue.slice(0, 5).join(", ")}...]`);
    console.warn(
      `Sample predictions - yPred: [${yPred.slice(0, 5).join(", ")}...]`
    );
  }

  // Accuracy
  const accuracy = n > 0 ? (tp + tn) / n : 0;

  // Precision - handle division by zero
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;

  // Recall - handle division by zero
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;

  // F1 Score - handle division by zero
  const f1 =
    precision + recall > 0
      ? (2 * (precision * recall)) / (precision + recall)
      : 0;

  console.log(
    `📊 [METRICS] Confusion Matrix - TP: ${tp}, TN: ${tn}, FP: ${fp}, FN: ${fn}`
  );
  console.log(
    `📊 [METRICS] Accuracy: ${(accuracy * 100).toFixed(2)}%, Precision: ${(
      precision * 100
    ).toFixed(2)}%, Recall: ${(recall * 100).toFixed(2)}%, F1: ${(
      f1 * 100
    ).toFixed(2)}%`
  );

  return {
    accuracy: Number(accuracy.toFixed(4)),
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1.toFixed(4)),
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
      importance: parseFloat(variance.toFixed(4)),
    });
  }

  // Normalize importance to percentages (0-100)
  const total = importance.reduce((sum, item) => sum + item.importance, 0);

  if (total > 0) {
    importance.forEach((item) => {
      item.importance = parseFloat(
        ((item.importance / total) * 100).toFixed(2)
      );
    });
  }

  return importance.sort((a, b) => b.importance - a.importance);
}

function calculateVariance(values) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
}

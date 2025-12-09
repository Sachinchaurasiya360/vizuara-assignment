/**
 * Linear Regression implementation
 */
export class LinearRegression {
  constructor() {
    this.coefficients = null;
    this.intercept = null;
  }

  fit(X, y) {
    const n = X.length;
    const m = X[0].length;

    // Add bias term
    const XWithBias = X.map((row) => [1, ...row]);

    // Normal equation: theta = (X^T X)^-1 X^T y
    const XT = this.transpose(XWithBias);
    const XTX = this.matrixMultiply(XT, XWithBias);
    const XTXInv = this.matrixInverse(XTX);
    const XTy = this.matrixVectorMultiply(XT, y);
    const theta = this.matrixVectorMultiply(XTXInv, XTy);

    this.intercept = theta[0];
    this.coefficients = theta.slice(1);
  }

  predict(X) {
    return X.map((row) => {
      let sum = this.intercept;
      for (let i = 0; i < this.coefficients.length; i++) {
        sum += this.coefficients[i] * row[i];
      }
      return sum;
    });
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  matrixMultiply(A, B) {
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < A[0].length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  matrixVectorMultiply(A, b) {
    return A.map((row) => row.reduce((sum, val, i) => sum + val * b[i], 0));
  }

  matrixInverse(matrix) {
    const n = matrix.length;
    const identity = Array(n)
      .fill()
      .map((_, i) =>
        Array(n)
          .fill()
          .map((_, j) => (i === j ? 1 : 0))
      );

    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);

    // Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      const pivot = augmented[i][i];
      if (Math.abs(pivot) < 1e-10) {
        throw new Error("Matrix is singular");
      }

      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    return augmented.map((row) => row.slice(n));
  }
}

/**
 * Logistic Regression implementation
 */
export class LogisticRegression {
  constructor(learningRate = 0.01, iterations = 1000) {
    this.learningRate = learningRate;
    this.iterations = iterations;
    this.coefficients = null;
    this.intercept = null;
  }

  sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

  fit(X, y) {
    const n = X.length;
    const m = X[0].length;

    // Initialize weights
    this.coefficients = Array(m).fill(0);
    this.intercept = 0;

    // Gradient descent
    for (let iter = 0; iter < this.iterations; iter++) {
      const predictions = X.map((row, i) => {
        let z = this.intercept;
        for (let j = 0; j < m; j++) {
          z += this.coefficients[j] * row[j];
        }
        return this.sigmoid(z);
      });

      // Update weights
      const interceptGrad =
        predictions.reduce((sum, pred, i) => sum + (pred - y[i]), 0) / n;
      this.intercept -= this.learningRate * interceptGrad;

      for (let j = 0; j < m; j++) {
        const grad =
          predictions.reduce(
            (sum, pred, i) => sum + (pred - y[i]) * X[i][j],
            0
          ) / n;
        this.coefficients[j] -= this.learningRate * grad;
      }
    }
  }

  predict(X) {
    return X.map((row) => {
      let z = this.intercept;
      for (let i = 0; i < this.coefficients.length; i++) {
        z += this.coefficients[i] * row[i];
      }
      return this.sigmoid(z);
    });
  }

  predictClass(X, threshold = 0.5) {
    return this.predict(X).map((prob) => (prob >= threshold ? 1 : 0));
  }
}

/**
 * Decision Tree implementation (simplified)
 */
export class DecisionTree {
  constructor(maxDepth = 5, minSamples = 2) {
    this.maxDepth = maxDepth;
    this.minSamples = minSamples;
    this.tree = null;
    this.taskType = "classification";
  }

  fit(X, y, taskType = "classification") {
    this.taskType = taskType;
    this.tree = this.buildTree(X, y, 0);
  }

  buildTree(X, y, depth) {
    const n = X.length;

    if (n < this.minSamples || depth >= this.maxDepth) {
      return this.createLeaf(y);
    }

    const split = this.findBestSplit(X, y);
    if (!split) {
      return this.createLeaf(y);
    }

    const { featureIndex, threshold, leftIndices, rightIndices } = split;

    const leftX = leftIndices.map((i) => X[i]);
    const leftY = leftIndices.map((i) => y[i]);
    const rightX = rightIndices.map((i) => X[i]);
    const rightY = rightIndices.map((i) => y[i]);

    return {
      featureIndex,
      threshold,
      left: this.buildTree(leftX, leftY, depth + 1),
      right: this.buildTree(rightX, rightY, depth + 1),
    };
  }

  createLeaf(y) {
    if (this.taskType === "classification") {
      const counts = {};
      y.forEach((val) => (counts[val] = (counts[val] || 0) + 1));
      const prediction = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );
      return { value: Number(prediction) };
    } else {
      const mean = y.reduce((a, b) => a + b, 0) / y.length;
      return { value: mean };
    }
  }

  findBestSplit(X, y) {
    const n = X.length;
    const m = X[0].length;
    let bestGain = -Infinity;
    let bestSplit = null;

    for (let featureIndex = 0; featureIndex < m; featureIndex++) {
      const values = X.map((row) => row[featureIndex]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);

      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        const leftIndices = [];
        const rightIndices = [];

        X.forEach((row, idx) => {
          if (row[featureIndex] <= threshold) {
            leftIndices.push(idx);
          } else {
            rightIndices.push(idx);
          }
        });

        if (leftIndices.length === 0 || rightIndices.length === 0) continue;

        const gain = this.calculateGain(y, leftIndices, rightIndices);
        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { featureIndex, threshold, leftIndices, rightIndices };
        }
      }
    }

    return bestSplit;
  }

  calculateGain(y, leftIndices, rightIndices) {
    const n = y.length;
    const leftY = leftIndices.map((i) => y[i]);
    const rightY = rightIndices.map((i) => y[i]);

    const parentImpurity = this.calculateImpurity(y);
    const leftImpurity = this.calculateImpurity(leftY);
    const rightImpurity = this.calculateImpurity(rightY);

    const gain =
      parentImpurity -
      ((leftIndices.length / n) * leftImpurity +
        (rightIndices.length / n) * rightImpurity);

    return gain;
  }

  calculateImpurity(y) {
    if (this.taskType === "classification") {
      // Gini impurity
      const counts = {};
      y.forEach((val) => (counts[val] = (counts[val] || 0) + 1));
      const n = y.length;
      let gini = 1;
      Object.values(counts).forEach((count) => {
        const p = count / n;
        gini -= p * p;
      });
      return gini;
    } else {
      // Variance for regression
      const mean = y.reduce((a, b) => a + b, 0) / y.length;
      const variance =
        y.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / y.length;
      return variance;
    }
  }

  predict(X) {
    return X.map((row) => this.predictOne(row, this.tree));
  }

  predictOne(row, node) {
    if (node.value !== undefined) {
      return node.value;
    }

    if (row[node.featureIndex] <= node.threshold) {
      return this.predictOne(row, node.left);
    } else {
      return this.predictOne(row, node.right);
    }
  }
}

/**
 * Random Forest implementation
 */
export class RandomForest {
  constructor(nTrees = 10, maxDepth = 5, minSamples = 2) {
    this.nTrees = nTrees;
    this.maxDepth = maxDepth;
    this.minSamples = minSamples;
    this.trees = [];
    this.taskType = "classification";
  }

  fit(X, y, taskType = "classification") {
    this.taskType = taskType;
    this.trees = [];

    for (let i = 0; i < this.nTrees; i++) {
      const { bootX, bootY } = this.bootstrap(X, y);
      const tree = new DecisionTree(this.maxDepth, this.minSamples);
      tree.fit(bootX, bootY, taskType);
      this.trees.push(tree);
    }
  }

  bootstrap(X, y) {
    const n = X.length;
    const bootX = [];
    const bootY = [];

    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * n);
      bootX.push(X[idx]);
      bootY.push(y[idx]);
    }

    return { bootX, bootY };
  }

  predict(X) {
    const predictions = this.trees.map((tree) => tree.predict(X));

    if (this.taskType === "classification") {
      return X.map((_, i) => {
        const votes = predictions.map((pred) => pred[i]);
        const counts = {};
        votes.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
        return Number(
          Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))
        );
      });
    } else {
      return X.map((_, i) => {
        const values = predictions.map((pred) => pred[i]);
        return values.reduce((a, b) => a + b, 0) / values.length;
      });
    }
  }
}

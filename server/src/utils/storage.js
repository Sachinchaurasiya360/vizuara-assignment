// In-memory storage for datasets and processing results
const storage = new Map();

export function saveDataset(fileId, data) {
  storage.set(fileId, data);
}

export function getDataset(fileId) {
  return storage.get(fileId);
}

export function deleteDataset(fileId) {
  storage.delete(fileId);
}

export function updateDataset(fileId, updates) {
  const existing = storage.get(fileId);
  if (existing) {
    // Deep merge for nested objects like modelResults
    const merged = { ...existing };

    // Special handling for modelResults to prevent race conditions
    if (updates.modelResults && existing.modelResults) {
      merged.modelResults = {
        ...existing.modelResults,
        ...updates.modelResults,
      };
    } else if (updates.modelResults) {
      merged.modelResults = updates.modelResults;
    }

    // Apply other updates
    Object.keys(updates).forEach((key) => {
      if (key !== "modelResults") {
        merged[key] = updates[key];
      }
    });

    storage.set(fileId, merged);
  }
}

export function hasDataset(fileId) {
  return storage.has(fileId);
}

export default storage;

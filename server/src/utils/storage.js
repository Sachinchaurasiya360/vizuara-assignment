// In-memory storage for datasets and processing results
const storage = new Map();

// Lock mechanism to prevent race conditions during updates
const locks = new Map();

async function acquireLock(fileId) {
  while (locks.get(fileId)) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  locks.set(fileId, true);
}

function releaseLock(fileId) {
  locks.delete(fileId);
}

export function saveDataset(fileId, data) {
  storage.set(fileId, data);
}

export function getDataset(fileId) {
  return storage.get(fileId);
}

export function deleteDataset(fileId) {
  storage.delete(fileId);
}

export async function updateDataset(fileId, updates) {
  // Acquire lock to prevent race conditions
  await acquireLock(fileId);

  try {
    // Re-read the latest data while holding the lock
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
  } finally {
    // Always release the lock
    releaseLock(fileId);
  }
}

export function hasDataset(fileId) {
  return storage.has(fileId);
}

export default storage;

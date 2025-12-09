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
    storage.set(fileId, { ...existing, ...updates });
  }
}

export function hasDataset(fileId) {
  return storage.has(fileId);
}

export default storage;

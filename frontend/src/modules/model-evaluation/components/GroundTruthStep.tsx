import { useState, useRef } from "react";
import { useEvaluationStore } from "../store/evaluationStore";
import { uploadGroundTruth } from "../api/evaluation.api";

export function GroundTruthStep() {
  const {
    groundTruthFile,
    isUploadingGroundTruth,
    setGroundTruth,
    setEvaluationId,
    setCurrentStep,
    setUploadingGroundTruth,
    setError,
    clearError,
  } = useEvaluationStore();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    clearError();

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setGroundTruth(null, file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!groundTruthFile) return;

    setUploadingGroundTruth(true);
    clearError();

    try {
      const response = await uploadGroundTruth(groundTruthFile);

      if (response.success) {
        setEvaluationId(response.evaluationId);
        setGroundTruth(response.data, groundTruthFile);
        setCurrentStep(2);
      } else {
        setError(response.message || "Failed to upload ground truth");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to upload ground truth. Please check your file format."
      );
    } finally {
      setUploadingGroundTruth(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      {!groundTruthFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-lg">
            <span className="text-xl">📚</span>
            Step 1: Upload Ground Truth Data
          </h4>
          <p className="text-sm text-blue-900 mb-3 leading-relaxed">
            <strong>What is Ground Truth?</strong> This is your test dataset
            with the correct answers (actual labels) that you'll use to evaluate
            how well your models performed.
          </p>
          <div className="bg-white/50 rounded-lg p-3">
            <p className="text-sm text-blue-900 font-semibold mb-2">
              📝 Your CSV file must have:
            </p>
            <ul className="text-sm text-blue-800 space-y-2 ml-4">
              <li>
                • <strong>id</strong> column - Unique identifier for each sample
              </li>
              <li>
                • <strong>actual</strong> column - The true labels/values
              </li>
              <li>• Headers in the first row</li>
            </ul>
          </div>
        </div>
      )}

      {!groundTruthFile ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-black bg-slate-50 shadow-lg"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-4">
            <svg
              className="w-10 h-10 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div className="text-lg font-semibold text-slate-900 mb-2">
            Drop your ground truth CSV here or click to browse
          </div>
          <div className="text-sm text-slate-500">
            CSV format required: id, actual
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="shrink-0 p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-900">
                  {groundTruthFile.name}
                </h3>
                <p className="text-sm text-green-700">
                  {(groundTruthFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors disabled:opacity-50"
              onClick={() => setGroundTruth(null, null)}
              disabled={isUploadingGroundTruth}
            >
              Change File
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={handleUpload}
          disabled={!groundTruthFile || isUploadingGroundTruth}
        >
          {isUploadingGroundTruth ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <span>Continue to Next Step</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

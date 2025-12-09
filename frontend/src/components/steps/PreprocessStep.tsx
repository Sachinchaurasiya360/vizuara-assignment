import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { PreprocessingOptions } from "@/components/pipeline/PreprocessingOptions";
import { DataPreviewTable } from "@/components/pipeline/DataPreviewTable";
import { usePipelineStore } from "@/store/usePipelineStore";
import { preprocessData } from "@/api/pipeline.api";
import type {
  PreprocessingConfig,
  PreprocessingResponse,
} from "@/types/pipeline.types";

export function PreprocessStep() {
  const {
    uploadedFile,
    setPreprocessingConfig,
    setLoading,
    setCurrentStep,
    setError,
  } = usePipelineStore();
  const [preprocessedData, setPreprocessedData] =
    useState<PreprocessingResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!uploadedFile) {
    return <Alert variant="destructive">Please upload a file first</Alert>;
  }

  const handlePreprocess = async (config: PreprocessingConfig) => {
    setIsProcessing(true);
    setLoading(true);
    setError(null);

    try {
      const response = await preprocessData(uploadedFile.fileId, config);
      setPreprocessedData(response);
      setPreprocessingConfig(config);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to preprocess data"
      );
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Beginner-friendly explanation */}
      {!preprocessedData && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            🧹 Step 2: Clean Your Data (Optional)
          </h4>
          <p className="text-sm text-purple-900 mb-3 leading-relaxed">
            <strong>Why Clean Data?</strong> Imagine comparing students' marks
            where one is in percentage (0-100) and another in GPA (0-10). The
            machine would think GPA students performed poorly! We need to make
            all numbers comparable.
          </p>
          <div className="bg-white/50 rounded-lg p-3 mb-3 space-y-2">
            <div>
              <p className="text-sm text-purple-900 font-semibold">
                🔢 Standardization:
              </p>
              <p className="text-xs text-purple-800 ml-4">
                Converts all values to a similar range, so one column doesn't
                dominate others. Like converting all marks to a 0-100 scale.
              </p>
            </div>
            <div>
              <p className="text-sm text-purple-900 font-semibold">
                📊 Normalization:
              </p>
              <p className="text-xs text-purple-800 ml-4">
                Scales all values between 0 and 1. Think of it as converting
                everything to percentages.
              </p>
            </div>
          </div>
          <p className="text-sm text-purple-800 font-semibold mb-1">
            ⏭️ <strong>Can I skip this?</strong>
          </p>
          <p className="text-xs text-purple-700 leading-relaxed">
            Yes! If your data is already clean or all columns are already in
            similar ranges, you can click "Continue Without Preprocessing"
            below. This step is optional!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreprocessingOptions
          columns={uploadedFile.columns}
          onApply={handlePreprocess}
          isLoading={isProcessing}
        />

        {preprocessedData && (
          <div>
            <Alert
              variant="success"
              title="Preprocessing Complete"
              className="mb-4"
            >
              {preprocessedData.transformations.length} transformations applied
            </Alert>

            <div className="text-sm space-y-1 mb-4">
              {preprocessedData.rowsRemoved > 0 && (
                <p>• Rows removed: {preprocessedData.rowsRemoved}</p>
              )}
              {preprocessedData.columnsRemoved > 0 && (
                <p>• Columns removed: {preprocessedData.columnsRemoved}</p>
              )}
              {preprocessedData.newColumns.length > 0 && (
                <p>
                  • New columns created: {preprocessedData.newColumns.length}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {preprocessedData && (
        <DataPreviewTable
          preview={preprocessedData.preview}
          columns={uploadedFile.columns}
          title="Preprocessed Data Preview"
        />
      )}

      {/* Next Step button after preprocessing */}
      {preprocessedData && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentStep("split")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-slate-800 font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Continue to Next Step →
          </button>
        </div>
      )}

      {/* Skip option for beginners */}
      {!preprocessedData && !isProcessing && (
        <div className="flex justify-center">
          <button
            onClick={() => setCurrentStep("split")}
            className="text-slate-600 hover:text-black underline text-sm font-medium"
          >
            Continue Without Preprocessing →
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="flex justify-center p-8">
          <Loader size="lg" text="Preprocessing data..." />
        </div>
      )}
    </div>
  );
}

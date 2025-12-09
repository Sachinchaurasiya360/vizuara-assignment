import React, { useState } from "react";
import { CheckCircle, PieChart, Database, Sparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainTestSplitSelector } from "@/components/pipeline/TrainTestSplitSelector";
import { DataPreviewTable } from "@/components/pipeline/DataPreviewTable";
import { usePipelineStore } from "@/store/usePipelineStore";
import { splitData } from "@/api/pipeline.api";
import type {
  TrainTestSplitConfig,
  TrainTestSplitResponse,
} from "@/types/pipeline.types";

export function SplitStep() {
  const { uploadedFile, setSplitConfig, setLoading, setCurrentStep, setError } =
    usePipelineStore();
  const [splitResult, setSplitResult] = useState<TrainTestSplitResponse | null>(
    null
  );
  const [isSplitting, setIsSplitting] = useState(false);

  if (!uploadedFile) {
    return <Alert variant="destructive">Please upload a file first</Alert>;
  }

  const handleSplit = async (config: TrainTestSplitConfig) => {
    setIsSplitting(true);
    setLoading(true);
    setError(null);

    try {
      const response = await splitData(uploadedFile.fileId, config);
      setSplitResult(response);
      setSplitConfig(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to split data");
    } finally {
      setIsSplitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Beginner-friendly explanation */}
      {!splitResult && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            📖 Step 3: Split Your Data
          </h4>
          <p className="text-sm text-amber-900 mb-3 leading-relaxed">
            <strong>Think of it like studying for an exam:</strong> You practice
            on some questions (Training Data) and then test yourself on NEW
            questions (Testing Data) to see if you really understood!
          </p>
          <div className="bg-white/50 rounded-lg p-3 mb-3 space-y-2">
            <div>
              <p className="text-sm text-amber-900 font-semibold">
                📚 Training Data (80%):
              </p>
              <p className="text-xs text-amber-800 ml-4">
                This is like your practice questions. The machine learns
                patterns from this data. The more examples it sees, the better
                it learns!
              </p>
            </div>
            <div>
              <p className="text-sm text-amber-900 font-semibold">
                ✅ Testing Data (20%):
              </p>
              <p className="text-xs text-amber-800 ml-4">
                This is like your final exam questions. The machine has NEVER
                seen this data before. We use it to check if the machine really
                learned or just memorized!
              </p>
            </div>
          </div>
          <p className="text-sm text-amber-800 font-semibold mb-1">
            ✨ <strong>Which ratio should I choose?</strong>
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>80-20 split is recommended!</strong> It gives enough data
            for learning (80%) while keeping enough for fair testing (20%). Just
            like solving 80% practice questions and keeping 20% for mock tests!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrainTestSplitSelector
          columns={uploadedFile.columns}
          onSplit={handleSplit}
          isLoading={isSplitting}
        />

        {splitResult && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="h-5 w-5" />
                Split Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual Split Representation */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-green-900">
                  <span>Train ({splitResult.trainPercentage}%)</span>
                  <span>Test ({splitResult.testPercentage}%)</span>
                </div>
                <div className="flex h-16 rounded-xl overflow-hidden border-2 border-green-300 shadow-md">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg transition-all"
                    style={{ width: `${splitResult.trainPercentage}%` }}
                  >
                    {parseFloat(splitResult.trainPercentage) > 20 &&
                      `${splitResult.trainPercentage}%`}
                  </div>
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg transition-all"
                    style={{ width: `${splitResult.testPercentage}%` }}
                  >
                    {parseFloat(splitResult.testPercentage) > 20 &&
                      `${splitResult.testPercentage}%`}
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-slate-600">
                      Training Set
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {splitResult.trainCount}
                  </div>
                  <div className="text-xs text-slate-500">samples</div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium text-slate-600">
                      Testing Set
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {splitResult.testCount}
                  </div>
                  <div className="text-xs text-slate-500">samples</div>
                </div>
              </div>

              <div className="text-sm text-green-700 bg-green-100 rounded-lg p-3 mt-4">
                ✓ Dataset successfully split and ready for model training
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Next Step button after split */}
      {splitResult && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentStep("model")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-slate-800 font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Continue to Model Selection →
          </button>
        </div>
      )}

      {isSplitting && (
        <div className="flex justify-center p-12">
          <Loader size="lg" text="Splitting dataset..." />
        </div>
      )}

      {splitResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Database className="h-5 w-5" />
            <h3>Data Split Preview</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-900">
                  Training Set
                </span>
                <span className="text-sm text-blue-600 ml-auto">
                  {splitResult.trainCount} samples
                </span>
              </div>
              <DataPreviewTable
                preview={splitResult.trainPreview}
                columns={uploadedFile.columns}
                title=""
                description={`Preview of ${splitResult.trainCount} training samples`}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-semibold text-orange-900">
                  Testing Set
                </span>
                <span className="text-sm text-orange-600 ml-auto">
                  {splitResult.testCount} samples
                </span>
              </div>
              <DataPreviewTable
                preview={splitResult.testPreview}
                columns={uploadedFile.columns}
                title=""
                description={`Preview of ${splitResult.testCount} testing samples`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

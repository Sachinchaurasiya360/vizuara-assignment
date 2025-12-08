import React, { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { TrainTestSplitSelector } from '@/components/pipeline/TrainTestSplitSelector';
import { DataPreviewTable } from '@/components/pipeline/DataPreviewTable';
import { usePipelineStore } from '@/store/usePipelineStore';
import { splitData } from '@/api/pipeline.api';
import type { TrainTestSplitConfig, TrainTestSplitResponse } from '@/types/pipeline.types';

export function SplitStep() {
  const { uploadedFile, setSplitConfig, setLoading, setCurrentStep, setError } = usePipelineStore();
  const [splitResult, setSplitResult] = useState<TrainTestSplitResponse | null>(null);
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
      
      setTimeout(() => {
        setCurrentStep('model');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to split data');
    } finally {
      setIsSplitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrainTestSplitSelector
          columns={uploadedFile.columns}
          onSplit={handleSplit}
          isLoading={isSplitting}
        />

        {splitResult && (
          <Alert variant="success" title="Data Split Complete">
            Training set: {splitResult.trainSize} samples<br />
            Testing set: {splitResult.testSize} samples
          </Alert>
        )}
      </div>

      {isSplitting && (
        <div className="flex justify-center p-8">
          <Loader size="lg" text="Splitting dataset..." />
        </div>
      )}

      {splitResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataPreviewTable
            preview={splitResult.trainPreview}
            columns={uploadedFile.columns}
            title="Training Set Preview"
            description={`${splitResult.trainSize} samples`}
          />
          
          <DataPreviewTable
            preview={splitResult.testPreview}
            columns={uploadedFile.columns}
            title="Testing Set Preview"
            description={`${splitResult.testSize} samples`}
          />
        </div>
      )}
    </div>
  );
}

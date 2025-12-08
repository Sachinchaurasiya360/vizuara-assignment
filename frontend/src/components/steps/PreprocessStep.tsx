import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { PreprocessingOptions } from '@/components/pipeline/PreprocessingOptions';
import { DataPreviewTable } from '@/components/pipeline/DataPreviewTable';
import { usePipelineStore } from '@/store/usePipelineStore';
import { preprocessData } from '@/api/pipeline.api';
import type { PreprocessingConfig, PreprocessingResponse } from '@/types/pipeline.types';

export function PreprocessStep() {
  const { uploadedFile, setPreprocessingConfig, setLoading, setCurrentStep, setError } = usePipelineStore();
  const [preprocessedData, setPreprocessedData] = useState<PreprocessingResponse | null>(null);
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
      
      // Show success message
      setTimeout(() => {
        setCurrentStep('split');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preprocess data');
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreprocessingOptions
          columns={uploadedFile.columns}
          onApply={handlePreprocess}
          isLoading={isProcessing}
        />

        {preprocessedData && (
          <div>
            <Alert variant="success" title="Preprocessing Complete" className="mb-4">
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
                <p>• New columns created: {preprocessedData.newColumns.length}</p>
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

      {isProcessing && (
        <div className="flex justify-center p-8">
          <Loader size="lg" text="Preprocessing data..." />
        </div>
      )}
    </div>
  );
}

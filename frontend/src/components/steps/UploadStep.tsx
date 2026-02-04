import React from "react";
import { Sparkles } from "lucide-react";
import { FileUpload } from "@/components/pipeline/FileUpload";
import { DataPreviewTable } from "@/components/pipeline/DataPreviewTable";
import { usePipelineStore } from "@/store/usePipelineStore";

export function UploadStep() {
  const { uploadedFile } = usePipelineStore();

  return (
    <div className="space-y-6">
      {/* Beginner-friendly instructions */}
      {!uploadedFile && (
        <div className="bg--50 border border-blue-200 rounded-lg p-5 mb-4">
          <h4 className="font-semibold text-black mb-3 flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            📚 Step 1: Upload Your Data
          </h4>
          <p className="text-sm text-black mb-3 leading-relaxed">
            <strong>What is a Dataset?</strong> Think of it like an Excel
            spreadsheet with rows and columns. Each row is one example (like one
            student's data), and each column is a feature (like marks,
            attendance, etc.).
          </p>
          <div className="bg-white/50 rounded-lg p-3 mb-3">
            <p className="text-sm text-black font-semibold mb-2">
              📝 Your CSV file should have:
            </p>
            <ul className="text-sm text-black space-y-2 ml-4">
              <li>
                • <strong>Column headers in the first row</strong> - Names like
                "Age", "Marks", "Result"
              </li>
              <li>
                • <strong>Data in rows below</strong> - Each row is one example
                (student, product, etc.)
              </li>
              <li>
                • <strong>At least one target column</strong> - The thing you
                want to predict (like "Pass/Fail")
              </li>
            </ul>
          </div>
          <p className="text-xs text-black italic">
            💡 <strong>Example:</strong> If you want to predict if a student
            will pass or fail, your data might have columns like "Study_Hours",
            "Attendance", "Previous_Marks" and the target column "Result"
            (Pass/Fail).
          </p>
        </div>
      )}

      {!uploadedFile ? (
        <FileUpload />
      ) : (
        <>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900">
              File Uploaded Successfully
            </h3>
            <p className="text-black">
              {uploadedFile.fileName} - {uploadedFile.rowCount} rows,{" "}
              {uploadedFile.columnCount} columns
            </p>
          </div>

          <DataPreviewTable
            preview={uploadedFile.preview}
            columns={uploadedFile.columns}
            title="Dataset Preview"
          />
        </>
      )}
    </div>
  );
}

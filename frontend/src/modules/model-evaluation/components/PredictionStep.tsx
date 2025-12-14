import { useState } from "react";
import { Upload, Plus,  AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { uploadPredictions } from "../api/evaluation.api";
import { useEvaluationStore } from "../store/evaluationStore";

export function PredictionStep() {
  const [modelName, setModelName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { evaluationId, models, addModel, setCurrentStep } =
    useEvaluationStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAddModel = async () => {
    if (!file || !modelName.trim() || !evaluationId) return;

    setUploading(true);
    setError(null);

    try {
      const result = await uploadPredictions(evaluationId, modelName, file);

      addModel({
        name: modelName,
        filename: file.name,
        rowCount: result.rowCount,
        uploadedAt: new Date().toISOString(),
      });

      // Reset form
      setModelName("");
      setFile(null);

      // Reset file input
      const fileInput = document.getElementById(
        "prediction-file"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload predictions");
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    if (models.length === 0) {
      setError("Please add at least one model before continuing");
      return;
    }
    setCurrentStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Model Predictions
        </h2>
        <p className="text-gray-600">
          Add predictions from different models to compare their performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Add Model</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Name
              </label>
              <Input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g., Random Forest, XGBoost"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Predictions CSV
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="prediction-file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="prediction-file"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {file ? file.name : "Select CSV file"}
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-medium mb-1">
                Required Format:
              </p>
              <ul className="text-xs text-blue-700 space-y-0.5">
                <li>• "id" column matching ground truth</li>
                <li>• "predicted" column with model predictions</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">{error}</p>
              </div>
            )}

            <Button
              onClick={handleAddModel}
              disabled={!file || !modelName.trim() || uploading}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {uploading ? "Adding..." : "Add Model"}
            </Button>
          </div>
        </Card>

        {/* Added Models List */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            Added Models ({models.length})
          </h3>

          {models.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No models added yet</p>
              <p className="text-xs mt-1">Add at least one model to continue</p>
            </div>
          ) : (
            <div className="space-y-3">
              {models.map((model, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <h4 className="font-medium text-gray-900">
                          {model.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {model.filename}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {model.rowCount} predictions
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          onClick={() => setCurrentStep(1)}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={models.length === 0}
          className="flex-1"
        >
          Compare Models ({models.length})
        </Button>
      </div>
    </div>
  );
}

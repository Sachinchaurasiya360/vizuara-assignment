import React from "react";
import { BookOpen } from "lucide-react";

interface PipelineNarrationProps {
  narration: string;
  className?: string;
}

/**
 * PipelineNarration Component
 * 
 * Displays a human-readable summary of the ML pipeline execution.
 * This is a purely additive UI component that does not affect existing flows.
 */
export function PipelineNarration({
  narration,
  className = "",
}: PipelineNarrationProps) {
  if (!narration || narration.trim().length === 0) {
    return null; // Gracefully handle missing narration
  }

  return (
    <div
      className={` from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200 p-6 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-bold text-purple-900">
               What Happened?
            </h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {narration}
          </p>
        </div>
      </div>
    </div>
  );
}

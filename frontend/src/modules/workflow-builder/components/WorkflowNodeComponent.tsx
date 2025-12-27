import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { CheckCircle2, AlertCircle, Settings, Loader2 } from "lucide-react";
import type { WorkflowNode } from "../types/workflow.types";

interface WorkflowNodeComponentProps {
  data: WorkflowNode;
  selected: boolean;
}

const STATUS_STYLES = {
  idle: {
    border: "border-slate-300",
    bg: "bg-white",
    icon: Settings,
    iconColor: "text-slate-400",
  },
  configured: {
    border: "border-blue-400",
    bg: "bg-blue-50",
    icon: CheckCircle2,
    iconColor: "text-blue-600",
  },
  running: {
    border: "border-amber-400",
    bg: "bg-amber-50",
    icon: Loader2,
    iconColor: "text-amber-600 animate-spin",
  },
  completed: {
    border: "border-green-400",
    bg: "bg-green-50",
    icon: CheckCircle2,
    iconColor: "text-green-600",
  },
  error: {
    border: "border-red-400",
    bg: "bg-red-50",
    icon: AlertCircle,
    iconColor: "text-red-600",
  },
};

const NODE_ICONS: Record<string, string> = {
  dataset: "📊",
  preprocessing: "⚙️",
  split: "✂️",
  model: "🤖",
  evaluation: "📈",
};

export const WorkflowNodeComponent = memo(
  ({ data, selected }: WorkflowNodeComponentProps) => {
    const statusStyle = STATUS_STYLES[data.status];
    const StatusIcon = statusStyle.icon;
    const nodeIcon = NODE_ICONS[data.type] || "📦";

    const hasValidationErrors =
      data.validationErrors && data.validationErrors.length > 0;

    return (
      <div
        className={`
          relative min-w-[220px] max-w-[280px]
          ${statusStyle.bg} ${statusStyle.border}
          border-2 rounded-xl shadow-lg
          transition-all duration-200
          ${selected ? "ring-4 ring-blue-300 ring-opacity-50" : ""}
          ${hasValidationErrors ? "animate-pulse" : ""}
        `}
      >
        {/* Input Handle */}
        {data.type !== "dataset" && (
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-500 transition-colors"
          />
        )}

        {/* Node Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl flex-shrink-0">{nodeIcon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-slate-900 truncate">
                {data.label}
              </h3>
              <p className="text-xs text-slate-500 capitalize">{data.type}</p>
            </div>
            <StatusIcon
              className={`h-4 w-4 flex-shrink-0 ${statusStyle.iconColor}`}
            />
          </div>

          {/* Configuration Summary */}
          <div className="space-y-1 text-xs">
            {data.type === "dataset" && data.config.fileName && (
              <div className="text-slate-600 truncate">
                📄 {data.config.fileName}
              </div>
            )}

            {data.type === "preprocessing" && data.config.subType && (
              <div className="text-slate-600 capitalize">
                {data.config.subType.replace("_", " ")}
              </div>
            )}

            {data.type === "split" && (
              <div className="text-slate-600">
                {Math.round((1 - data.config.testSize) * 100)}% train /{" "}
                {Math.round(data.config.testSize * 100)}% test
              </div>
            )}

            {data.type === "model" && data.config.subType && (
              <div className="text-slate-600 capitalize">
                {data.config.subType.replace("_", " ")}
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {hasValidationErrors && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-600">
                  {data.validationErrors[0]}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output Handle */}
        {data.type !== "evaluation" && (
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-500 transition-colors"
          />
        )}
      </div>
    );
  }
);

WorkflowNodeComponent.displayName = "WorkflowNodeComponent";

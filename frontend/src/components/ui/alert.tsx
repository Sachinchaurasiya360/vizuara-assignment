import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "default" | "destructive" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = "default",
  title,
  children,
  className,
}: AlertProps) {
  const variants = {
    default: "bg-slate-100 text-slate-900 border-slate-300",
    destructive: "bg-slate-200 text-slate-900 border-slate-400",
    warning: "bg-slate-100 text-slate-900 border-slate-300",
    success: "bg-white text-slate-900 border-slate-900",
  };

  const icons = {
    default: <Info className="h-5 w-5 shrink-0 text-slate-700" />,
    destructive: <AlertCircle className="h-5 w-5 shrink-0 text-slate-900" />,
    warning: <AlertTriangle className="h-5 w-5 shrink-0 text-slate-700" />,
    success: <CheckCircle className="h-5 w-5 shrink-0 text-black" />,
  };

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 shadow-md transition-all duration-300",
        variants[variant],
        className
      )}
    >
      <div className="flex gap-3">
        {icons[variant]}
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-semibold leading-none tracking-tight">
              {title}
            </h5>
          )}
          <div className="text-sm font-medium opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}

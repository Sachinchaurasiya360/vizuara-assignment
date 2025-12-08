import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loader({ className, size = "md", text }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2
        className={cn("animate-spin text-slate-600", sizeMap[size], className)}
      />
      {text && <p className="text-sm text-slate-600">{text}</p>}
    </div>
  );
}

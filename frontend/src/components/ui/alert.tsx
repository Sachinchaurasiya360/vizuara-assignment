import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success'
  title?: string
  children: React.ReactNode
  className?: string
}

export function Alert({ variant = 'default', title, children, className }: AlertProps) {
  const variants = {
    default: 'bg-slate-50 text-slate-900 border-slate-200',
    destructive: 'bg-red-50 text-red-900 border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    success: 'bg-green-50 text-green-900 border-green-200',
  }

  return (
    <div className={cn("rounded-lg border p-4", variants[variant], className)}>
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    </div>
  )
}

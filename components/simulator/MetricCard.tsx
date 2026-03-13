import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  label: string
  value: string
  icon?: LucideIcon
  className?: string
  valueClassName?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  className,
  valueClassName,
}: MetricCardProps) {
  return (
    <Card size="sm" className={cn("border-foreground/8 bg-card/90", className)}>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {Icon ? <Icon className="size-4" /> : null}
          <p>{label}</p>
        </div>
        <p className={cn("text-lg font-semibold tracking-tight", valueClassName)}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

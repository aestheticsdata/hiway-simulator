import { Card, CardContent } from "@components/ui/card";
import type { MetricCardProps } from "@components/simulator/interfaces/MetricCardProps";
import { cn } from "@lib/utils";

export function MetricCard({ label, value, icon: Icon, className, valueClassName }: MetricCardProps) {
  return (
    <Card
      size="sm"
      className={cn("border-border/70 bg-background/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]", className)}
    >
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {Icon ? <Icon className="size-4" /> : null}
          <p>{label}</p>
        </div>
        <p className={cn("text-lg font-semibold tracking-tight", valueClassName)}>{value}</p>
      </CardContent>
    </Card>
  );
}

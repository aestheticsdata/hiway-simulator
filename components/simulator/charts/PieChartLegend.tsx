import { cn } from "@/lib/utils";
import type { PieChartLegendProps } from "@/components/simulator/charts/interfaces/PieChartLegendProps";

export function PieChartLegend({ items }: PieChartLegendProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className={cn("size-3 rounded-sm", item.dotClassName)} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

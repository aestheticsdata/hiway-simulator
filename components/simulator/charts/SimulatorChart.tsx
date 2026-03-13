"use client";

import { RevenueBarChartCard } from "@/components/simulator/charts/RevenueBarChartCard";
import type { SimulatorChartProps } from "@/components/simulator/charts/interfaces/SimulatorChartProps";
import { RevenuePieChartCard } from "@/components/simulator/charts/RevenuePieChartCard";

export function SimulatorChart({ preview }: SimulatorChartProps) {
  return (
    <div className="space-y-6">
      <RevenueBarChartCard preview={preview} />
      <RevenuePieChartCard preview={preview} />
    </div>
  );
}

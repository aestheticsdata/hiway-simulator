"use client";

import { RevenueBarChartCard } from "@components/simulator/charts/RevenueBarChartCard";
import type { SimulatorChartProps } from "@components/simulator/charts/interfaces/SimulatorChartProps";
import { RevenuePieChartCard } from "@components/simulator/charts/RevenuePieChartCard";

export function SimulatorChart({ result }: SimulatorChartProps) {
  return (
    <div className="space-y-6">
      <RevenueBarChartCard result={result} />
      <RevenuePieChartCard result={result} />
    </div>
  );
}

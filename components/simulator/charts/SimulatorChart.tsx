"use client"

import { RevenueBarChartCard } from "@/components/simulator/charts/RevenueBarChartCard"
import { RevenuePieChartCard } from "@/components/simulator/charts/RevenuePieChartCard"
import type { SimulationPreview } from "@/lib/simulator/types"

type SimulatorChartProps = {
  preview: SimulationPreview
}

export function SimulatorChart({ preview }: SimulatorChartProps) {
  return (
    <div className="space-y-6">
      <RevenueBarChartCard preview={preview} />
      <RevenuePieChartCard preview={preview} />
    </div>
  )
}

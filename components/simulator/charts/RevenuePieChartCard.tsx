"use client"

import { PieChart as PieChartIcon } from "lucide-react"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import {
  chartLegendItems,
  chartTooltipStyle,
  formatTooltipEuro,
  getPieChartData,
  renderChartPieLabel,
} from "@/components/simulator/charts/chart-data"
import { PieChartLegend } from "@/components/simulator/charts/PieChartLegend"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SimulationPreview } from "@/lib/simulator/types"

type RevenuePieChartCardProps = {
  preview: SimulationPreview
}

export function RevenuePieChartCard({
  preview,
}: RevenuePieChartCardProps) {
  const pieData = getPieChartData(preview)

  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="size-4 text-primary/80" />
          <span>Repartition des revenus</span>
        </CardTitle>
        <CardDescription>
          Part relative de chaque poste sur le cas d&apos;exemple du brief.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-96 rounded-2xl border border-border/70 bg-background/70 px-3 py-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="46%"
                outerRadius={118}
                labelLine={false}
                label={renderChartPieLabel}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={entry.fill}
                    stroke="white"
                    strokeWidth={1.25}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={formatTooltipEuro}
                contentStyle={chartTooltipStyle}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                content={() => <PieChartLegend items={chartLegendItems} />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

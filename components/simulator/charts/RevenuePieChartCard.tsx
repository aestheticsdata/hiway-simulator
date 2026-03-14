"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  chartLegendItems,
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
  chartTooltipStyle,
  formatTooltipEuro,
  getPieChartData,
  renderChartPieLabel,
} from "@components/simulator/charts/chart-data";
import type { RevenuePieChartCardProps } from "@components/simulator/charts/interfaces/RevenuePieChartCardProps";
import { PieChartLegend } from "@components/simulator/charts/PieChartLegend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { simulatorChartTexts } from "@components/simulator/charts/texts";

const PRINT_PIE_CHART_WIDTH = 500;
const PRINT_PIE_CHART_HEIGHT = 320;

export function RevenuePieChartCard({
  isPrinting,
  result,
}: RevenuePieChartCardProps) {
  const pieData = getPieChartData(result);

  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="size-4 text-primary/80" />
          <span>{simulatorChartTexts.revenuePieCard.title}</span>
        </CardTitle>
        <CardDescription>{simulatorChartTexts.revenuePieCard.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={
            isPrinting
              ? "rounded-2xl border border-border/70 bg-background/70 px-2 py-4"
              : "h-96 rounded-2xl border border-border/70 bg-background/70 px-3 py-4"
          }
        >
          {isPrinting ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <PieChart
                  height={PRINT_PIE_CHART_HEIGHT}
                  width={PRINT_PIE_CHART_WIDTH}
                >
                  <Pie
                    cx={PRINT_PIE_CHART_WIDTH / 2}
                    cy={136}
                    data={pieData}
                    dataKey="value"
                    isAnimationActive={false}
                    labelLine={false}
                    nameKey="name"
                    outerRadius={112}
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
                </PieChart>
              </div>
              <PieChartLegend items={chartLegendItems} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="46%"
                  data={pieData}
                  dataKey="value"
                  isAnimationActive
                  label={renderChartPieLabel}
                  labelLine={false}
                  nameKey="name"
                  outerRadius={118}
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
                  contentStyle={chartTooltipStyle}
                  formatter={formatTooltipEuro}
                  itemStyle={chartTooltipItemStyle}
                  labelStyle={chartTooltipLabelStyle}
                />
                <Legend
                  align="center"
                  content={() => <PieChartLegend items={chartLegendItems} />}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

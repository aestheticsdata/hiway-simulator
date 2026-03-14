"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  Cell,
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
    <Card className="border-border/80 bg-card/92 shadow-[0_16px_40px_rgba(118,145,191,0.12)] ring-1 ring-[#e7eef8] dark:shadow-[0_22px_70px_rgba(2,8,22,0.24)] dark:ring-white/3">
      <CardHeader className="border-b border-border/80">
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="size-4 text-primary/80" />
          <span>{simulatorChartTexts.revenuePieCard.title}</span>
        </CardTitle>
        <CardDescription>{simulatorChartTexts.revenuePieCard.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div
          className={
            isPrinting
              ? "rounded-2xl border border-border/70 bg-background/45 px-2 py-4"
              : "h-96 rounded-2xl border border-border/70 bg-background/45 px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
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
                        stroke="color-mix(in oklab, var(--color-card) 92%, transparent)"
                        strokeWidth={1.25}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <PieChartLegend items={chartLegendItems} />
            </div>
          ) : (
            <div className="flex h-full flex-col gap-4">
              <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={pieData}
                      dataKey="value"
                      isAnimationActive={false}
                      label={renderChartPieLabel}
                      labelLine={false}
                      nameKey="name"
                      outerRadius="78%"
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.id}
                          fill={entry.fill}
                          stroke="color-mix(in oklab, var(--color-card) 92%, transparent)"
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <PieChartLegend items={chartLegendItems} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
  chartTooltipStyle,
  formatTooltipEuro,
  getBarChartData,
} from "@components/simulator/charts/chart-data";
import type { RevenueBarChartCardProps } from "@components/simulator/charts/interfaces/RevenueBarChartCardProps";
import { simulatorChartTexts } from "@components/simulator/charts/texts";
import { formatEuro } from "@lib/simulator/formatters";

const PRINT_BAR_CHART_WIDTH = 620;
const PRINT_BAR_CHART_HEIGHT = 320;

export function RevenueBarChartCard({
  isPrinting,
  result,
}: RevenueBarChartCardProps) {
  const barData = getBarChartData(result);
  const chartContent = (
    <>
      <CartesianGrid
        stroke="color-mix(in oklab, var(--color-border) 60%, transparent)"
        strokeDasharray="4 4"
        vertical={false}
      />
      <XAxis
        axisLine={false}
        dataKey="label"
        tick={{ fill: "currentColor", fontSize: 12 }}
        tickLine={false}
      />
      <YAxis
        axisLine={false}
        tick={{ fill: "currentColor", fontSize: 12 }}
        tickFormatter={(value) => formatEuro(value as number, false)}
        tickLine={false}
        width={76}
      />
      <Tooltip
        contentStyle={chartTooltipStyle}
        cursor={{ fill: "transparent" }}
        formatter={formatTooltipEuro}
        itemStyle={chartTooltipItemStyle}
        labelStyle={chartTooltipLabelStyle}
      />
      <Bar
        dataKey="value"
        isAnimationActive={!isPrinting}
        radius={[8, 8, 0, 0]}
      >
        {barData.map((entry) => (
          <Cell key={entry.id} fill={entry.fill} />
        ))}
      </Bar>
    </>
  );

  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-4 text-primary/80" />
          <span>{simulatorChartTexts.revenueBarCard.title}</span>
        </CardTitle>
        <CardDescription>{simulatorChartTexts.revenueBarCard.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={
            isPrinting
              ? "rounded-2xl border border-border/70 bg-background/70 py-4"
              : "h-80 rounded-2xl border border-border/70 bg-background/70 px-3 py-4"
          }
        >
          {isPrinting ? (
            <div className="flex justify-center">
              <BarChart
                barCategoryGap={18}
                data={barData}
                height={PRINT_BAR_CHART_HEIGHT}
                margin={{ top: 10, right: 24, bottom: 0, left: 8 }}
                width={PRINT_BAR_CHART_WIDTH}
              >
                {chartContent}
              </BarChart>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                barCategoryGap={14}
                data={barData}
                margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
              >
                {chartContent}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

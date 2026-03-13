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
} from "@/components/ui/card";
import {
  chartTooltipStyle,
  formatTooltipEuro,
  getBarChartData,
} from "@/components/simulator/charts/chart-data";
import type { RevenueBarChartCardProps } from "@/components/simulator/charts/interfaces/RevenueBarChartCardProps";
import { formatEuro } from "@/lib/simulator/mock-data";

export function RevenueBarChartCard({
  preview,
}: RevenueBarChartCardProps) {
  const barData = getBarChartData(preview);

  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-4 text-primary/80" />
          <span>Cascade des revenus</span>
        </CardTitle>
        <CardDescription>
          Lecture rapide des postes du brief avec les couleurs issues du design
          Figma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 rounded-2xl border border-border/70 bg-background/70 px-3 py-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={barData} barCategoryGap={14}>
              <CartesianGrid
                stroke="color-mix(in oklab, var(--color-border) 60%, transparent)"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "currentColor", fontSize: 12 }}
                tickFormatter={(value) => formatEuro(value as number, false)}
                axisLine={false}
                tickLine={false}
                width={76}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                formatter={formatTooltipEuro}
                contentStyle={chartTooltipStyle}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.id} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

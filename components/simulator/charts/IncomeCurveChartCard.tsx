"use client";

import { useMemo } from "react";
import { Activity, ChartSpline } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
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
import { Skeleton } from "@components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  chartTooltipItemStyle,
  chartTooltipLabelStyle,
  chartTooltipStyle,
} from "@components/simulator/charts/chart-data";
import type { IncomeCurveChartCardProps } from "@components/simulator/charts/interfaces/IncomeCurveChartCardProps";
import { incomeCurveRangePresetOptions, simulatorPalette } from "@lib/simulator/presentation";
import { formatEuro } from "@lib/simulator/formatters";
import type { IncomeCurveRangePreset } from "@lib/simulator/constants/incomeCurveRangePresets";

const INCOME_CURVE_GRADIENT_ID = "income-curve-fill";

export function IncomeCurveChartCard({
  curve,
  isLoading,
  isUpdating,
  onRangePresetChange,
  rangePreset,
  regime,
}: IncomeCurveChartCardProps) {
  const currentScenarioPoint = useMemo(
    () => curve?.points.find((point) => point.isCurrentScenario),
    [curve]
  );

  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <ChartSpline className="size-4 text-primary/80" />
              <span>Courbe du revenu net</span>
            </CardTitle>
            <CardDescription>
              Projection du revenu net annuel sur une plage d&apos;honoraires.
              En regime reel, les charges restent fixes sur toute la courbe.
            </CardDescription>
          </div>

          <div className="w-full space-y-2 lg:w-64">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/70">
              Plage d&apos;honoraires
            </p>
            <Select
              value={rangePreset}
              onValueChange={(value) =>
                onRangePresetChange(value as IncomeCurveRangePreset)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selectionnez une plage" />
              </SelectTrigger>
              <SelectContent>
                {incomeCurveRangePresetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {curve
                ? `De ${formatEuro(curve.minHonoraires, false)} a ${formatEuro(
                    curve.maxHonoraires,
                    false
                  )}`
                : "Chargement de la plage..."}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || !curve ? (
          <Skeleton className="h-80 rounded-2xl sm:h-96" />
        ) : (
          <div className="space-y-4">
            <div className="h-80 rounded-2xl border border-border/70 bg-background/70 px-3 py-4 sm:h-96">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={curve.points}>
                  <defs>
                    <linearGradient
                      id={INCOME_CURVE_GRADIENT_ID}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={simulatorPalette.net}
                        stopOpacity={0.32}
                      />
                      <stop
                        offset="95%"
                        stopColor={simulatorPalette.net}
                        stopOpacity={0.04}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="color-mix(in oklab, var(--color-border) 60%, transparent)"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="honoraires"
                    domain={[curve.minHonoraires, curve.maxHonoraires]}
                    minTickGap={24}
                    tick={{ fill: "currentColor", fontSize: 12 }}
                    tickFormatter={(value) =>
                      formatEuro(value as number, false)
                    }
                    tickLine={false}
                    tickMargin={10}
                    type="number"
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fill: "currentColor", fontSize: 12 }}
                    tickFormatter={(value) => formatEuro(value as number, false)}
                    tickLine={false}
                    width={84}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [
                      formatEuro(Number(value)),
                      "Revenu net annuel",
                    ]}
                    itemStyle={chartTooltipItemStyle}
                    labelFormatter={(value) =>
                      `Honoraires: ${formatEuro(Number(value), false)}`
                    }
                    labelStyle={chartTooltipLabelStyle}
                  />
                  <ReferenceLine
                    stroke="color-mix(in oklab, var(--color-primary) 55%, transparent)"
                    strokeDasharray="6 4"
                    x={curve.currentHonoraires}
                  />
                  <Area
                    activeDot={{
                      fill: simulatorPalette.net,
                      r: 5,
                      stroke: "var(--color-background)",
                      strokeWidth: 2,
                    }}
                    dataKey="revenuNetAnnuel"
                    fill={`url(#${INCOME_CURVE_GRADIENT_ID})`}
                    stroke={simulatorPalette.net}
                    strokeWidth={3}
                    type="monotone"
                  />
                  {currentScenarioPoint ? (
                    <ReferenceDot
                      fill={simulatorPalette.net}
                      r={6}
                      stroke="var(--color-background)"
                      strokeWidth={2}
                      x={currentScenarioPoint.honoraires}
                      y={currentScenarioPoint.revenuNetAnnuel}
                    />
                  ) : null}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                Scenario courant:{" "}
                <span className="font-medium text-foreground">
                  {formatEuro(curve.currentHonoraires, false)}
                </span>
              </div>
              {currentScenarioPoint ? (
                <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  Net estime:{" "}
                  <span className="font-medium">
                    {formatEuro(currentScenarioPoint.revenuNetAnnuel)}
                  </span>
                </div>
              ) : null}
              <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                {regime === "reel"
                  ? "Charges fixes sur la plage"
                  : "Abattement micro-BNC constant"}
              </div>
              {isUpdating ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary">
                  <Activity className="size-3.5" />
                  <span>Actualisation de la courbe...</span>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

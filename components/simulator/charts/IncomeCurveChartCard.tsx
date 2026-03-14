"use client";

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
import { simulatorChartTexts } from "@components/simulator/charts/texts";
import { incomeCurveRangePresetOptions, simulatorPalette } from "@lib/simulator/presentation";
import { formatEuro } from "@lib/simulator/formatters";
import type { IncomeCurveRangePreset } from "@lib/simulator/constants/incomeCurveRangePresets";

const INCOME_CURVE_GRADIENT_ID = "income-curve-fill";
const PRINT_INCOME_CURVE_WIDTH = 620;
const PRINT_INCOME_CURVE_HEIGHT = 380;

export function IncomeCurveChartCard({
  curve,
  isLoading,
  isPrinting,
  isUpdating,
  onRangePresetChange,
  rangePreset,
  regime,
}: IncomeCurveChartCardProps) {
  const texts = simulatorChartTexts.incomeCurveCard;
  const selectedRangeOption = incomeCurveRangePresetOptions.find(
    (option) => option.value === rangePreset
  );
  const currentScenarioPoint = curve?.points.find(
    (point) => point.isCurrentScenario
  );
  const chartContent = curve ? (
    <>
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
        padding={{ left: 8, right: 20 }}
        tick={{ fill: "currentColor", fontSize: 12 }}
        tickFormatter={(value) => formatEuro(value as number, false)}
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
          texts.annualNetIncomeTooltip,
        ]}
        itemStyle={chartTooltipItemStyle}
        labelFormatter={(value) =>
          `${texts.feesTooltip}: ${formatEuro(Number(value), false)}`
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
        isAnimationActive={!isPrinting}
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
    </>
  ) : null;

  return (
    <Card className="border-border/80 bg-card/92 shadow-[0_16px_40px_rgba(118,145,191,0.12)] ring-1 ring-[#e7eef8] dark:shadow-[0_22px_70px_rgba(2,8,22,0.24)] dark:ring-white/3">
      <CardHeader className="border-b border-border/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <ChartSpline className="size-4 text-primary/80" />
              <span>{texts.title}</span>
            </CardTitle>
            <CardDescription>{texts.description}</CardDescription>
          </div>

          <div className="screen-only w-full space-y-2 lg:w-64">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/70">
              {texts.rangeSelectorLabel}
            </p>
            <Select
              value={rangePreset}
              onValueChange={(value) =>
                onRangePresetChange(value as IncomeCurveRangePreset)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={texts.rangeSelectorPlaceholder} />
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
                ? `${texts.rangeBoundsPrefix} ${formatEuro(
                    curve.minHonoraires,
                    false
                  )} ${texts.rangeBoundsSeparator} ${formatEuro(
                    curve.maxHonoraires,
                    false
                  )}`
                : texts.rangeLoading}
            </p>
          </div>

          <div className="print-only rounded-2xl border border-border/70 bg-background/45 px-4 py-3 text-sm">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/70">
              {texts.rangeSelectorLabel}
            </p>
            <p className="mt-2 font-medium text-foreground">
              {selectedRangeOption?.label ?? texts.rangeSelectorPlaceholder}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {curve
                ? `${texts.rangeBoundsPrefix} ${formatEuro(
                    curve.minHonoraires,
                    false
                  )} ${texts.rangeBoundsSeparator} ${formatEuro(
                    curve.maxHonoraires,
                    false
                  )}`
                : texts.rangeLoading}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {isLoading || !curve ? (
          <Skeleton className="h-80 rounded-2xl sm:h-96" />
        ) : (
          <div className="space-y-4">
            <div
              className={
                isPrinting
                  ? "rounded-2xl border border-border/70 bg-background/45 py-4"
                  : "h-80 rounded-2xl border border-border/70 bg-background/45 px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:h-96"
              }
            >
              {isPrinting ? (
                <div className="flex justify-center">
                  <AreaChart
                    data={curve.points}
                    height={PRINT_INCOME_CURVE_HEIGHT}
                    margin={{ top: 10, right: 28, bottom: 6, left: 8 }}
                    width={PRINT_INCOME_CURVE_WIDTH}
                  >
                    {chartContent}
                  </AreaChart>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart
                    data={curve.points}
                    margin={{ top: 10, right: 16, bottom: 6, left: 0 }}
                  >
                    {chartContent}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs text-muted-foreground">
                {texts.currentScenario}:{" "}
                <span className="font-medium text-foreground">
                  {formatEuro(curve.currentHonoraires, false)}
                </span>
              </div>
              {currentScenarioPoint ? (
                <div className="rounded-full border border-[#20d39c]/25 bg-[#20d39c]/10 px-3 py-1.5 text-xs text-[#0f9e75] dark:text-[#20d39c]">
                  {texts.estimatedNetIncome}:{" "}
                  <span className="font-medium">
                    {formatEuro(currentScenarioPoint.revenuNetAnnuel)}
                  </span>
                </div>
              ) : null}
              <div className="rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs text-muted-foreground">
                {regime === "reel"
                  ? texts.realRegimeHint
                  : texts.microRegimeHint}
              </div>
              {isUpdating ? (
                <div className="screen-only inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary">
                  <Activity className="size-3.5" />
                  <span>{texts.updating}</span>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

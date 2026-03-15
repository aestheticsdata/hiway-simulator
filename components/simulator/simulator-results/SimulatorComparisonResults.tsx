import { ArrowRightLeft, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { formatEuro } from "@lib/simulator/formatters";
import { simulatorRegimeLabels } from "@lib/simulator/texts";
import { cn } from "@lib/utils";

import type { SimulationComparisonResult } from "@lib/simulator/interfaces/SimulationComparisonResult";

interface SimulatorComparisonResultsProps {
  comparison: SimulationComparisonResult;
}

function ComparisonValueRow({
  amount,
  badgeLabel,
  isOptimal,
  label,
  subdued = false,
  forceDark = false,
}: {
  amount: number;
  badgeLabel?: string;
  isOptimal: boolean;
  label: string;
  subdued?: boolean;
  forceDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.55rem] border px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        forceDark
          ? cn(
              subdued
                ? "border-white/8 bg-white/3"
                : "border-white/12 bg-white/7",
              isOptimal && "border-white/20 bg-white/12",
            )
          : cn(
              subdued
                ? "border-black/8 bg-black/3 dark:border-white/8 dark:bg-white/3"
                : "border-black/12 bg-black/7 dark:border-white/12 dark:bg-white/7",
              isOptimal &&
                "border-black/20 bg-black/12 dark:border-white/20 dark:bg-white/12",
            ),
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className={cn(
            "text-sm font-medium uppercase tracking-[0.18em]",
            forceDark
              ? "text-white/70"
              : "text-muted-foreground dark:text-white/70",
          )}
        >
          {label}
        </p>
        {isOptimal && badgeLabel ? (
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium",
              forceDark
                ? "border-white/14 bg-white/14 text-white/95"
                : "border-black/14 bg-black/7 text-foreground/90 dark:border-white/14 dark:bg-white/14 dark:text-white/95",
            )}
          >
            {badgeLabel}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-3 text-[clamp(2rem,2.8vw,3rem)] font-semibold leading-none tracking-[-0.04em]",
          forceDark ? "text-white" : "text-foreground dark:text-white",
        )}
      >
        {formatEuro(amount, false)}
      </p>
    </div>
  );
}

export function SimulatorComparisonResults({
  comparison,
}: SimulatorComparisonResultsProps) {
  const texts = simulatorResultsTexts.comparisonView;
  const isMicroOptimal = comparison.optimalRegime === "micro";
  const isReelOptimal = comparison.optimalRegime === "reel";
  const optimalLabel =
    comparison.optimalRegime === "equivalent"
      ? texts.optimalCard.equivalent
      : simulatorRegimeLabels[comparison.optimalRegime];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.12fr_0.96fr_0.84fr]">
      <Card className="overflow-hidden rounded-2xl border-0 bg-[linear-gradient(135deg,#2f64f8_0%,#2149bf_100%)] text-primary-foreground shadow-[0_28px_90px_rgba(38,84,222,0.35)]">
        <CardHeader className="space-y-3 border-0 pb-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-white/76">
            <ArrowRightLeft className="size-4" />
            <span>{texts.annualCard.title}</span>
          </div>
          <CardTitle className="sr-only">{texts.annualCard.title}</CardTitle>
          <p className="max-w-xl text-sm leading-6 text-white/72">
            {texts.annualCard.helper}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <ComparisonValueRow
            amount={comparison.micro.revenuNetAnnuel}
            badgeLabel={texts.annualCard.optimalBadge}
            isOptimal={isMicroOptimal}
            label={simulatorRegimeLabels.micro}
            forceDark
          />
          <ComparisonValueRow
            amount={comparison.reel.revenuNetAnnuel}
            badgeLabel={texts.annualCard.optimalBadge}
            isOptimal={isReelOptimal}
            label={simulatorRegimeLabels.reel}
            subdued
            forceDark
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-background text-card-foreground shadow-[0_14px_40px_rgba(118,145,191,0.14)] dark:border-white/8 dark:bg-[#111c34] dark:text-white dark:shadow-[0_22px_70px_rgba(3,8,20,0.28)]">
        <CardHeader className="space-y-3 border-0 pb-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground dark:text-white/56">
            <TrendingUp className="size-4" />
            <span>{texts.monthlyCard.title}</span>
          </div>
          <CardTitle className="sr-only">{texts.monthlyCard.title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground dark:text-white/52">
            {texts.monthlyCard.helper}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <ComparisonValueRow
            amount={comparison.micro.revenuNetMensuel}
            isOptimal={isMicroOptimal}
            label={simulatorRegimeLabels.micro}
            subdued
          />
          <ComparisonValueRow
            amount={comparison.reel.revenuNetMensuel}
            isOptimal={isReelOptimal}
            label={simulatorRegimeLabels.reel}
            subdued
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-dashed border-border bg-background text-card-foreground shadow-[0_10px_30px_rgba(118,145,191,0.10)] dark:border-[#5d7098] dark:bg-[#0c1425] dark:text-white dark:shadow-[0_22px_70px_rgba(3,8,20,0.24)]">
        <CardHeader className="space-y-3 border-0 pb-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground dark:text-white/56">
            <ArrowRightLeft className="size-4" />
            <span>{texts.optimalCard.title}</span>
          </div>
          <CardTitle className="sr-only">{texts.optimalCard.title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground dark:text-white/52">
            {texts.optimalCard.helper}
          </p>
        </CardHeader>
        <CardContent className="space-y-5 pb-6">
          <p className="max-w-[8ch] text-[clamp(2.2rem,2.8vw,3.25rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-foreground dark:text-white">
            {optimalLabel}
          </p>
          <div className="space-y-1.5 text-muted-foreground dark:text-[#9aabc8]">
            <p className="text-xl font-semibold tracking-tight text-foreground dark:text-white sm:text-[1.75rem]">
              {formatEuro(comparison.annualGain, false)}
              <span className="ml-2 text-base font-medium text-muted-foreground dark:text-[#7e91b2]">
                {texts.optimalCard.gainLabelAnnual}
              </span>
            </p>
            <p className="text-base sm:text-lg">
              {formatEuro(comparison.monthlyGain, false)}
              <span className="ml-2 text-sm text-muted-foreground dark:text-[#7e91b2] sm:text-base">
                {texts.optimalCard.gainLabelMonthly}
              </span>
            </p>
          </div>
          <div className="inline-flex max-w-full rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:bg-[#0e3e38] dark:text-[#34efbd]">
            {comparison.optimalRegime === "equivalent"
              ? texts.optimalCard.equivalent
              : `${optimalLabel} conserve ${formatEuro(comparison.annualGain, false)} de plus`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

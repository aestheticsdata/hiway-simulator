import { ReceiptText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import {
  formatEuro,
  formatPercent,
} from "@lib/simulator/formatters";
import type { CalculationBreakdownCardProps } from "@components/simulator/simulator-results/interfaces/CalculationBreakdownCardProps";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { cn } from "@lib/utils";

export function CalculationBreakdownCard({
  result,
}: CalculationBreakdownCardProps) {
  const { labels, ...texts } = simulatorResultsTexts.calculationBreakdownCard;

  return (
    <Card className="border-border/80 bg-card/92 shadow-[0_16px_40px_rgba(118,145,191,0.12)] ring-1 ring-[#e7eef8] dark:shadow-[0_22px_70px_rgba(2,8,22,0.24)] dark:ring-white/3">
      <CardHeader className="border-b border-border/80">
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="size-4 text-primary/80" />
          <span>{texts.title}</span>
        </CardTitle>
        <CardDescription>{texts.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{labels.preTaxProfit}</span>
            <span className="font-medium">{formatEuro(result.bnc)}</span>
          </div>

          {result.cotisations.map((cotisation) => (
            <div
              key={cotisation.id}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-muted-foreground">
                {cotisation.label} ({formatPercent(cotisation.rate)}%)
              </span>
              <span
                className={cn(
                  "font-medium",
                  cotisation.id === "urssaf" && "text-[#4f86ff]",
                  cotisation.id === "retraite" && "text-[#ff4fa3]",
                  cotisation.id === "csg-crds" && "text-[#35cbd0]"
                )}
              >
                {formatEuro(cotisation.amount)}
              </span>
            </div>
          ))}

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">{labels.totalContributions}</span>
            <span className="font-medium text-[#4f86ff]">
              {formatEuro(result.totalCotisations)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{labels.taxableIncome}</span>
            <span className="font-medium">{formatEuro(result.revenuImposable)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{labels.familyQuotient}</span>
            <span className="font-medium">{formatEuro(result.quotient)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{labels.taxPerShare}</span>
            <span className="font-medium text-[#d7e1ef]">
              {formatEuro(result.impotParPart)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">{labels.totalTax}</span>
            <span className="font-medium text-[#d7e1ef]">
              {formatEuro(result.impotTotal)}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3">
            <span className="font-medium">{labels.effectiveRate}</span>
            <span className="text-lg font-semibold text-primary">
              {formatPercent(result.tauxGlobalPrelevements)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

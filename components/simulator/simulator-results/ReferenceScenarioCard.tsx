import { BadgeEuro, FileText, HandCoins, Landmark, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { MetricCard } from "@components/simulator/MetricCard";
import type { ReferenceScenarioCardProps } from "@components/simulator/simulator-results/interfaces/ReferenceScenarioCardProps";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { formatEuro } from "@lib/simulator/formatters";

export function ReferenceScenarioCard({ result }: ReferenceScenarioCardProps) {
  const { metrics, ...texts } = simulatorResultsTexts.referenceScenarioCard;

  return (
    <Card className="border-border/80 bg-card/92 shadow-[0_16px_40px_rgba(118,145,191,0.12)] ring-1 ring-[#e7eef8] dark:shadow-[0_22px_70px_rgba(2,8,22,0.24)] dark:ring-white/3">
      <CardHeader className="border-b border-border/80">
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4 text-primary/80" />
          <span>{texts.title}</span>
        </CardTitle>
        <CardDescription>{texts.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
        <MetricCard
          label={metrics.annualNetIncome}
          value={formatEuro(result.revenuNetAnnuel)}
          icon={TrendingUp}
          className="border-[#20d39c]/24 bg-[#20d39c]/10 shadow-sm shadow-[#20d39c]/10"
          valueClassName="text-[#20d39c]"
        />
        <MetricCard
          label={metrics.monthlyNetIncome}
          value={formatEuro(result.revenuNetMensuel)}
          icon={BadgeEuro}
          className="border-[#74e38f]/24 bg-[#74e38f]/10 shadow-sm shadow-[#74e38f]/10"
          valueClassName="text-[#74e38f]"
        />
        <MetricCard
          label={metrics.socialContributions}
          value={formatEuro(result.totalCotisations)}
          icon={HandCoins}
          className="border-[#4f86ff]/20 bg-[#4f86ff]/10"
          valueClassName="text-[#4f86ff]"
        />
        <MetricCard
          label={metrics.estimatedTax}
          value={formatEuro(result.impotTotal)}
          icon={Landmark}
          className="border-[#9fb1c8]/20 bg-[#9fb1c8]/10"
          valueClassName="text-[#d7e1ef]"
        />
      </CardContent>
    </Card>
  );
}

import {
  BadgeEuro,
  FileText,
  HandCoins,
  Landmark,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { MetricCard } from "@components/simulator/MetricCard";
import type { ReferenceScenarioCardProps } from "@components/simulator/simulator-results/interfaces/ReferenceScenarioCardProps";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { formatEuro } from "@lib/simulator/formatters";

export function ReferenceScenarioCard({
  result,
}: ReferenceScenarioCardProps) {
  const { metrics, ...texts } = simulatorResultsTexts.referenceScenarioCard;

  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4 text-primary/80" />
          <span>{texts.title}</span>
        </CardTitle>
        <CardDescription>{texts.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label={metrics.annualNetIncome}
          value={formatEuro(result.revenuNetAnnuel)}
          icon={TrendingUp}
          className="border-emerald-500/30 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
          valueClassName="text-emerald-500"
        />
        <MetricCard
          label={metrics.monthlyNetIncome}
          value={formatEuro(result.revenuNetMensuel)}
          icon={BadgeEuro}
          className="border-emerald-500/30 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
          valueClassName="text-emerald-500"
        />
        <MetricCard
          label={metrics.socialContributions}
          value={formatEuro(result.totalCotisations)}
          icon={HandCoins}
          className="border-blue-500/20 bg-blue-500/10"
          valueClassName="text-blue-500"
        />
        <MetricCard
          label={metrics.estimatedTax}
          value={formatEuro(result.impotTotal)}
          icon={Landmark}
          className="border-amber-500/20 bg-amber-500/10"
          valueClassName="text-amber-500"
        />
      </CardContent>
    </Card>
  );
}

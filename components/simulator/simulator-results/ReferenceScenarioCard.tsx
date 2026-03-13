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
} from "@/components/ui/card";
import { MetricCard } from "@/components/simulator/MetricCard";
import type { ReferenceScenarioCardProps } from "@/components/simulator/simulator-results/interfaces/ReferenceScenarioCardProps";
import { formatEuro } from "@/lib/simulator/mock-data";

export function ReferenceScenarioCard({
  preview,
}: ReferenceScenarioCardProps) {
  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4 text-primary/80" />
          <span>Scenario de reference</span>
        </CardTitle>
        <CardDescription>
          Exemple du brief: 120 000 € d&apos;honoraires, 25 000 € de charges,
          regime reel, 2 parts.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Revenu net annuel"
          value={formatEuro(preview.revenuNetAnnuel)}
          icon={TrendingUp}
          className="border-emerald-500/30 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
          valueClassName="text-emerald-500"
        />
        <MetricCard
          label="Revenu net mensuel"
          value={formatEuro(preview.revenuNetMensuel)}
          icon={BadgeEuro}
          className="border-emerald-500/30 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
          valueClassName="text-emerald-500"
        />
        <MetricCard
          label="Total cotisations"
          value={formatEuro(preview.totalCotisations)}
          icon={HandCoins}
          className="border-blue-500/20 bg-blue-500/10"
          valueClassName="text-blue-500"
        />
        <MetricCard
          label="Impot total"
          value={formatEuro(preview.impotTotal)}
          icon={Landmark}
          className="border-amber-500/20 bg-amber-500/10"
          valueClassName="text-amber-500"
        />
      </CardContent>
    </Card>
  );
}

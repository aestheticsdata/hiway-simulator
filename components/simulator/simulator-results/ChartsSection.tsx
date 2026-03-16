import dynamic from "next/dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import type { ChartsSectionProps } from "@components/simulator/simulator-results/interfaces/ChartsSectionProps";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";

const SimulatorChart = dynamic(
  () => import("@components/simulator/charts/SimulatorChart").then((mod) => mod.SimulatorChart),
  {
    ssr: false,
    loading: () => (
      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle>{simulatorResultsTexts.chartsLoadingCard.title}</CardTitle>
          <CardDescription>{simulatorResultsTexts.chartsLoadingCard.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 rounded-2xl border border-border/70 bg-muted/40" />
          <div className="h-80 rounded-2xl border border-border/70 bg-muted/40" />
          <div className="h-96 rounded-2xl border border-border/70 bg-muted/40" />
        </CardContent>
      </Card>
    ),
  },
);

export function ChartsSection({ formValues, isPrinting, result }: ChartsSectionProps) {
  return <SimulatorChart formValues={formValues} isPrinting={isPrinting} result={result} />;
}

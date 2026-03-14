import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import type { ChartsSectionProps } from "@components/simulator/simulator-results/interfaces/ChartsSectionProps";

const SimulatorChart = dynamic(
  () =>
    import("@components/simulator/charts/SimulatorChart").then(
      (mod) => mod.SimulatorChart
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle>Visualisations en preparation</CardTitle>
          <CardDescription>
            Les graphiques s&apos;affichent des que les estimations sont
            disponibles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 rounded-2xl border border-border/70 bg-muted/40" />
          <div className="h-80 rounded-2xl border border-border/70 bg-muted/40" />
          <div className="h-96 rounded-2xl border border-border/70 bg-muted/40" />
        </CardContent>
      </Card>
    ),
  }
);

export function ChartsSection({ formValues, result }: ChartsSectionProps) {
  return <SimulatorChart formValues={formValues} result={result} />;
}

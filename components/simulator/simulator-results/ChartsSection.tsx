import dynamic from "next/dynamic"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SimulationPreview } from "@/lib/simulator/types"

const SimulatorChart = dynamic(
  () =>
    import("@/components/simulator/charts/SimulatorChart").then(
      (mod) => mod.SimulatorChart
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle>Visualisation</CardTitle>
          <CardDescription>
            Chargement des graphiques de demonstration...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 rounded-2xl border border-border/70 bg-muted/40" />
          <div className="h-80 rounded-2xl border border-border/70 bg-muted/40" />
        </CardContent>
      </Card>
    ),
  }
)

type ChartsSectionProps = {
  preview: SimulationPreview
}

export function ChartsSection({ preview }: ChartsSectionProps) {
  return <SimulatorChart preview={preview} />
}

import {
  BadgeEuro,
  Calculator,
  ReceiptText,
  Scale,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import type { ScenarioSummaryCardProps } from "@components/simulator/simulator-results/interfaces/ScenarioSummaryCardProps";
import { getFormSummary } from "@lib/simulator/mock-data";

const summaryIcons: Record<string, LucideIcon> = {
  charges: ReceiptText,
  honoraires: BadgeEuro,
  parts: Users,
  regime: Scale,
};

export function ScenarioSummaryCard({
  formValues,
}: ScenarioSummaryCardProps) {
  const summary = getFormSummary(formValues);

  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-4 text-primary/80" />
          <span>Scenario saisi</span>
        </CardTitle>
        <CardDescription>
          Snapshot du payload actuellement envoye a <code>/api/simulate</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {summary.map((item) => {
          const Icon = summaryIcons[item.id];

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
            >
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                {Icon ? <Icon className="size-4 text-primary/70" /> : null}
                <span>{item.label}</span>
              </p>
              <p className="mt-1 text-base font-medium">{item.value}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

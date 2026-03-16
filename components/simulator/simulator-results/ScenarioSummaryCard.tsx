import { BadgeEuro, Calculator, ReceiptText, Scale, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import type { ScenarioSummaryCardProps } from "@components/simulator/simulator-results/interfaces/ScenarioSummaryCardProps";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { getFormSummary } from "@lib/simulator/presentation";

const summaryIcons: Record<string, LucideIcon> = {
  charges: ReceiptText,
  honoraires: BadgeEuro,
  parts: Users,
  regime: Scale,
};

export function ScenarioSummaryCard({ formValues }: ScenarioSummaryCardProps) {
  const summary = getFormSummary(formValues);

  return (
    <Card className="border-border/80 bg-card/92 shadow-[0_16px_40px_rgba(118,145,191,0.12)] ring-1 ring-[#e7eef8] dark:shadow-[0_22px_70px_rgba(2,8,22,0.24)] dark:ring-white/3">
      <CardHeader className="border-b border-border/80">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-4 text-primary/80" />
          <span>{simulatorResultsTexts.scenarioSummaryCard.title}</span>
        </CardTitle>
        <CardDescription>{simulatorResultsTexts.scenarioSummaryCard.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
        {summary.map((item) => {
          const Icon = summaryIcons[item.id];

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
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

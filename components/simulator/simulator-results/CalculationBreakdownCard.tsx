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
import { cn } from "@lib/utils";

export function CalculationBreakdownCard({
  result,
}: CalculationBreakdownCardProps) {
  return (
    <Card className="border-foreground/8 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="size-4 text-primary/80" />
          <span>Lecture des prelevements</span>
        </CardTitle>
        <CardDescription>
          Detail des postes qui reduisent le revenu disponible, du benefice
          estime jusqu&apos;au net apres impot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Benefice avant prelevements
            </span>
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
                  cotisation.id === "urssaf" && "text-blue-500",
                  cotisation.id === "retraite" && "text-violet-500",
                  cotisation.id === "csg-crds" && "text-cyan-500"
                )}
              >
                {formatEuro(cotisation.amount)}
              </span>
            </div>
          ))}

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">Total cotisations</span>
            <span className="font-medium text-blue-500">
              {formatEuro(result.totalCotisations)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Revenu imposable</span>
            <span className="font-medium">{formatEuro(result.revenuImposable)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Quotient familial</span>
            <span className="font-medium">{formatEuro(result.quotient)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Impot par part</span>
            <span className="font-medium text-amber-500">
              {formatEuro(result.impotParPart)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">Impot total</span>
            <span className="font-medium text-amber-500">
              {formatEuro(result.impotTotal)}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <span className="font-medium">Taux global de prelevements</span>
            <span className="text-lg font-semibold text-amber-500">
              {formatPercent(result.tauxGlobalPrelevements)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

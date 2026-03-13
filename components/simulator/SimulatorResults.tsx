import dynamic from "next/dynamic"
import {
  BadgeEuro,
  Calculator,
  FileText,
  HandCoins,
  Landmark,
  ReceiptText,
  Scale,
  TrendingUp,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  formatEuro,
  formatPercent,
  getFormSummary,
} from "@/lib/simulator/mock-data"
import type {
  SimulationFormValues,
  SimulationPreview,
} from "@/lib/simulator/types"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/components/simulator/MetricCard"

const SimulatorChart = dynamic(
  () =>
    import("@/components/simulator/SimulatorChart").then(
      (mod) => mod.SimulatorChart
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle>Visualisation</CardTitle>
          <CardDescription>Chargement des graphiques de demonstration...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 rounded-2xl border border-border/70 bg-muted/40" />
          <div className="h-80 rounded-2xl border border-border/70 bg-muted/40" />
        </CardContent>
      </Card>
    ),
  }
)

const scenarioSummaryIcons: Record<string, LucideIcon> = {
  charges: ReceiptText,
  honoraires: BadgeEuro,
  parts: Users,
  regime: Scale,
}

type SimulatorResultsProps = {
  formValues: SimulationFormValues
  preview: SimulationPreview
}

export function SimulatorResults({
  formValues,
  preview,
}: SimulatorResultsProps) {
  const summary = getFormSummary(formValues)

  return (
    <div className="space-y-6">
      <Alert className="border-border/80 bg-background/80 shadow-sm">
        <AlertTitle>Apercu d&apos;interface actif</AlertTitle>
        <AlertDescription>
          La colonne de droite reprend les chiffres de l&apos;exemple du brief.
          L&apos;etape suivante branchera ces cartes et graphiques sur les vraies
          routes API.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="size-4 text-primary/80" />
              <span>Scenario saisi</span>
            </CardTitle>
            <CardDescription>
              Le formulaire est deja vivant. Les calculs seront remplaces par
              des donnees API a l&apos;etape suivante.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {summary.map((item) => {
              const Icon = scenarioSummaryIcons[item.id]

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
              )
            })}
          </CardContent>
        </Card>

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
      </div>

      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReceiptText className="size-4 text-primary/80" />
            <span>Detail du calcul attendu</span>
          </CardTitle>
          <CardDescription>
            Structure finale du panneau de resultats, deja alignee avec le
            tableau de verification du PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">BNC</span>
              <span className="font-medium">{formatEuro(preview.bnc)}</span>
            </div>

            {preview.cotisations.map((cotisation) => (
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
                {formatEuro(preview.totalCotisations)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Revenu imposable</span>
              <span className="font-medium">{formatEuro(preview.revenuImposable)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Quotient</span>
              <span className="font-medium">{formatEuro(preview.quotient)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Impot par part</span>
              <span className="font-medium text-amber-500">
                {formatEuro(preview.impotParPart)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">Impot total</span>
              <span className="font-medium text-amber-500">
                {formatEuro(preview.impotTotal)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
              <span className="font-medium">Taux global de prelevements</span>
              <span className="text-lg font-semibold text-amber-500">
                {formatPercent(preview.tauxGlobalPrelevements)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <SimulatorChart preview={preview} />
    </div>
  )
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import { ActiveInterfaceAlert } from "@components/simulator/simulator-results/ActiveInterfaceAlert";
import type { SimulatorResultsSkeletonProps } from "@components/simulator/simulator-results/interfaces/SimulatorResultsSkeletonProps";
import { ScenarioSummaryCard } from "@components/simulator/simulator-results/ScenarioSummaryCard";

export function SimulatorResultsSkeleton({
  formValues,
}: SimulatorResultsSkeletonProps) {
  return (
    <div className="space-y-6">
      <ActiveInterfaceAlert />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ScenarioSummaryCard formValues={formValues} />

        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Synthese financiere</CardTitle>
            <CardDescription>
              Les principaux indicateurs s&apos;affichent des que l&apos;estimation
              est calculee.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle>Lecture des prelevements</CardTitle>
          <CardDescription>
            Le detail des montants s&apos;affichera ici une fois le calcul
            termine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Formation du revenu net</CardTitle>
            <CardDescription>
              La lecture poste par poste apparait des que les montants sont
              disponibles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 rounded-2xl" />
          </CardContent>
        </Card>

        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Poids de chaque poste</CardTitle>
            <CardDescription>
              La repartition globale s&apos;affiche des que l&apos;estimation est
              prete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 rounded-2xl" />
          </CardContent>
        </Card>

        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Sensibilite du revenu</CardTitle>
            <CardDescription>
              La projection apparait des que la simulation et la plage
              d&apos;analyse sont disponibles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 rounded-2xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

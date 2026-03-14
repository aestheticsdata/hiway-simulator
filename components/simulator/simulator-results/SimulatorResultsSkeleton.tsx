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
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";

export function SimulatorResultsSkeleton({
  formValues,
}: SimulatorResultsSkeletonProps) {
  const { skeleton } = simulatorResultsTexts;

  return (
    <div className="space-y-6">
      <ActiveInterfaceAlert />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ScenarioSummaryCard formValues={formValues} />

        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>{skeleton.financialSummary.title}</CardTitle>
            <CardDescription>{skeleton.financialSummary.description}</CardDescription>
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
          <CardTitle>{skeleton.calculationBreakdown.title}</CardTitle>
          <CardDescription>{skeleton.calculationBreakdown.description}</CardDescription>
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
            <CardTitle>{skeleton.revenueBridge.title}</CardTitle>
            <CardDescription>{skeleton.revenueBridge.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 rounded-2xl" />
          </CardContent>
        </Card>

        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>{skeleton.revenueSplit.title}</CardTitle>
            <CardDescription>{skeleton.revenueSplit.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 rounded-2xl" />
          </CardContent>
        </Card>

        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>{skeleton.incomeSensitivity.title}</CardTitle>
            <CardDescription>{skeleton.incomeSensitivity.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 rounded-2xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

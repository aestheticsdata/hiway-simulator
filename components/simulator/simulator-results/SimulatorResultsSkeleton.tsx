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
            <CardTitle>Loading simulation result</CardTitle>
            <CardDescription>
              Waiting for the API response before rendering financial data.
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
          <CardTitle>Calculation breakdown</CardTitle>
          <CardDescription>
            The detailed result will appear here once the simulation succeeds.
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
            <CardTitle>Revenue waterfall</CardTitle>
            <CardDescription>
              The bar chart appears after the simulation result is available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 rounded-2xl" />
          </CardContent>
        </Card>

        <Card className="border-foreground/8 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue breakdown</CardTitle>
            <CardDescription>
              The pie chart appears after the simulation result is available.
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

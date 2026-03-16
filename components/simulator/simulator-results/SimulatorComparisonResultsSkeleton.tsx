import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function SimulatorComparisonResultsSkeleton() {
  const { comparison } = simulatorResultsTexts.skeleton;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.12fr_0.96fr_0.84fr]">
      <Card className="overflow-hidden rounded-[2rem] border-0 bg-[linear-gradient(135deg,#2f64f8_0%,#2149bf_100%)] text-primary-foreground shadow-[0_28px_90px_rgba(38,84,222,0.35)]">
        <CardHeader className="space-y-3 border-0 pb-2">
          <CardTitle className="text-xl font-semibold">{comparison.annualTitle}</CardTitle>
          <Skeleton className="h-4 w-2/3 bg-white/18" />
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Skeleton className="h-28 rounded-[1.75rem] bg-white/14" />
          <Skeleton className="h-28 rounded-[1.75rem] bg-white/10" />
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-white/8 bg-[#111c34] text-white shadow-[0_22px_70px_rgba(3,8,20,0.28)]">
        <CardHeader className="space-y-3 pb-2">
          <CardTitle className="text-xl font-semibold">{comparison.monthlyTitle}</CardTitle>
          <Skeleton className="h-4 w-1/2 bg-white/10" />
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Skeleton className="h-24 rounded-[1.5rem] bg-white/10" />
          <Skeleton className="h-24 rounded-[1.5rem] bg-white/10" />
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-dashed border-[#5d7098] bg-[#0c1425] text-white shadow-[0_22px_70px_rgba(3,8,20,0.24)]">
        <CardHeader className="space-y-3 pb-2">
          <CardTitle className="text-xl font-semibold">{comparison.optimalTitle}</CardTitle>
          <Skeleton className="h-4 w-2/3 bg-white/10" />
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Skeleton className="h-12 w-3/4 bg-white/12" />
          <Skeleton className="h-8 w-2/3 bg-white/10" />
          <Skeleton className="h-11 w-4/5 rounded-full bg-[#14d4a0]/20" />
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { SimulatorDashboard } from "@components/simulator/SimulatorDashboard";
import { ThemeToggle } from "@components/simulator/ThemeToggle";

export const metadata: Metadata = {
  title: "Simulateur de revenu net pour medecin liberal",
  description:
    "Calculez une estimation du revenu net annuel et mensuel, des cotisations sociales et de l'impot pour un medecin liberal en micro-BNC ou au reel.",
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-background bg-[radial-gradient(circle_at_top_left,rgba(93,137,255,0.1),transparent_24%),linear-gradient(180deg,#f7faff_0%,#edf3fb_100%)] bg-no-repeat dark:bg-[radial-gradient(circle_at_top_left,rgba(79,125,255,0.28),transparent_28%),radial-gradient(circle_at_top_right,rgba(54,194,242,0.14),transparent_22%),linear-gradient(180deg,rgba(8,18,37,0.98)_0%,rgba(8,18,37,1)_100%)] lg:h-screen lg:overflow-hidden">
      <section className="relative shrink-0 border-b border-border/80 bg-background/75 backdrop-blur-xl dark:bg-[#0d1931]/82">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:px-8 2xl:max-w-384">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/75">
                Hiway • Lead Frontend Test
              </p>
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Simulateur de revenu net pour médecin libéral
              </h1>
            </div>
          </div>

          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:min-h-0 lg:flex-1 lg:px-8 lg:py-10 2xl:max-w-384">
        <Suspense fallback={null}>
          <SimulatorDashboard />
        </Suspense>
      </section>
    </main>
  );
}

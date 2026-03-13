import { SimulatorDashboard } from "@/components/simulator/SimulatorDashboard";
import { ThemeToggle } from "@/components/simulator/ThemeToggle";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-background bg-[radial-gradient(circle_at_top_left,rgba(60,126,214,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(26,163,111,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(243,154,60,0.12),transparent_24%)] bg-no-repeat lg:h-screen lg:overflow-hidden">

      <section className="relative shrink-0 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:px-8 2xl:max-w-384">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/70">
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
        <SimulatorDashboard />
      </section>
    </main>
  );
}

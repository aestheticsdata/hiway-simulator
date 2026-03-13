import { ActiveInterfaceAlert } from "@/components/simulator/simulator-results/ActiveInterfaceAlert"
import { CalculationBreakdownCard } from "@/components/simulator/simulator-results/CalculationBreakdownCard"
import { ChartsSection } from "@/components/simulator/simulator-results/ChartsSection"
import { ReferenceScenarioCard } from "@/components/simulator/simulator-results/ReferenceScenarioCard"
import { ScenarioSummaryCard } from "@/components/simulator/simulator-results/ScenarioSummaryCard"
import type {
  SimulationFormValues,
  SimulationPreview,
} from "@/lib/simulator/types"

type SimulatorResultsProps = {
  formValues: SimulationFormValues
  preview: SimulationPreview
}

export function SimulatorResults({
  formValues,
  preview,
}: SimulatorResultsProps) {
  return (
    <div className="space-y-6">
      <ActiveInterfaceAlert />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ScenarioSummaryCard formValues={formValues} />
        <ReferenceScenarioCard preview={preview} />
      </div>

      <CalculationBreakdownCard preview={preview} />
      <ChartsSection preview={preview} />
    </div>
  )
}

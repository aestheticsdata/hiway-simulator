"use client";

import { CalculationBreakdownCard } from "@components/simulator/simulator-results/CalculationBreakdownCard";
import { ChartsSection } from "@components/simulator/simulator-results/ChartsSection";
import type { SimulatorResultsProps } from "@components/simulator/simulator-results/interfaces/SimulatorResultsProps";
import { ReferenceScenarioCard } from "@components/simulator/simulator-results/ReferenceScenarioCard";
import { ScenarioSummaryCard } from "@components/simulator/simulator-results/ScenarioSummaryCard";

export function SimulatorResults({
  formValues,
  isPrinting,
  result,
}: SimulatorResultsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ScenarioSummaryCard formValues={formValues} />
        <ReferenceScenarioCard result={result} />
      </div>

      <CalculationBreakdownCard result={result} />
      <ChartsSection
        formValues={formValues}
        isPrinting={isPrinting}
        result={result}
      />
    </div>
  );
}

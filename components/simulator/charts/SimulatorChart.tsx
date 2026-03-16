"use client";

import { useState } from "react";

import { useSimulationCurveQuery } from "@lib/api/simulator/simulator.queries";
import { useDebouncedValue } from "@components/simulator/hooks/useDebouncedValue";
import type { SimulatorChartProps } from "@components/simulator/charts/interfaces/SimulatorChartProps";
import { IncomeCurveChartCard } from "@components/simulator/charts/IncomeCurveChartCard";
import { RevenuePieChartCard } from "@components/simulator/charts/RevenuePieChartCard";
import { RevenueBarChartCard } from "@components/simulator/charts/RevenueBarChartCard";
import type { IncomeCurveRangePreset } from "@lib/simulator/constants/incomeCurveRangePresets";

export function SimulatorChart({ formValues, isPrinting, result }: SimulatorChartProps) {
  const [rangePreset, setRangePreset] = useState<IncomeCurveRangePreset>("standard");
  const debouncedFormValues = useDebouncedValue(formValues, 350);
  const curveRequest = {
    ...debouncedFormValues,
    rangePreset,
  };
  const curveQuery = useSimulationCurveQuery(curveRequest);
  const handleRangePresetChange = (value: IncomeCurveRangePreset) => {
    setRangePreset(value);
  };

  return (
    <div className="space-y-6">
      <RevenueBarChartCard isPrinting={isPrinting} result={result} />
      <RevenuePieChartCard isPrinting={isPrinting} result={result} />
      <IncomeCurveChartCard
        curve={curveQuery.data}
        isLoading={curveQuery.isPending && !curveQuery.data}
        isPrinting={isPrinting}
        isUpdating={curveQuery.isFetching && !!curveQuery.data}
        onRangePresetChange={handleRangePresetChange}
        rangePreset={rangePreset}
        regime={debouncedFormValues.regime}
      />
    </div>
  );
}

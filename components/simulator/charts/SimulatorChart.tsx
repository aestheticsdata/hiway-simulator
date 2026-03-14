"use client";

import { useCallback, useMemo, useState } from "react";

import { useSimulationCurveQuery } from "@lib/api/simulator/simulator.queries";
import { useDebouncedValue } from "@components/simulator/hooks/useDebouncedValue";
import type { SimulatorChartProps } from "@components/simulator/charts/interfaces/SimulatorChartProps";
import { IncomeCurveChartCard } from "@components/simulator/charts/IncomeCurveChartCard";
import { RevenuePieChartCard } from "@components/simulator/charts/RevenuePieChartCard";
import { RevenueBarChartCard } from "@components/simulator/charts/RevenueBarChartCard";
import type { IncomeCurveRangePreset } from "@lib/simulator/constants/incomeCurveRangePresets";

export function SimulatorChart({ formValues, result }: SimulatorChartProps) {
  const [rangePreset, setRangePreset] =
    useState<IncomeCurveRangePreset>("standard");
  const debouncedFormValues = useDebouncedValue(formValues, 350);
  const curveRequest = useMemo(
    () => ({
      ...debouncedFormValues,
      rangePreset,
    }),
    [debouncedFormValues, rangePreset]
  );
  const curveQuery = useSimulationCurveQuery(curveRequest);
  const handleRangePresetChange = useCallback(
    (value: IncomeCurveRangePreset) => {
      setRangePreset(value);
    },
    []
  );

  return (
    <div className="space-y-6">
      <RevenueBarChartCard result={result} />
      <RevenuePieChartCard result={result} />
      <IncomeCurveChartCard
        curve={curveQuery.data}
        isLoading={curveQuery.isPending && !curveQuery.data}
        isUpdating={curveQuery.isFetching && !!curveQuery.data}
        onRangePresetChange={handleRangePresetChange}
        rangePreset={rangePreset}
        regime={debouncedFormValues.regime}
      />
    </div>
  );
}

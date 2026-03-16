"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { simulatorService } from "@lib/api/simulator/simulator.service";
import { getCanonicalIncomeCurveRequest, getCanonicalSimulationInput } from "@lib/simulator/searchParams";
import type { IncomeCurveRequest } from "@lib/simulator/interfaces/IncomeCurveRequest";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";

export const simulatorQueryKeys = {
  all: ["simulator"] as const,
  rates: () => [...simulatorQueryKeys.all, "rates"] as const,
  simulationComparison: (input: SimulationInput) =>
    [...simulatorQueryKeys.all, "simulation-comparison", input] as const,
  simulationCurve: (input: IncomeCurveRequest) => [...simulatorQueryKeys.all, "simulation-curve", input] as const,
  simulationResult: (input: SimulationInput) => [...simulatorQueryKeys.all, "simulation-result", input] as const,
};

export function useRatesQuery() {
  return useQuery({
    queryKey: simulatorQueryKeys.rates(),
    queryFn: ({ signal }) => simulatorService.loadRates({ signal }),
    retry: 0,
    staleTime: 5 * 60_000,
    throwOnError: true,
  });
}

export function useSimulationResultQuery(input: SimulationInput, enabled = true) {
  const canonicalInput = getCanonicalSimulationInput(input);

  return useQuery({
    enabled,
    queryKey: simulatorQueryKeys.simulationResult(canonicalInput),
    queryFn: ({ signal }) => simulatorService.runSimulation(canonicalInput, { signal }),
    retry: 0,
    throwOnError: true,
  });
}

export function useSimulationComparisonQuery(input: SimulationInput, enabled = true) {
  return useQuery({
    enabled,
    queryKey: simulatorQueryKeys.simulationComparison(input),
    queryFn: ({ signal }) => simulatorService.runSimulationComparison(input, { signal }),
    retry: 0,
    throwOnError: true,
  });
}

export function useSimulationCurveQuery(input: IncomeCurveRequest, enabled = true) {
  const canonicalInput = getCanonicalIncomeCurveRequest(input);

  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryKey: simulatorQueryKeys.simulationCurve(canonicalInput),
    queryFn: ({ signal }) => simulatorService.runSimulationCurve(canonicalInput, { signal }),
    retry: 0,
    throwOnError: true,
  });
}

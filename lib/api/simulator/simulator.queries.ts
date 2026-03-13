"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { simulatorService } from "@lib/api/simulator/simulator.service";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";

export const simulatorQueryKeys = {
  all: ["simulator"] as const,
  rates: () => [...simulatorQueryKeys.all, "rates"] as const,
  simulationResult: (input: SimulationInput) =>
    [...simulatorQueryKeys.all, "simulation-result", input] as const,
};

export function useRatesQuery() {
  return useQuery({
    queryKey: simulatorQueryKeys.rates(),
    queryFn: ({ signal }) => simulatorService.loadRates({ signal }),
    staleTime: 5 * 60_000,
    throwOnError: true,
  });
}

export function useSimulationResultQuery(
  input: SimulationInput,
  enabled = true
) {
  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryKey: simulatorQueryKeys.simulationResult(input),
    queryFn: ({ signal }) => simulatorService.runSimulation(input, { signal }),
    throwOnError: true,
  });
}

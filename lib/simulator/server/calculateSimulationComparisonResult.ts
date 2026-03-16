import "server-only";

import { simulationComparisonResultSchema } from "@lib/simulator/schemas/simulationComparisonResultSchema";
import { calculateSimulationResult } from "@lib/simulator/server/calculateSimulationResult";

import type { RatesResponse } from "@lib/simulator/interfaces/RatesResponse";
import type { SimulationComparisonResult } from "@lib/simulator/interfaces/SimulationComparisonResult";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";

function roundToCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateSimulationComparisonResult(
  input: SimulationInput,
  rates: RatesResponse,
): SimulationComparisonResult {
  const micro = calculateSimulationResult(
    {
      ...input,
      charges: 0,
      regime: "micro",
    },
    rates,
  );
  const reel = calculateSimulationResult(
    {
      ...input,
      regime: "reel",
    },
    rates,
  );
  const annualDifference = reel.revenuNetAnnuel - micro.revenuNetAnnuel;
  const monthlyDifference = reel.revenuNetMensuel - micro.revenuNetMensuel;

  return simulationComparisonResultSchema.parse({
    annualGain: roundToCurrency(Math.abs(annualDifference)),
    micro,
    monthlyGain: roundToCurrency(Math.abs(monthlyDifference)),
    optimalRegime: annualDifference > 0 ? "reel" : annualDifference < 0 ? "micro" : "equivalent",
    reel,
  });
}

import { describe, expect, it } from "vitest";

import { calculateSimulationComparisonResult } from "@lib/simulator/server/calculateSimulationComparisonResult";

import type { RatesResponse } from "@lib/simulator/interfaces/RatesResponse";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";

const simpleRates: RatesResponse = {
  cotisations: [
    {
      id: "urssaf",
      label: "URSSAF",
      rate: 10,
    },
    {
      id: "retraite",
      label: "Retraite",
      rate: 5,
    },
    {
      id: "csg-crds",
      label: "CSG-CRDS",
      rate: 2.5,
    },
  ],
  taxBrackets: [
    {
      from: 0,
      to: 10_000,
      rate: 0,
    },
    {
      from: 10_000,
      to: 20_000,
      rate: 10,
    },
    {
      from: 20_000,
      to: null,
      rate: 20,
    },
  ],
};

function createInput(overrides: Partial<SimulationInput> = {}): SimulationInput {
  return {
    charges: 0,
    honoraires: 50_000,
    partsFiscales: 1,
    regime: "reel",
    ...overrides,
  };
}

describe("calculateSimulationComparisonResult", () => {
  it("marks reel as optimal when charges stay below the micro-BNC deduction", () => {
    const result = calculateSimulationComparisonResult(
      createInput({
        charges: 5_000,
      }),
      simpleRates,
    );

    expect(result.optimalRegime).toBe("reel");
    expect(result.annualGain).toBeGreaterThan(0);
    expect(result.reel.revenuNetAnnuel).toBeGreaterThan(result.micro.revenuNetAnnuel);
  });

  it("marks micro-BNC as optimal when charges exceed the forfait deduction", () => {
    const result = calculateSimulationComparisonResult(
      createInput({
        charges: 20_000,
      }),
      simpleRates,
    );

    expect(result.optimalRegime).toBe("micro");
    expect(result.annualGain).toBeGreaterThan(0);
    expect(result.micro.revenuNetAnnuel).toBeGreaterThan(result.reel.revenuNetAnnuel);
  });

  it("returns an equivalent outcome when both regimes produce the same BNC", () => {
    const result = calculateSimulationComparisonResult(
      createInput({
        charges: 17_000,
      }),
      simpleRates,
    );

    expect(result.optimalRegime).toBe("equivalent");
    expect(result.annualGain).toBe(0);
    expect(result.monthlyGain).toBe(0);
    expect(result.micro).toEqual(result.reel);
  });

  it("keeps the micro scenario independent from the submitted charges", () => {
    const lowChargesResult = calculateSimulationComparisonResult(
      createInput({
        charges: 0,
      }),
      simpleRates,
    );
    const highChargesResult = calculateSimulationComparisonResult(
      createInput({
        charges: 99_999,
      }),
      simpleRates,
    );

    expect(lowChargesResult.micro).toEqual(highChargesResult.micro);
    expect(lowChargesResult.reel).not.toEqual(highChargesResult.reel);
  });
});

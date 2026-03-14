import { describe, expect, it } from "vitest";

import { calculateSimulationResult } from "@lib/simulator/server/calculateSimulationResult";
import { calculateIncomeCurve } from "@lib/simulator/server/calculateIncomeCurve";
import { referenceRates } from "@lib/simulator/server/referenceRates";

import type { IncomeCurveRequest } from "@lib/simulator/interfaces/IncomeCurveRequest";
import type { RatesResponse } from "@lib/simulator/interfaces/RatesResponse";

const linearRates: RatesResponse = {
  cotisations: [],
  taxBrackets: [
    {
      from: 0,
      to: null,
      rate: 0,
    },
  ],
};

function createRequest(
  overrides: Partial<IncomeCurveRequest> = {}
): IncomeCurveRequest {
  return {
    regime: "reel",
    honoraires: 0,
    charges: 0,
    partsFiscales: 1,
    rangePreset: "standard",
    ...overrides,
  };
}

describe("calculateIncomeCurve", () => {
  it("computes the expected min and max bounds for each range preset", () => {
    const focused = calculateIncomeCurve(
      createRequest({
        honoraires: 80_000,
        rangePreset: "focused",
      }),
      linearRates
    );
    const standard = calculateIncomeCurve(
      createRequest({
        honoraires: 80_000,
        rangePreset: "standard",
      }),
      linearRates
    );
    const wide = calculateIncomeCurve(
      createRequest({
        honoraires: 80_000,
        rangePreset: "wide",
      }),
      linearRates
    );

    expect(focused.minHonoraires).toBe(40_000);
    expect(focused.maxHonoraires).toBe(120_000);
    expect(standard.minHonoraires).toBe(0);
    expect(standard.maxHonoraires).toBe(160_000);
    expect(wide.minHonoraires).toBe(0);
    expect(wide.maxHonoraires).toBe(240_000);
  });

  it("uses the focused fallback maximum when honoraires is 0", () => {
    const result = calculateIncomeCurve(
      createRequest({
        honoraires: 0,
        rangePreset: "focused",
      }),
      linearRates
    );

    expect(result.currentHonoraires).toBe(0);
    expect(result.minHonoraires).toBe(0);
    expect(result.maxHonoraires).toBe(50_000);
    expect(result.points).toHaveLength(21);
    expect(result.points[0]).toEqual({
      honoraires: 0,
      isCurrentScenario: true,
      revenuNetAnnuel: 0,
    });
    expect(result.points.at(-1)).toEqual({
      honoraires: 50_000,
      isCurrentScenario: false,
      revenuNetAnnuel: 50_000,
    });
  });

  it("keeps sampled points sorted, unique, and injects the current off-grid scenario", () => {
    const result = calculateIncomeCurve(
      createRequest({
        honoraires: 12_345,
        charges: 1_000,
        rangePreset: "standard",
      }),
      linearRates
    );

    expect(result.minHonoraires).toBe(0);
    expect(result.maxHonoraires).toBe(25_000);
    expect(result.points.map((point) => point.honoraires)).toEqual([
      0, 1_000, 3_000, 4_000, 5_000, 6_000, 8_000, 9_000, 10_000, 11_000,
      12_345, 13_000, 14_000, 15_000, 16_000, 18_000, 19_000, 20_000, 21_000,
      23_000, 24_000, 25_000,
    ]);

    const currentPoints = result.points.filter((point) => point.isCurrentScenario);
    expect(currentPoints).toHaveLength(1);
    expect(currentPoints[0]).toEqual({
      honoraires: 12_345,
      isCurrentScenario: true,
      revenuNetAnnuel: 11_345,
    });
  });

  it("deduplicates rounded samples when the window is forced to the minimum size", () => {
    const result = calculateIncomeCurve(
      createRequest({
        honoraires: 100,
        rangePreset: "focused",
      }),
      linearRates
    );

    expect(result.minHonoraires).toBe(0);
    expect(result.maxHonoraires).toBe(5_000);
    expect(result.points).toEqual([
      {
        honoraires: 0,
        isCurrentScenario: false,
        revenuNetAnnuel: 0,
      },
      {
        honoraires: 100,
        isCurrentScenario: true,
        revenuNetAnnuel: 100,
      },
      {
        honoraires: 1_000,
        isCurrentScenario: false,
        revenuNetAnnuel: 1_000,
      },
      {
        honoraires: 2_000,
        isCurrentScenario: false,
        revenuNetAnnuel: 2_000,
      },
      {
        honoraires: 3_000,
        isCurrentScenario: false,
        revenuNetAnnuel: 3_000,
      },
      {
        honoraires: 4_000,
        isCurrentScenario: false,
        revenuNetAnnuel: 4_000,
      },
      {
        honoraires: 5_000,
        isCurrentScenario: false,
        revenuNetAnnuel: 5_000,
      },
    ]);
  });

  it("recalculates revenuNetAnnuel for each sampled point from the simulation engine", () => {
    const request = createRequest({
      honoraires: 123_456,
      charges: 25_000,
      partsFiscales: 2,
      rangePreset: "standard",
    });
    const result = calculateIncomeCurve(request, referenceRates);
    const pointsByHonoraires = new Map(
      result.points.map((point) => [point.honoraires, point])
    );

    expect(result.currentHonoraires).toBe(123_456);
    expect(result.minHonoraires).toBe(0);
    expect(result.maxHonoraires).toBe(250_000);
    expect(pointsByHonoraires.get(123_456)?.isCurrentScenario).toBe(true);
    expect(pointsByHonoraires.get(125_000)?.isCurrentScenario).toBe(false);

    for (const honoraires of [123_456, 125_000, 138_000, 250_000]) {
      expect(pointsByHonoraires.get(honoraires)?.revenuNetAnnuel).toBe(
        calculateSimulationResult(
          {
            ...request,
            honoraires,
          },
          referenceRates
        ).revenuNetAnnuel
      );
    }
  });
});

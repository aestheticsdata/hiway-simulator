import { describe, expect, it } from "vitest";

import {
  getCanonicalIncomeCurveRequest,
  getCanonicalSimulationInput,
  getSearchParamsFromSimulationInputForView,
  normalizeSimulationInput,
} from "@lib/simulator/searchParams";

describe("searchParams helpers", () => {
  it("keeps charges when hydrating a micro form state", () => {
    const result = normalizeSimulationInput({
      charges: 12_500,
      honoraires: 75_000,
      partsFiscales: 2,
      regime: "micro",
    });

    expect(result).toMatchObject({
      charges: 12_500,
      regime: "micro",
    });
  });

  it("canonicalizes micro inputs to zero charges for the standard simulation request", () => {
    const result = getCanonicalSimulationInput({
      charges: 12_500,
      honoraires: 75_000,
      partsFiscales: 2,
      regime: "micro",
    });

    expect(result).toMatchObject({
      charges: 0,
      regime: "micro",
    });
  });

  it("canonicalizes micro inputs to zero charges for the income curve request", () => {
    const result = getCanonicalIncomeCurveRequest({
      charges: 12_500,
      honoraires: 75_000,
      partsFiscales: 2,
      rangePreset: "standard",
      regime: "micro",
    });

    expect(result).toMatchObject({
      charges: 0,
      rangePreset: "standard",
      regime: "micro",
    });
  });

  it("omits regime from search params when the VS view is active", () => {
    const result = getSearchParamsFromSimulationInputForView(
      {
        charges: 12_500,
        honoraires: 75_000,
        partsFiscales: 2,
        regime: "micro",
      },
      {
        includeRegime: false,
      }
    );

    expect(result).toMatchObject({
      charges: 12_500,
      honoraires: 75_000,
      partsFiscales: 2,
      regime: null,
    });
  });
});

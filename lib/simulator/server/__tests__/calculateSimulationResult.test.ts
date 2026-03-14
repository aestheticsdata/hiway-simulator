import { describe, expect, it } from "vitest";

import { calculateSimulationResult } from "@lib/simulator/server/calculateSimulationResult";
import { referenceRates } from "@lib/simulator/server/referenceRates";

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

const roundingRates: RatesResponse = {
  cotisations: [
    {
      id: "rounding",
      label: "Rounding",
      rate: 10,
    },
  ],
  taxBrackets: [
    {
      from: 0,
      to: null,
      rate: 0,
    },
  ],
};

function createInput(overrides: Partial<SimulationInput> = {}): SimulationInput {
  return {
    regime: "reel",
    honoraires: 0,
    charges: 0,
    partsFiscales: 1,
    ...overrides,
  };
}

describe("calculateSimulationResult", () => {
  describe("with simplified fixtures", () => {
    it("computes a full micro-BNC result and ignores charges", () => {
      const chargedInput = createInput({
        regime: "micro",
        honoraires: 50_000,
        charges: 99_999,
      });
      const unchargedInput = createInput({
        regime: "micro",
        honoraires: 50_000,
        charges: 0,
      });

      const chargedResult = calculateSimulationResult(chargedInput, simpleRates);
      const unchargedResult = calculateSimulationResult(
        unchargedInput,
        simpleRates
      );

      expect(chargedResult).toEqual({
        bnc: 33_000,
        cotisations: [
          {
            id: "urssaf",
            label: "URSSAF",
            rate: 10,
            amount: 3_300,
          },
          {
            id: "retraite",
            label: "Retraite",
            rate: 5,
            amount: 1_650,
          },
          {
            id: "csg-crds",
            label: "CSG-CRDS",
            rate: 2.5,
            amount: 825,
          },
        ],
        totalCotisations: 5_775,
        revenuImposable: 27_225,
        quotient: 27_225,
        impotParPart: 2_445,
        impotTotal: 2_445,
        revenuNetAnnuel: 24_780,
        revenuNetMensuel: 2_065,
        tauxGlobalPrelevements: 16.44,
      });
      expect(chargedResult).toEqual(unchargedResult);
    });

    it("computes BNC from honoraires minus charges in reel", () => {
      const result = calculateSimulationResult(
        createInput({
          regime: "reel",
          honoraires: 50_000,
          charges: 5_000,
        }),
        simpleRates
      );

      expect(result).toMatchObject({
        bnc: 45_000,
        totalCotisations: 7_875,
        revenuImposable: 37_125,
        impotTotal: 4_425,
        revenuNetAnnuel: 32_700,
        revenuNetMensuel: 2_725,
        tauxGlobalPrelevements: 24.6,
      });
    });

    it("keeps tax at zero when the quotient stays under the first taxable bracket", () => {
      const result = calculateSimulationResult(
        createInput({
          honoraires: 10_000,
        }),
        simpleRates
      );

      expect(result.quotient).toBe(8_250);
      expect(result.impotParPart).toBe(0);
      expect(result.impotTotal).toBe(0);
      expect(result.revenuNetAnnuel).toBe(8_250);
    });

    it("taxes only the active bracket when the quotient is inside a single taxable range", () => {
      const result = calculateSimulationResult(
        createInput({
          honoraires: 15_000,
        }),
        simpleRates
      );

      expect(result.quotient).toBe(12_375);
      expect(result.impotParPart).toBe(237.5);
      expect(result.impotTotal).toBe(237.5);
    });

    it("applies the open-ended bracket above the last threshold", () => {
      const result = calculateSimulationResult(
        createInput({
          honoraires: 100_000,
        }),
        simpleRates
      );

      expect(result.quotient).toBe(82_500);
      expect(result.impotParPart).toBe(13_500);
      expect(result.impotTotal).toBe(13_500);
      expect(result.revenuNetAnnuel).toBe(69_000);
    });

    it("reduces total tax when parts fiscales increase", () => {
      const onePartResult = calculateSimulationResult(
        createInput({
          honoraires: 50_000,
          partsFiscales: 1,
        }),
        simpleRates
      );
      const twoPartsResult = calculateSimulationResult(
        createInput({
          honoraires: 50_000,
          partsFiscales: 2,
        }),
        simpleRates
      );

      expect(onePartResult.quotient).toBe(41_250);
      expect(twoPartsResult.quotient).toBe(20_625);
      expect(onePartResult.impotParPart).toBe(5_250);
      expect(twoPartsResult.impotParPart).toBe(1_125);
      expect(onePartResult.impotTotal).toBe(5_250);
      expect(twoPartsResult.impotTotal).toBe(2_250);
      expect(twoPartsResult.revenuNetAnnuel).toBeGreaterThan(
        onePartResult.revenuNetAnnuel
      );
    });

    it("returns a 0 global rate when honoraires is 0", () => {
      const result = calculateSimulationResult(createInput(), simpleRates);

      expect(result).toMatchObject({
        bnc: 0,
        totalCotisations: 0,
        revenuImposable: 0,
        quotient: 0,
        impotParPart: 0,
        impotTotal: 0,
        revenuNetAnnuel: 0,
        revenuNetMensuel: 0,
        tauxGlobalPrelevements: 0,
      });
      expect(Number.isFinite(result.tauxGlobalPrelevements)).toBe(true);
    });

    it("rounds x.005 amounts according to the current currency strategy", () => {
      const result = calculateSimulationResult(
        createInput({
          honoraires: 10.05,
        }),
        roundingRates
      );

      expect(result).toMatchObject({
        bnc: 10.05,
        totalCotisations: 1.01,
        revenuImposable: 9.04,
        revenuNetAnnuel: 9.04,
        revenuNetMensuel: 0.75,
        tauxGlobalPrelevements: 10.05,
      });
      expect(result.cotisations[0]?.amount).toBe(1.01);
    });

    it("documents the current behavior when charges exceed honoraires in reel", () => {
      const result = calculateSimulationResult(
        createInput({
          honoraires: 1_000,
          charges: 1_500,
        }),
        simpleRates
      );

      expect(result).toMatchObject({
        bnc: -500,
        totalCotisations: -87.5,
        revenuImposable: -412.5,
        quotient: -412.5,
        impotParPart: 0,
        impotTotal: 0,
        revenuNetAnnuel: -412.5,
        revenuNetMensuel: -34.37,
        tauxGlobalPrelevements: -8.75,
      });
      expect(result.cotisations).toEqual([
        {
          id: "urssaf",
          label: "URSSAF",
          rate: 10,
          amount: -50,
        },
        {
          id: "retraite",
          label: "Retraite",
          rate: 5,
          amount: -25,
        },
        {
          id: "csg-crds",
          label: "CSG-CRDS",
          rate: 2.5,
          amount: -12.5,
        },
      ]);
    });
  });

  describe("with reference rates", () => {
    it("matches the current full result for the default real-world scenario", () => {
      const result = calculateSimulationResult(
        createInput({
          regime: "reel",
          honoraires: 120_000,
          charges: 25_000,
          partsFiscales: 2,
        }),
        referenceRates
      );

      expect(result).toEqual({
        bnc: 95_000,
        cotisations: [
          {
            id: "urssaf",
            label: "URSSAF",
            rate: 10,
            amount: 9_500,
          },
          {
            id: "retraite",
            label: "Retraite",
            rate: 12,
            amount: 11_400,
          },
          {
            id: "csg-crds",
            label: "CSG-CRDS",
            rate: 9.7,
            amount: 9_215,
          },
        ],
        totalCotisations: 30_115,
        revenuImposable: 64_885,
        quotient: 32_442.5,
        impotParPart: 3_018.98,
        impotTotal: 6_037.96,
        revenuNetAnnuel: 58_847.04,
        revenuNetMensuel: 4_903.92,
        tauxGlobalPrelevements: 30.13,
      });
    });

    it("keeps micro-BNC independent from charges with the reference rates", () => {
      const lowChargesResult = calculateSimulationResult(
        createInput({
          regime: "micro",
          honoraires: 120_000,
          charges: 0,
          partsFiscales: 2,
        }),
        referenceRates
      );
      const highChargesResult = calculateSimulationResult(
        createInput({
          regime: "micro",
          honoraires: 120_000,
          charges: 80_000,
          partsFiscales: 2,
        }),
        referenceRates
      );

      expect(highChargesResult).toEqual(lowChargesResult);
    });
  });
});

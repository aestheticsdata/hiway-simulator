import "server-only";

import { simulationResultSchema } from "@lib/simulator/schemas/simulationResultSchema";

import type { RatesResponse } from "@lib/simulator/interfaces/RatesResponse";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";
import type { SimulationResult } from "@lib/simulator/interfaces/SimulationResult";
import type { TaxBracket } from "@lib/simulator/interfaces/TaxBracket";

const MICRO_BNC_FACTOR = 0.66;

function roundToCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTaxOnQuotient(quotient: number, taxBrackets: TaxBracket[]) {
  return taxBrackets.reduce((total, bracket) => {
    if (quotient <= bracket.from) {
      return total;
    }

    const upperBound = bracket.to ?? quotient;
    const taxableAmount = Math.min(quotient, upperBound) - bracket.from;

    if (taxableAmount <= 0) {
      return total;
    }

    return total + (taxableAmount * bracket.rate) / 100;
  }, 0);
}

export function calculateSimulationResult(input: SimulationInput, rates: RatesResponse): SimulationResult {
  const bncRaw =
    input.regime === "micro"
      ? input.honoraires * MICRO_BNC_FACTOR
      : input.honoraires - input.charges;

  const cotisations = rates.cotisations.map((cotisation) => ({
    ...cotisation,
    amount: roundToCurrency((bncRaw * cotisation.rate) / 100),
  }));

  const totalCotisationsRaw = cotisations.reduce((total, cotisation) => total + cotisation.amount, 0);
  const revenuImposableRaw = bncRaw - totalCotisationsRaw;
  const quotientRaw = revenuImposableRaw / input.partsFiscales;
  const impotParPartRaw = calculateTaxOnQuotient(quotientRaw, rates.taxBrackets);
  const impotTotalRaw = impotParPartRaw * input.partsFiscales;
  const revenuNetAnnuelRaw = bncRaw - totalCotisationsRaw - impotTotalRaw;
  const revenuNetMensuelRaw = revenuNetAnnuelRaw / 12;
  const tauxGlobalPrelevementsRaw = input.honoraires === 0 ? 0 : ((totalCotisationsRaw + impotTotalRaw) / input.honoraires) * 100;

  return simulationResultSchema.parse({
    bnc: roundToCurrency(bncRaw),
    cotisations,
    totalCotisations: roundToCurrency(totalCotisationsRaw),
    revenuImposable: roundToCurrency(revenuImposableRaw),
    quotient: roundToCurrency(quotientRaw),
    impotParPart: roundToCurrency(impotParPartRaw),
    impotTotal: roundToCurrency(impotTotalRaw),
    revenuNetAnnuel: roundToCurrency(revenuNetAnnuelRaw),
    revenuNetMensuel: roundToCurrency(revenuNetMensuelRaw),
    tauxGlobalPrelevements: roundToCurrency(tauxGlobalPrelevementsRaw),
  });
}

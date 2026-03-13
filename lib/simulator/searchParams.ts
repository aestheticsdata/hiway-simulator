import {
  parseAsFloat,
  parseAsStringLiteral,
  type inferParserType,
} from "nuqs/server";

import { defaultFormValues } from "@lib/simulator/constants/defaultFormValues";
import { fiscalRegimes } from "@lib/simulator/constants/fiscalRegimes";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";

export const simulatorSearchParamParsers = {
  charges: parseAsFloat,
  honoraires: parseAsFloat,
  partsFiscales: parseAsFloat,
  regime: parseAsStringLiteral(fiscalRegimes),
};

export type SimulatorSearchParams = inferParserType<
  typeof simulatorSearchParamParsers
>;

type SimulationInputDraft = Partial<{
  [Key in keyof SimulationInput]: SimulationInput[Key] | null;
}>;

function isValidNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 1;
}

export function normalizeSimulationInput(
  input: SimulationInputDraft
): SimulationInput {
  const normalizedInput = {
    charges: isValidNonNegativeNumber(input.charges)
      ? input.charges
      : defaultFormValues.charges,
    honoraires: isValidNonNegativeNumber(input.honoraires)
      ? input.honoraires
      : defaultFormValues.honoraires,
    partsFiscales: isValidPositiveNumber(input.partsFiscales)
      ? input.partsFiscales
      : defaultFormValues.partsFiscales,
    regime: fiscalRegimes.includes(input.regime as SimulationInput["regime"])
      ? input.regime
      : defaultFormValues.regime,
  };

  if (normalizedInput.regime === "micro") {
    normalizedInput.charges = 0;
  }

  return simulatorFormSchema.parse(normalizedInput);
}

export function getSimulationInputFromSearchParams(
  searchParams: SimulatorSearchParams
): SimulationInput {
  return normalizeSimulationInput(searchParams);
}

export function getSearchParamsFromSimulationInput(input: SimulationInput) {
  const normalizedInput = normalizeSimulationInput(input);

  return {
    charges: normalizedInput.charges,
    honoraires: normalizedInput.honoraires,
    partsFiscales: normalizedInput.partsFiscales,
    regime: normalizedInput.regime,
  };
}

export function areSimulationSearchParamsEqual(
  left: ReturnType<typeof getSearchParamsFromSimulationInput>,
  right: SimulatorSearchParams
) {
  return (
    left.charges === right.charges &&
    left.honoraires === right.honoraires &&
    left.partsFiscales === right.partsFiscales &&
    left.regime === right.regime
  );
}

export function areSimulationInputsEqual(
  left: SimulationInput,
  right: SimulationInput
) {
  return (
    left.charges === right.charges &&
    left.honoraires === right.honoraires &&
    left.partsFiscales === right.partsFiscales &&
    left.regime === right.regime
  );
}

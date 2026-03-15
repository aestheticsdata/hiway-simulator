import {
  parseAsFloat,
  parseAsStringLiteral,
  type inferParserType,
} from "nuqs/server";

import { defaultFormValues } from "@lib/simulator/constants/defaultFormValues";
import { fiscalRegimes } from "@lib/simulator/constants/fiscalRegimes";
import { simulatorViewModes } from "@lib/simulator/constants/simulatorViewModes";
import type { IncomeCurveRequest } from "@lib/simulator/interfaces/IncomeCurveRequest";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";
import type { SimulatorViewMode } from "@lib/simulator/interfaces/SimulatorViewMode";
import { incomeCurveRequestSchema } from "@lib/simulator/schemas/incomeCurveRequestSchema";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";

export const simulatorSearchParamParsers = {
  charges: parseAsFloat,
  honoraires: parseAsFloat,
  partsFiscales: parseAsFloat,
  regime: parseAsStringLiteral(fiscalRegimes),
};

export const simulatorViewModeParser = parseAsStringLiteral(
  simulatorViewModes
)
  .withDefault("default")
  .withOptions({
    clearOnDefault: true,
    history: "replace",
  });

export type SimulatorSearchParams = inferParserType<
  typeof simulatorSearchParamParsers
>;

export type SimulatorViewModeSearchParam = inferParserType<{
  view: typeof simulatorViewModeParser;
}>["view"];

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

  return simulatorFormSchema.parse(normalizedInput);
}

export function getCanonicalSimulationInput(input: SimulationInput) {
  const normalizedInput = normalizeSimulationInput(input);

  if (normalizedInput.regime !== "micro") {
    return normalizedInput;
  }

  return simulatorFormSchema.parse({
    ...normalizedInput,
    charges: 0,
  });
}

export function getCanonicalIncomeCurveRequest(input: IncomeCurveRequest) {
  return incomeCurveRequestSchema.parse({
    ...getCanonicalSimulationInput(input),
    rangePreset: input.rangePreset,
  });
}

export function getSimulationInputFromSearchParams(
  searchParams: SimulatorSearchParams
): SimulationInput {
  return normalizeSimulationInput(searchParams);
}

export function getSearchParamsFromSimulationInput(input: SimulationInput) {
  return getSearchParamsFromSimulationInputForView(input);
}

export function getSearchParamsFromSimulationInputForView(
  input: SimulationInput,
  options: {
    includeRegime?: boolean;
  } = {}
) {
  const normalizedInput = normalizeSimulationInput(input);

  return {
    charges: normalizedInput.charges,
    honoraires: normalizedInput.honoraires,
    partsFiscales: normalizedInput.partsFiscales,
    regime: options.includeRegime === false ? null : normalizedInput.regime,
  };
}

export function normalizeSimulatorViewMode(
  viewMode: SimulatorViewModeSearchParam | null | undefined
): SimulatorViewMode {
  return simulatorViewModes.includes(viewMode as SimulatorViewMode)
    ? (viewMode as SimulatorViewMode)
    : "default";
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

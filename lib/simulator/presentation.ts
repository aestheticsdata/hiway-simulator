import {
  incomeCurveRangePresets,
  type IncomeCurveRangePreset,
} from "@lib/simulator/constants/incomeCurveRangePresets";
import { formatEuro, formatNumber } from "@lib/simulator/formatters";
import {
  incomeCurveRangePresetLabels,
  simulatorPresentationTexts,
  simulatorRegimeLabels,
} from "@lib/simulator/texts";

import type { FiscalRegime } from "@lib/simulator/interfaces/FiscalRegime";
import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";

export const simulatorPalette = {
  bnc: "#f4f5f7",
  urssaf: "#3b82f6",
  retraite: "#8b5cf6",
  csgCrds: "#06b6d4",
  impot: "#f59e0b",
  net: "#10b981",
} as const;

export const incomeCurveRangePresetOptions: Array<{
  label: string;
  value: IncomeCurveRangePreset;
}> = incomeCurveRangePresets.map((value) => ({
  label: incomeCurveRangePresetLabels[value],
  value,
}));

export function getRegimeLabel(regime: FiscalRegime) {
  return simulatorRegimeLabels[regime];
}

export function getFormSummary(values: SimulationFormValues) {
  const { formSummary } = simulatorPresentationTexts;

  return [
    {
      id: "regime",
      label: formSummary.taxRegime,
      value: getRegimeLabel(values.regime),
    },
    {
      id: "honoraires",
      label: formSummary.annualFees,
      value: formatEuro(values.honoraires, false),
    },
    {
      id: "charges",
      label: formSummary.businessExpenses,
      value:
        values.regime === "reel"
          ? formatEuro(values.charges, false)
          : formSummary.microExpensesFallback,
    },
    {
      id: "parts",
      label: formSummary.taxShares,
      value: formatNumber(values.partsFiscales),
    },
  ];
}

export function getBreakdownColor(id: string) {
  switch (id) {
    case "urssaf":
      return simulatorPalette.urssaf;
    case "retraite":
      return simulatorPalette.retraite;
    case "csg-crds":
      return simulatorPalette.csgCrds;
    case "impot":
      return simulatorPalette.impot;
    case "net":
      return simulatorPalette.net;
    case "bnc":
    default:
      return simulatorPalette.bnc;
  }
}

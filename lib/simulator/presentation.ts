import {
  incomeCurveRangePresets,
  type IncomeCurveRangePreset,
} from "@lib/simulator/constants/incomeCurveRangePresets";
import { formatEuro, formatNumber } from "@lib/simulator/formatters";

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
}> = [
  {
    label: "Autour de l'activite actuelle",
    value: incomeCurveRangePresets[0],
  },
  {
    label: "Projection jusqu'a 2x",
    value: incomeCurveRangePresets[1],
  },
  {
    label: "Projection jusqu'a 3x",
    value: incomeCurveRangePresets[2],
  },
];

export function getRegimeLabel(regime: FiscalRegime) {
  return regime === "micro" ? "Micro-BNC" : "Regime reel";
}

export function getFormSummary(values: SimulationFormValues) {
  return [
    {
      id: "regime",
      label: "Cadre fiscal",
      value: getRegimeLabel(values.regime),
    },
    {
      id: "honoraires",
      label: "Honoraires annuels",
      value: formatEuro(values.honoraires, false),
    },
    {
      id: "charges",
      label: "Charges professionnelles",
      value:
        values.regime === "reel"
          ? formatEuro(values.charges, false)
          : "Non retenues en micro-BNC",
    },
    {
      id: "parts",
      label: "Parts fiscales",
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

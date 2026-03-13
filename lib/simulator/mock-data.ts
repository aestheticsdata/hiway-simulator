import { defaultFormValues } from "@lib/simulator/constants/defaultFormValues";
import { referenceRates } from "@lib/simulator/constants/referenceRates";
import { calculateSimulationResult } from "@lib/simulator/engine/calculateSimulationResult";
import type { FiscalRegime } from "@lib/simulator/interfaces/FiscalRegime";
import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";
import type { SimulationResult } from "@lib/simulator/interfaces/SimulationResult";

export const referenceSimulationResult: SimulationResult =
  calculateSimulationResult(defaultFormValues, referenceRates);

export const simulatorPalette = {
  bnc: "#f4f5f7",
  urssaf: "#3b82f6",
  retraite: "#8b5cf6",
  csgCrds: "#06b6d4",
  impot: "#f59e0b",
  net: "#10b981",
} as const;

export function formatEuro(value: number, withCents = true) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getRegimeLabel(regime: FiscalRegime) {
  return regime === "micro" ? "Micro-BNC" : "Regime reel";
}

export function getFormSummary(values: SimulationFormValues) {
  return [
    {
      id: "regime",
      label: "Regime",
      value: getRegimeLabel(values.regime),
    },
    {
      id: "honoraires",
      label: "Honoraires",
      value: formatEuro(values.honoraires, false),
    },
    {
      id: "charges",
      label: "Charges",
      value:
        values.regime === "reel"
          ? formatEuro(values.charges, false)
          : "Ignorees en micro-BNC",
    },
    {
      id: "parts",
      label: "Parts fiscales",
      value: new Intl.NumberFormat("fr-FR").format(values.partsFiscales),
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

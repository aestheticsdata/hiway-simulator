import type { IncomeCurveRangePreset } from "@lib/simulator/constants/incomeCurveRangePresets";
import type { FiscalRegime } from "@lib/simulator/interfaces/FiscalRegime";

export const simulatorRegimeLabels: Record<FiscalRegime, string> = {
  micro: "Micro-BNC",
  reel: "Regime reel",
};

export const incomeCurveRangePresetLabels: Record<IncomeCurveRangePreset, string> = {
  focused: "Autour de l'activite actuelle",
  standard: "Projection jusqu'a 2x",
  wide: "Projection jusqu'a 3x",
};

export const simulatorPresentationTexts = {
  formSummary: {
    taxRegime: "Cadre fiscal",
    annualFees: "Honoraires annuels",
    businessExpenses: "Charges professionnelles",
    microExpensesFallback: "Non retenues en micro-BNC",
    taxShares: "Parts fiscales",
  },
  validation: {
    feesRequired: "Saisissez un montant d'honoraires.",
    feesPositive: "Les honoraires doivent etre positifs.",
    expensesRequired: "Saisissez un montant de charges.",
    expensesPositive: "Les charges doivent etre positives.",
    taxSharesRequired: "Saisissez le nombre de parts fiscales.",
    taxSharesMinimum: "Le foyer fiscal doit avoir au moins 1 part.",
  },
} as const;

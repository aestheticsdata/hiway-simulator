import type {
  FiscalRegime,
} from "@/lib/simulator/interfaces/FiscalRegime";
import type { SimulationFormValues } from "@/lib/simulator/interfaces/SimulationFormValues";
import type { SimulationPreview } from "@/lib/simulator/interfaces/SimulationPreview";
import { simulationPreviewSchema } from "@/lib/simulator/schemas/simulationPreviewSchema";

export const previewSimulation: SimulationPreview = simulationPreviewSchema.parse({
  bnc: 95000,
  cotisations: [
    {
      id: "urssaf",
      label: "URSSAF",
      rate: 10,
      amount: 9500,
    },
    {
      id: "retraite",
      label: "Retraite",
      rate: 12,
      amount: 11400,
    },
    {
      id: "csg-crds",
      label: "CSG-CRDS",
      rate: 9.7,
      amount: 9215,
    },
  ],
  totalCotisations: 30115,
  revenuImposable: 64885,
  quotient: 32442.5,
  impotParPart: 3018.98,
  impotTotal: 6037.96,
  revenuNetAnnuel: 58847.04,
  revenuNetMensuel: 4903.92,
  tauxGlobalPrelevements: 30.13,
});

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

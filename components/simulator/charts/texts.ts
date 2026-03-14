export const simulatorChartTexts = {
  revenueBarCard: {
    title: "Formation du revenu net",
    description:
      "Visualise le passage des honoraires au revenu disponible, poste par poste.",
  },
  revenuePieCard: {
    title: "Poids de chaque poste",
    description:
      "Compare la part des cotisations, de l'impot et du revenu net dans l'equilibre global.",
  },
  incomeCurveCard: {
    title: "Sensibilite du revenu",
    description:
      "Montre comment le revenu net annuel evolue lorsque les honoraires varient, afin de situer le scenario actuel.",
    rangeSelectorLabel: "Plage d'honoraires",
    rangeSelectorPlaceholder: "Selectionnez une plage",
    rangeBoundsPrefix: "De",
    rangeBoundsSeparator: "a",
    rangeLoading: "Chargement de la plage...",
    annualNetIncomeTooltip: "Revenu net annuel",
    feesTooltip: "Honoraires",
    currentScenario: "Scenario courant",
    estimatedNetIncome: "Revenu net estime",
    realRegimeHint: "Charges professionnelles maintenues sur la projection",
    microRegimeHint: "Abattement forfaitaire micro-BNC constant",
    updating: "Mise a jour de la projection...",
  },
  breakdownLabels: {
    preTaxProfit: "BNC",
    urssaf: "URSSAF",
    pension: "Retraite",
    csgCrds: "CSG-CRDS",
    tax: "Impot",
    netShort: "Net",
    netIncome: "Revenu net",
  },
} as const;

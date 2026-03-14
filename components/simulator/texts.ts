export const simulatorFormTexts = {
  eyebrow: "Donnees de simulation",
  title: "Simulateur de revenu net",
  fields: {
    taxRegime: {
      label: "Regime fiscal",
      placeholder: "Selectionnez un regime",
      help: "Le mode micro applique un abattement forfaitaire. Le reel deduit les charges saisies.",
    },
    annualFees: {
      label: "Honoraires annuels",
    },
    annualExpenses: {
      label: "Charges annuelles",
      microHint:
        "Les charges ne sont pas saisies en micro-BNC. L'abattement forfaitaire de 34% servira de base de calcul a l'etape metier.",
    },
    taxShares: {
      label: "Parts fiscales",
    },
  },
} as const;

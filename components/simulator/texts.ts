export const simulatorFormTexts = {
  eyebrow: "Donnees de simulation",
  title: "Simulateur de revenu net",
  comparisonMode: {
    description:
      "Active un comparatif simplifie entre Micro-BNC et regime reel sans changer de page.",
    pendingDescription:
      "Renseignez d'abord les charges annuelles du profil reel. L'URL et la vue de droite ne basculeront en VS qu'une fois cette valeur saisie.",
    pendingTitle: "Charges reel requises",
    title: "Mode comparaison",
  },
  fields: {
    taxRegime: {
      label: "Regime fiscal",
      placeholder: "Selectionnez un regime",
      help: "Le mode micro applique un abattement forfaitaire. Le reel deduit les charges saisies.",
      vsHelp:
        "Le comparatif VS gele le regime pour garder les memes hypotheses de saisie, tout en calculant micro-BNC et reel cote resultats.",
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

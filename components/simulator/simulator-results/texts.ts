export const simulatorResultsTexts = {
  resultsBanner: {
    title: "Lecture des estimations",
    description:
      "Les montants ci-dessous donnent une vision exploitable du revenu disponible, des prelevements et de la repartition des charges pour le scenario retenu.",
  },
  comparisonBanner: {
    title: "Micro-BNC vs regime reel",
    description:
      "Le mode VS compare uniquement le revenu net annuel, le revenu mensuel et le regime le plus favorable a hypotheses constantes.",
  },
  viewSwitch: {
    hint: "Comparatif simplifie",
    label: "Mode VS",
  },
  pdfExport: {
    buttonLabel: "Exporter en PDF",
    title: "Simulation de revenu net pour medecin liberal",
    description:
      "Export des resultats et des graphiques correspondant au scenario actuellement affiche.",
  },
  scenarioSummaryCard: {
    title: "Hypotheses retenues",
    description:
      "Parametres pris en compte pour etablir l'estimation du revenu et des prelevements.",
  },
  referenceScenarioCard: {
    title: "Synthese financiere",
    description:
      "Vue d'ensemble des montants a retenir pour mesurer le revenu reellement disponible.",
    metrics: {
      annualNetIncome: "Revenu net annuel",
      monthlyNetIncome: "Revenu net mensuel",
      socialContributions: "Cotisations sociales",
      estimatedTax: "Impot estime",
    },
  },
  calculationBreakdownCard: {
    title: "Lecture des prelevements",
    description:
      "Detail des postes qui reduisent le revenu disponible, du benefice estime jusqu'au net apres impot.",
    labels: {
      preTaxProfit: "Benefice avant prelevements",
      totalContributions: "Total cotisations",
      taxableIncome: "Revenu imposable",
      familyQuotient: "Quotient familial",
      taxPerShare: "Impot par part",
      totalTax: "Impot total",
      effectiveRate: "Taux global de prelevements",
    },
  },
  chartsLoadingCard: {
    title: "Visualisations en preparation",
    description:
      "Les graphiques s'affichent des que les estimations sont disponibles.",
  },
  comparisonView: {
    annualCard: {
      helper: "Comparaison du net apres cotisations et impot",
      optimalBadge: "Le plus favorable",
      title: "Revenu net annuel",
    },
    monthlyCard: {
      helper: "Projection lissee sur 12 mois",
      title: "Revenu net mensuel",
    },
    optimalCard: {
      equivalent: "Equivalent",
      gainLabelAnnual: "de mieux par an",
      gainLabelMonthly: "soit par mois",
      helper: "Le regime qui preserve le plus de revenu disponible",
      title: "Choix optimal",
    },
  },
  skeleton: {
    financialSummary: {
      title: "Synthese financiere",
      description:
        "Les principaux indicateurs s'affichent des que l'estimation est calculee.",
    },
    calculationBreakdown: {
      title: "Lecture des prelevements",
      description:
        "Le detail des montants s'affichera ici une fois le calcul termine.",
    },
    revenueBridge: {
      title: "Formation du revenu net",
      description:
        "La lecture poste par poste apparait des que les montants sont disponibles.",
    },
    revenueSplit: {
      title: "Poids de chaque poste",
      description:
        "La repartition globale s'affiche des que l'estimation est prete.",
    },
    incomeSensitivity: {
      title: "Sensibilite du revenu",
      description:
        "La projection apparait des que la simulation et la plage d'analyse sont disponibles.",
    },
    comparison: {
      annualTitle: "Revenu net annuel",
      monthlyTitle: "Revenu net mensuel",
      optimalTitle: "Choix optimal",
    },
  },
} as const;

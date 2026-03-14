export const simulatorResultsTexts = {
  activeAlert: {
    title: "Lecture des estimations",
    description:
      "Les montants ci-dessous donnent une vision exploitable du revenu disponible, des prelevements et de la repartition des charges pour le scenario retenu.",
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
  },
} as const;

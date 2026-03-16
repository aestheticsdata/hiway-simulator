import { getBreakdownColor, simulatorPalette } from "@lib/simulator/presentation";
import { formatEuro } from "@lib/simulator/formatters";
import { simulatorChartTexts } from "@components/simulator/charts/texts";
import type { ChartLegendItem, PieLabelProps } from "@components/simulator/charts/interfaces/ChartData";
import type { SimulationResult } from "@lib/simulator/interfaces/SimulationResult";

export function getBarChartData(result: SimulationResult) {
  const { breakdownLabels } = simulatorChartTexts;

  return [
    {
      id: "bnc",
      label: breakdownLabels.preTaxProfit,
      value: result.bnc,
      fill: simulatorPalette.bnc,
    },
    {
      id: "urssaf",
      label: breakdownLabels.urssaf,
      value: result.cotisations[0]?.amount ?? 0,
      fill: simulatorPalette.urssaf,
    },
    {
      id: "retraite",
      label: breakdownLabels.pension,
      value: result.cotisations[1]?.amount ?? 0,
      fill: simulatorPalette.retraite,
    },
    {
      id: "csg-crds",
      label: breakdownLabels.csgCrds,
      value: result.cotisations[2]?.amount ?? 0,
      fill: simulatorPalette.csgCrds,
    },
    {
      id: "impot",
      label: breakdownLabels.tax,
      value: result.impotTotal,
      fill: simulatorPalette.impot,
    },
    {
      id: "net",
      label: breakdownLabels.netShort,
      value: result.revenuNetAnnuel,
      fill: simulatorPalette.net,
    },
  ];
}

export function getPieChartData(result: SimulationResult) {
  const { breakdownLabels } = simulatorChartTexts;

  return [
    ...result.cotisations.map((cotisation) => ({
      id: cotisation.id,
      name: cotisation.label,
      value: cotisation.amount,
      fill: getBreakdownColor(cotisation.id),
    })),
    {
      id: "impot",
      name: breakdownLabels.tax,
      value: result.impotTotal,
      fill: simulatorPalette.impot,
    },
    {
      id: "net",
      name: breakdownLabels.netIncome,
      value: result.revenuNetAnnuel,
      fill: simulatorPalette.net,
    },
  ];
}

export const chartLegendItems: ChartLegendItem[] = [
  {
    id: "urssaf",
    label: simulatorChartTexts.breakdownLabels.urssaf,
    dotClassName: "bg-[#4f86ff]",
  },
  {
    id: "retraite",
    label: simulatorChartTexts.breakdownLabels.pension,
    dotClassName: "bg-[#ff4fa3]",
  },
  {
    id: "csg-crds",
    label: simulatorChartTexts.breakdownLabels.csgCrds,
    dotClassName: "bg-[#35cbd0]",
  },
  {
    id: "impot",
    label: simulatorChartTexts.breakdownLabels.tax,
    dotClassName: "bg-[#9fb1c8]",
  },
  {
    id: "net",
    label: simulatorChartTexts.breakdownLabels.netIncome,
    dotClassName: "bg-[#20d39c]",
  },
];

export const chartTooltipStyle = {
  borderRadius: "1rem",
  border: "1px solid color-mix(in oklab, var(--color-border) 85%, transparent)",
  backgroundColor: "var(--color-card)",
  color: "var(--color-card-foreground)",
  boxShadow: "0 20px 50px rgba(2, 8, 22, 0.28)",
};

export const chartTooltipLabelStyle = {
  color: "var(--color-card-foreground)",
};

export const chartTooltipItemStyle = {
  color: "var(--color-card-foreground)",
};

export function renderChartPieLabel({ cx, cy, innerRadius, outerRadius, midAngle, percent, name }: PieLabelProps) {
  if (
    cx === undefined ||
    cy === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    midAngle === undefined ||
    percent === undefined ||
    !name ||
    percent < 0.06
  ) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${name} ${Math.round(percent * 100)}%`}
    </text>
  );
}

export function formatTooltipEuro(value: unknown) {
  return formatEuro(typeof value === "number" ? value : Number(value ?? 0));
}

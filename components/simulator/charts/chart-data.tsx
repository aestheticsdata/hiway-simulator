import {
  formatEuro,
  getBreakdownColor,
  simulatorPalette,
} from "@lib/simulator/mock-data";
import type {
  ChartLegendItem,
  PieLabelProps,
} from "@components/simulator/charts/interfaces/ChartData";
import type { SimulationResult } from "@lib/simulator/interfaces/SimulationResult";

export function getBarChartData(result: SimulationResult) {
  return [
    {
      id: "bnc",
      label: "BNC",
      value: result.bnc,
      fill: simulatorPalette.urssaf,
    },
    {
      id: "urssaf",
      label: "URSSAF",
      value: result.cotisations[0]?.amount ?? 0,
      fill: simulatorPalette.urssaf,
    },
    {
      id: "retraite",
      label: "Retraite",
      value: result.cotisations[1]?.amount ?? 0,
      fill: simulatorPalette.retraite,
    },
    {
      id: "csg-crds",
      label: "CSG-CRDS",
      value: result.cotisations[2]?.amount ?? 0,
      fill: simulatorPalette.csgCrds,
    },
    {
      id: "impot",
      label: "Impot",
      value: result.impotTotal,
      fill: simulatorPalette.impot,
    },
    {
      id: "net",
      label: "Net",
      value: result.revenuNetAnnuel,
      fill: simulatorPalette.net,
    },
  ];
}

export function getPieChartData(result: SimulationResult) {
  return [
    ...result.cotisations.map((cotisation) => ({
      id: cotisation.id,
      name: cotisation.label,
      value: cotisation.amount,
      fill: getBreakdownColor(cotisation.id),
    })),
    {
      id: "impot",
      name: "Impot",
      value: result.impotTotal,
      fill: simulatorPalette.impot,
    },
    {
      id: "net",
      name: "Revenu net",
      value: result.revenuNetAnnuel,
      fill: simulatorPalette.net,
    },
  ];
}

export const chartLegendItems: ChartLegendItem[] = [
  {
    id: "urssaf",
    label: "URSSAF",
    dotClassName: "bg-blue-500",
  },
  {
    id: "retraite",
    label: "Retraite",
    dotClassName: "bg-violet-500",
  },
  {
    id: "csg-crds",
    label: "CSG-CRDS",
    dotClassName: "bg-cyan-500",
  },
  {
    id: "impot",
    label: "Impot",
    dotClassName: "bg-amber-500",
  },
  {
    id: "net",
    label: "Revenu net",
    dotClassName: "bg-emerald-500",
  },
];

export const chartTooltipStyle = {
  borderRadius: "1rem",
  border:
    "1px solid color-mix(in oklab, var(--color-border) 85%, transparent)",
  backgroundColor: "var(--color-card)",
  color: "var(--color-card-foreground)",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
};

export const chartTooltipLabelStyle = {
  color: "var(--color-card-foreground)",
};

export const chartTooltipItemStyle = {
  color: "var(--color-card-foreground)",
};

export function renderChartPieLabel({
  cx,
  cy,
  innerRadius,
  outerRadius,
  midAngle,
  percent,
  name,
}: PieLabelProps) {
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

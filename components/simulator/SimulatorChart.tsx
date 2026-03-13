"use client"

import { BarChart3, PieChart as PieChartIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatEuro,
  getBreakdownColor,
  simulatorPalette,
} from "@/lib/simulator/mock-data"
import type { SimulationPreview } from "@/lib/simulator/types"
import { cn } from "@/lib/utils"

type SimulatorChartProps = {
  preview: SimulationPreview
}

type PieLabelProps = {
  cx?: number
  cy?: number
  innerRadius?: number
  outerRadius?: number
  midAngle?: number
  percent?: number
  name?: string
}

export function SimulatorChart({ preview }: SimulatorChartProps) {
  const barData = [
    {
      id: "bnc",
      label: "BNC",
      value: preview.bnc,
      fill: simulatorPalette.urssaf,
    },
    {
      id: "urssaf",
      label: "URSSAF",
      value: preview.cotisations[0]?.amount ?? 0,
      fill: simulatorPalette.urssaf,
    },
    {
      id: "retraite",
      label: "Retraite",
      value: preview.cotisations[1]?.amount ?? 0,
      fill: simulatorPalette.retraite,
    },
    {
      id: "csg-crds",
      label: "CSG-CRDS",
      value: preview.cotisations[2]?.amount ?? 0,
      fill: simulatorPalette.csgCrds,
    },
    {
      id: "impot",
      label: "Impot",
      value: preview.impotTotal,
      fill: simulatorPalette.impot,
    },
    {
      id: "net",
      label: "Net",
      value: preview.revenuNetAnnuel,
      fill: simulatorPalette.net,
    },
  ]

  const pieData = [
    ...preview.cotisations.map((cotisation) => ({
      id: cotisation.id,
      name: cotisation.label,
      value: cotisation.amount,
      fill: getBreakdownColor(cotisation.id),
    })),
    {
      id: "impot",
      name: "Impot",
      value: preview.impotTotal,
      fill: simulatorPalette.impot,
    },
    {
      id: "net",
      name: "Revenu net",
      value: preview.revenuNetAnnuel,
      fill: simulatorPalette.net,
    },
  ]

  const legendItems = [
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
  ]

  const tooltipStyle = {
    borderRadius: "1rem",
    border:
      "1px solid color-mix(in oklab, var(--color-border) 85%, transparent)",
    backgroundColor: "var(--color-card)",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
  }

  function renderPieLabel({
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
      return null
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.62
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

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
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-4 text-primary/80" />
            <span>Cascade des revenus</span>
          </CardTitle>
          <CardDescription>
            Lecture rapide des postes du brief avec les couleurs issues du
            design Figma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 rounded-2xl border border-border/70 bg-background/70 px-3 py-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={barData} barCategoryGap={14}>
                <CartesianGrid
                  stroke="color-mix(in oklab, var(--color-border) 60%, transparent)"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickFormatter={(value) => formatEuro(value as number, false)}
                  axisLine={false}
                  tickLine={false}
                  width={76}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(value) =>
                    formatEuro(
                      typeof value === "number" ? value : Number(value ?? 0)
                    )
                  }
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry) => (
                    <Cell key={entry.id} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-foreground/8 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="size-4 text-primary/80" />
            <span>Repartition des revenus</span>
          </CardTitle>
          <CardDescription>
            Part relative de chaque poste sur le cas d&apos;exemple du brief.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-96 rounded-2xl border border-border/70 bg-background/70 px-3 py-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  outerRadius={118}
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.fill}
                      stroke="white"
                      strokeWidth={1.25}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    formatEuro(
                      typeof value === "number" ? value : Number(value ?? 0)
                    )
                  }
                  contentStyle={tooltipStyle}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  content={() => (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                      {legendItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <span className={cn("size-3 rounded-sm", item.dotClassName)} />
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

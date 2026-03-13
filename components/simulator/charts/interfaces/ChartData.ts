export interface PieLabelProps {
  cx?: number
  cy?: number
  innerRadius?: number
  outerRadius?: number
  midAngle?: number
  percent?: number
  name?: string
}

export interface ChartLegendItem {
  id: string
  label: string
  dotClassName: string
}

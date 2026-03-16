import type { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  className?: string;
  valueClassName?: string;
}

import type { UseFormReturn } from "react-hook-form";

import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";
import type { SimulatorViewMode } from "@lib/simulator/interfaces/SimulatorViewMode";

export interface SimulatorFormProps {
  form: UseFormReturn<SimulationFormValues>;
  showComparisonChargesField?: boolean;
  titleId: string;
  viewMode: SimulatorViewMode;
}

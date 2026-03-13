import type { UseFormReturn } from "react-hook-form";

import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";

export interface SimulatorFormProps {
  form: UseFormReturn<SimulationFormValues>
}

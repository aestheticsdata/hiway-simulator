import type {
  SimulationFormValues,
} from "@/lib/simulator/interfaces/SimulationFormValues";
import type { SimulationPreview } from "@/lib/simulator/interfaces/SimulationPreview";

export interface SimulatorResultsProps {
  formValues: SimulationFormValues
  preview: SimulationPreview
}

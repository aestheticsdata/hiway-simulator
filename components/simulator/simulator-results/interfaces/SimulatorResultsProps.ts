import type {
  SimulationFormValues,
} from "@lib/simulator/interfaces/SimulationFormValues";
import type { SimulationResult } from "@lib/simulator/interfaces/SimulationResult";

export interface SimulatorResultsProps {
  formValues: SimulationFormValues;
  result: SimulationResult;
}

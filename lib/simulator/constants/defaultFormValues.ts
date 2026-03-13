import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";

export const defaultFormValues: SimulationFormValues = simulatorFormSchema.parse({
  regime: "reel",
  honoraires: 120000,
  charges: 25000,
  partsFiscales: 2,
});

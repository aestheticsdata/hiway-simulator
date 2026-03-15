import { z } from "zod";

import { simulationComparisonResultSchema } from "@lib/simulator/schemas/simulationComparisonResultSchema";

export type SimulationComparisonResult = z.infer<
  typeof simulationComparisonResultSchema
>;

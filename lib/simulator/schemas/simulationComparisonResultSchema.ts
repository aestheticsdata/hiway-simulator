import { z } from "zod";

import { simulationResultSchema } from "@lib/simulator/schemas/simulationResultSchema";

export const simulationComparisonResultSchema = z.object({
  annualGain: z.number(),
  micro: simulationResultSchema,
  monthlyGain: z.number(),
  optimalRegime: z.enum(["micro", "reel", "equivalent"]),
  reel: simulationResultSchema,
});

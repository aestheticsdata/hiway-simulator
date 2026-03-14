import { z } from "zod";

export const incomeCurvePointSchema = z.object({
  honoraires: z.number().min(0),
  isCurrentScenario: z.boolean(),
  revenuNetAnnuel: z.number(),
});

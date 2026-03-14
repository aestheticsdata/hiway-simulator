import { z } from "zod";

import { incomeCurveRangePresets } from "@lib/simulator/constants/incomeCurveRangePresets";
import { incomeCurvePointSchema } from "@lib/simulator/schemas/incomeCurvePointSchema";

export const incomeCurveResponseSchema = z.object({
  currentHonoraires: z.number().min(0),
  maxHonoraires: z.number().min(0),
  minHonoraires: z.number().min(0),
  points: z.array(incomeCurvePointSchema).min(2),
  rangePreset: z.enum(incomeCurveRangePresets),
});

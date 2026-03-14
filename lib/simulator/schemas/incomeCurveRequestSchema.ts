import { z } from "zod";

import { incomeCurveRangePresets } from "@lib/simulator/constants/incomeCurveRangePresets";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";

export const incomeCurveRequestSchema = simulatorFormSchema.extend({
  rangePreset: z.enum(incomeCurveRangePresets),
});

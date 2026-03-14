import { z } from "zod";

import { incomeCurveRequestSchema } from "@lib/simulator/schemas/incomeCurveRequestSchema";

export type IncomeCurveRequest = z.infer<typeof incomeCurveRequestSchema>;

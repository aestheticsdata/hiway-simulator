import { z } from "zod";

import { incomeCurveResponseSchema } from "@lib/simulator/schemas/incomeCurveResponseSchema";

export type IncomeCurveResponse = z.infer<typeof incomeCurveResponseSchema>;

import { z } from "zod";

import { cotisationRateSchema } from "@lib/simulator/schemas/cotisationRateSchema";

export type CotisationRate = z.infer<typeof cotisationRateSchema>;

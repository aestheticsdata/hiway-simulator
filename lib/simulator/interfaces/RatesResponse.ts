import { z } from "zod";

import { ratesResponseSchema } from "@lib/simulator/schemas/ratesResponseSchema";

export type RatesResponse = z.infer<typeof ratesResponseSchema>;

import { z } from "zod";

import { cotisationRateSchema } from "@lib/simulator/schemas/cotisationRateSchema";
import { taxBracketSchema } from "@lib/simulator/schemas/taxBracketSchema";

export const ratesResponseSchema = z.object({
  cotisations: z.array(cotisationRateSchema),
  taxBrackets: z.array(taxBracketSchema),
});

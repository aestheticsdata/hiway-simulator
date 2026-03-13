import { z } from "zod";

import { cotisationBreakdownItemSchema } from "@/lib/simulator/schemas/cotisationBreakdownItemSchema";

export const simulationPreviewSchema = z.object({
  bnc: z.number(),
  cotisations: z.array(cotisationBreakdownItemSchema),
  totalCotisations: z.number(),
  revenuImposable: z.number(),
  quotient: z.number(),
  impotParPart: z.number(),
  impotTotal: z.number(),
  revenuNetAnnuel: z.number(),
  revenuNetMensuel: z.number(),
  tauxGlobalPrelevements: z.number(),
});

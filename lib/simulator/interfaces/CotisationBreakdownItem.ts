import { z } from "zod";

import { cotisationBreakdownItemSchema } from "@lib/simulator/schemas/cotisationBreakdownItemSchema";

export type CotisationBreakdownItem = z.infer<typeof cotisationBreakdownItemSchema>;

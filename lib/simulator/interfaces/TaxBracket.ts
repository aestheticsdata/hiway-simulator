import { z } from "zod";

import { taxBracketSchema } from "@lib/simulator/schemas/taxBracketSchema";

export type TaxBracket = z.infer<typeof taxBracketSchema>;

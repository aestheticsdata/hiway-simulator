import { z } from "zod";

export const taxBracketSchema = z.object({
  from: z.number(),
  to: z.number().nullable(),
  rate: z.number(),
});

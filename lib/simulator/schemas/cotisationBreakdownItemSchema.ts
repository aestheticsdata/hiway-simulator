import { z } from "zod";

export const cotisationBreakdownItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  rate: z.number(),
  amount: z.number(),
});

import { z } from "zod";

import { fiscalRegimes } from "@lib/simulator/constants/fiscalRegimes";
import { simulatorPresentationTexts } from "@lib/simulator/texts";

const { validation } = simulatorPresentationTexts;

export const simulatorFormSchema = z.object({
  honoraires: z.number({ error: validation.feesRequired }).min(0, validation.feesPositive),
  charges: z.number({ error: validation.expensesRequired }).min(0, validation.expensesPositive),
  partsFiscales: z.number({ error: validation.taxSharesRequired }).min(1, validation.taxSharesMinimum),
  regime: z.enum(fiscalRegimes),
});

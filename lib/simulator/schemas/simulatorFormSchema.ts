import { z } from "zod";

import { fiscalRegimes } from "@/lib/simulator/constants/fiscalRegimes";

export const simulatorFormSchema = z.object({
  honoraires: z
    .number({ error: "Saisissez un montant d'honoraires." })
    .min(0, "Les honoraires doivent etre positifs."),
  charges: z
    .number({ error: "Saisissez un montant de charges." })
    .min(0, "Les charges doivent etre positives."),
  partsFiscales: z
    .number({ error: "Saisissez le nombre de parts fiscales." })
    .min(1, "Le foyer fiscal doit avoir au moins 1 part."),
  regime: z.enum(fiscalRegimes),
});

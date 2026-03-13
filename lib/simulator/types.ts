import { z } from "zod"

export const fiscalRegimes = ["micro", "reel"] as const

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
})

export type FiscalRegime = (typeof fiscalRegimes)[number]

export type SimulationFormValues = z.infer<typeof simulatorFormSchema>

export type CotisationBreakdownItem = {
  id: string
  label: string
  rate: number
  amount: number
}

export type SimulationPreview = {
  bnc: number
  cotisations: CotisationBreakdownItem[]
  totalCotisations: number
  revenuImposable: number
  quotient: number
  impotParPart: number
  impotTotal: number
  revenuNetAnnuel: number
  revenuNetMensuel: number
  tauxGlobalPrelevements: number
}

export const defaultFormValues: SimulationFormValues = {
  regime: "reel",
  honoraires: 120000,
  charges: 25000,
  partsFiscales: 2,
}

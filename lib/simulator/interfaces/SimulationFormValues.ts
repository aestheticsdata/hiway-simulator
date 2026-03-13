import { z } from "zod";

import { simulatorFormSchema } from "@/lib/simulator/schemas/simulatorFormSchema";

export type SimulationFormValues = z.infer<typeof simulatorFormSchema>

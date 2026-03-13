import { z } from "zod";

import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";

export type SimulationInput = z.infer<typeof simulatorFormSchema>;

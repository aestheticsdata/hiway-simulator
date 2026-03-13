import { z } from "zod";

import { simulationResultSchema } from "@lib/simulator/schemas/simulationResultSchema";

export type SimulationResult = z.infer<typeof simulationResultSchema>;

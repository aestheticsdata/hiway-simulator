import { z } from "zod";

import { simulationPreviewSchema } from "@/lib/simulator/schemas/simulationPreviewSchema";

export type SimulationPreview = z.infer<typeof simulationPreviewSchema>

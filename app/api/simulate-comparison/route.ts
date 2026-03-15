import { NextResponse } from "next/server";
import { z } from "zod";

import { calculateSimulationComparisonResult } from "@lib/simulator/server/calculateSimulationComparisonResult";
import { referenceRates } from "@lib/simulator/server/referenceRates";
import { simulationComparisonResultSchema } from "@lib/simulator/schemas/simulationComparisonResultSchema";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";

export async function POST(request: Request) {
  const requestBody: unknown = await request.json();
  const parsedInput = simulatorFormSchema.safeParse(requestBody);

  if (!parsedInput.success) {
    return NextResponse.json(
      {
        issues: z.flattenError(parsedInput.error),
        message: "Invalid simulation comparison payload.",
      },
      {
        status: 400,
      }
    );
  }

  const result = calculateSimulationComparisonResult(
    parsedInput.data,
    referenceRates
  );
  const responseBody = simulationComparisonResultSchema.parse(result);

  return NextResponse.json(responseBody);
}

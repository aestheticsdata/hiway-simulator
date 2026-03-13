import { NextResponse } from "next/server";

import { getDebugApiErrorModeFromHeaders } from "@lib/api/core/constants/debugApi";
import { referenceRates } from "@lib/simulator/constants/referenceRates";
import { calculateSimulationResult } from "@lib/simulator/engine/calculateSimulationResult";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";
import { simulationResultSchema } from "@lib/simulator/schemas/simulationResultSchema";

export async function POST(request: Request) {
  const debugMode = getDebugApiErrorModeFromHeaders(request.headers);

  if (debugMode === "simulate-500") {
    return NextResponse.json(
      { message: "Simulated simulation API failure." },
      { status: 500 }
    );
  }

  if (debugMode === "simulate-invalid-schema") {
    return NextResponse.json({
      broken: true,
      message: "Simulated invalid schema response.",
    });
  }

  const requestBody: unknown = await request.json();
  const parsedInput = simulatorFormSchema.safeParse(requestBody);

  if (!parsedInput.success) {
    return NextResponse.json(
      {
        issues: parsedInput.error.flatten(),
        message: "Invalid simulation payload.",
      },
      {
        status: 400,
      }
    );
  }

  const result = calculateSimulationResult(parsedInput.data, referenceRates);
  const responseBody = simulationResultSchema.parse(result);

  return NextResponse.json(responseBody);
}

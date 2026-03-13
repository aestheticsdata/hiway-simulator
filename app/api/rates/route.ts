import { NextResponse } from "next/server";

import { getDebugApiErrorModeFromHeaders } from "@lib/api/core/constants/debugApi";
import { referenceRates } from "@lib/simulator/constants/referenceRates";
import { ratesResponseSchema } from "@lib/simulator/schemas/ratesResponseSchema";

export async function GET(request: Request) {
  const debugMode = getDebugApiErrorModeFromHeaders(request.headers);

  if (debugMode === "rates-500") {
    return NextResponse.json(
      { message: "Simulated rates API failure." },
      { status: 500 }
    );
  }

  const responseBody = ratesResponseSchema.parse(referenceRates);

  return NextResponse.json(responseBody);
}

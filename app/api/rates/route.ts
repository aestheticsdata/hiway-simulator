import { NextResponse } from "next/server";

import { getDebugApiErrorModeFromHeaders } from "@lib/api/core/constants/debugApi";
import { ratesResponseSchema } from "@lib/simulator/schemas/ratesResponseSchema";
import { referenceRates } from "@lib/simulator/server/referenceRates";

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

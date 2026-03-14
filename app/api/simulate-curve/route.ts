import { NextResponse } from "next/server";
import { z } from "zod";

import { getDebugApiErrorModeFromHeaders } from "@lib/api/core/constants/debugApi";
import { incomeCurveRequestSchema } from "@lib/simulator/schemas/incomeCurveRequestSchema";
import { incomeCurveResponseSchema } from "@lib/simulator/schemas/incomeCurveResponseSchema";
import { calculateIncomeCurve } from "@lib/simulator/server/calculateIncomeCurve";
import { referenceRates } from "@lib/simulator/server/referenceRates";

export async function POST(request: Request) {
  const debugMode = getDebugApiErrorModeFromHeaders(request.headers);

  if (debugMode === "simulate-500") {
    return NextResponse.json(
      { message: "Simulated simulation curve API failure." },
      { status: 500 }
    );
  }

  if (debugMode === "simulate-invalid-schema") {
    return NextResponse.json({
      broken: true,
      message: "Simulated invalid schema curve response.",
    });
  }

  const requestBody: unknown = await request.json();
  const parsedRequest = incomeCurveRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        issues: z.flattenError(parsedRequest.error),
        message: "Invalid simulation curve payload.",
      },
      {
        status: 400,
      }
    );
  }

  const result = calculateIncomeCurve(parsedRequest.data, referenceRates);
  const responseBody = incomeCurveResponseSchema.parse(result);

  return NextResponse.json(responseBody);
}

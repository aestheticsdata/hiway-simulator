import { NextResponse } from "next/server";

import { referenceRates } from "@lib/simulator/constants/referenceRates";
import { ratesResponseSchema } from "@lib/simulator/schemas/ratesResponseSchema";

export async function GET() {
  const responseBody = ratesResponseSchema.parse(referenceRates);

  return NextResponse.json(responseBody);
}

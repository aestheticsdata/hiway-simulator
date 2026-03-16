import "server-only";

import { incomeCurveResponseSchema } from "@lib/simulator/schemas/incomeCurveResponseSchema";
import { calculateSimulationResult } from "@lib/simulator/server/calculateSimulationResult";

import type { IncomeCurveRangePreset } from "@lib/simulator/constants/incomeCurveRangePresets";
import type { IncomeCurveRequest } from "@lib/simulator/interfaces/IncomeCurveRequest";
import type { IncomeCurveResponse } from "@lib/simulator/interfaces/IncomeCurveResponse";
import type { RatesResponse } from "@lib/simulator/interfaces/RatesResponse";

const INCOME_CURVE_POINT_COUNT = 21;
const RANGE_ROUNDING_STEP = 5_000;
const SAMPLE_ROUNDING_STEP = 1_000;

const incomeCurveRangeConfig: Record<
  IncomeCurveRangePreset,
  {
    fallbackMaxHonoraires: number;
    maxMultiplier: number;
    minMultiplier: number;
  }
> = {
  focused: {
    fallbackMaxHonoraires: 50_000,
    maxMultiplier: 1.5,
    minMultiplier: 0.5,
  },
  standard: {
    fallbackMaxHonoraires: 100_000,
    maxMultiplier: 2,
    minMultiplier: 0,
  },
  wide: {
    fallbackMaxHonoraires: 200_000,
    maxMultiplier: 3,
    minMultiplier: 0,
  },
};

function roundDownToStep(value: number, step: number) {
  return Math.floor(value / step) * step;
}

function roundUpToStep(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

function roundToNearestStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

function getHonorairesBounds(honoraires: number, rangePreset: IncomeCurveRangePreset) {
  const config = incomeCurveRangeConfig[rangePreset];
  const minHonoraires = Math.max(0, roundDownToStep(honoraires * config.minMultiplier, RANGE_ROUNDING_STEP));
  const computedMaxHonoraires = honoraires > 0 ? honoraires * config.maxMultiplier : config.fallbackMaxHonoraires;
  const maxHonoraires = Math.max(
    roundUpToStep(computedMaxHonoraires, RANGE_ROUNDING_STEP),
    minHonoraires + RANGE_ROUNDING_STEP,
  );

  return {
    maxHonoraires,
    minHonoraires,
  };
}

function getSampleHonorairesValues(minHonoraires: number, maxHonoraires: number, currentHonoraires: number) {
  const step = (maxHonoraires - minHonoraires) / (INCOME_CURVE_POINT_COUNT - 1);
  const sampledHonoraires = new Set<number>([currentHonoraires]);

  for (let pointIndex = 0; pointIndex < INCOME_CURVE_POINT_COUNT; pointIndex += 1) {
    const value = minHonoraires + step * pointIndex;
    sampledHonoraires.add(roundToNearestStep(value, SAMPLE_ROUNDING_STEP));
  }

  return [...sampledHonoraires]
    .filter((honoraires) => honoraires >= minHonoraires && honoraires <= maxHonoraires)
    .sort((left, right) => left - right);
}

export function calculateIncomeCurve(request: IncomeCurveRequest, rates: RatesResponse): IncomeCurveResponse {
  const { rangePreset, ...input } = request;
  const { maxHonoraires, minHonoraires } = getHonorairesBounds(input.honoraires, rangePreset);
  const points = getSampleHonorairesValues(minHonoraires, maxHonoraires, input.honoraires).map((honoraires) => ({
    honoraires,
    isCurrentScenario: honoraires === input.honoraires,
    revenuNetAnnuel: calculateSimulationResult(
      {
        ...input,
        honoraires,
      },
      rates,
    ).revenuNetAnnuel,
  }));

  return incomeCurveResponseSchema.parse({
    currentHonoraires: input.honoraires,
    maxHonoraires,
    minHonoraires,
    points,
    rangePreset,
  });
}

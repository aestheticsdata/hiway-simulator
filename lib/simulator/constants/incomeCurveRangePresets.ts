export const incomeCurveRangePresets = [
  "focused",
  "standard",
  "wide",
] as const;

export type IncomeCurveRangePreset =
  (typeof incomeCurveRangePresets)[number];

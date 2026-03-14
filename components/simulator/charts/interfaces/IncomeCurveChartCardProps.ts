import type { IncomeCurveRangePreset } from "@lib/simulator/constants/incomeCurveRangePresets";
import type { FiscalRegime } from "@lib/simulator/interfaces/FiscalRegime";
import type { IncomeCurveResponse } from "@lib/simulator/interfaces/IncomeCurveResponse";

export interface IncomeCurveChartCardProps {
  curve?: IncomeCurveResponse;
  isLoading: boolean;
  isUpdating: boolean;
  onRangePresetChange: (value: IncomeCurveRangePreset) => void;
  rangePreset: IncomeCurveRangePreset;
  regime: FiscalRegime;
}

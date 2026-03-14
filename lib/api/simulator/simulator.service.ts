import type { ApiRequestOptions } from "@lib/api/core/interfaces/ApiRequestOptions";
import type { IncomeCurveRequest } from "@lib/simulator/interfaces/IncomeCurveRequest";
import { simulatorApi } from "@lib/api/simulator/simulator.api";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";

export const simulatorService = {
  loadRates(requestOptions?: ApiRequestOptions) {
    return simulatorApi.getRates(requestOptions);
  },
  runSimulation(input: SimulationInput, requestOptions?: ApiRequestOptions) {
    return simulatorApi.simulate(input, requestOptions);
  },
  runSimulationCurve(
    input: IncomeCurveRequest,
    requestOptions?: ApiRequestOptions
  ) {
    return simulatorApi.simulateCurve(input, requestOptions);
  },
};

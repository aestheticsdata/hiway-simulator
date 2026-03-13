import type { ApiRequestOptions } from "@lib/api/core/interfaces/ApiRequestOptions";
import { simulatorApi } from "@lib/api/simulator/simulator.api";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";

export const simulatorService = {
  loadRates(requestOptions?: ApiRequestOptions) {
    return simulatorApi.getRates(requestOptions);
  },
  runSimulation(input: SimulationInput, requestOptions?: ApiRequestOptions) {
    return simulatorApi.simulate(input, requestOptions);
  },
};

import { httpClient } from "@lib/api/core/httpClient";
import { ratesResponseSchema } from "@lib/simulator/schemas/ratesResponseSchema";
import { simulationResultSchema } from "@lib/simulator/schemas/simulationResultSchema";

import type { ApiRequestOptions } from "@lib/api/core/interfaces/ApiRequestOptions";
import type { RatesResponse } from "@lib/simulator/interfaces/RatesResponse";
import type { SimulationInput } from "@lib/simulator/interfaces/SimulationInput";
import type { SimulationResult } from "@lib/simulator/interfaces/SimulationResult";

export const simulatorApi = {
  getRates(requestOptions?: ApiRequestOptions) {
    return httpClient.get<RatesResponse>(
      "/api/rates",
      requestOptions,
      ratesResponseSchema
    );
  },
  simulate(input: SimulationInput, requestOptions?: ApiRequestOptions) {
    return httpClient.post<SimulationResult>(
      "/api/simulate",
      input,
      requestOptions,
      simulationResultSchema
    );
  },
};

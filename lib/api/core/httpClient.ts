import axios from "axios";
import { z, type ZodType } from "zod";

import { ApiException } from "@lib/api/core/ApiException";
import { getClientDebugApiHeaders } from "@lib/api/core/constants/debugApi";

import type { ApiRequestOptions } from "@lib/api/core/interfaces/ApiRequestOptions";

const DEFAULT_TIMEOUT = 10_000;

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  timeout: DEFAULT_TIMEOUT,
});

function getDefaultHeaders(headers?: Record<string, string>) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...getClientDebugApiHeaders(),
    ...headers,
  };
}

function parseResponseData<T>(
  endpoint: string,
  method: string,
  responseData: unknown,
  zodSchema?: ZodType<T>
) {
  if (!zodSchema) {
    return responseData as T;
  }

  const parsed = zodSchema.safeParse(responseData);

  if (!parsed.success) {
    throw new ApiException(`Invalid API response for ${method} ${endpoint}`, {
      details: z.prettifyError(parsed.error),
      endpoint,
      method,
    });
  }

  return parsed.data;
}

function normalizeError(
  error: unknown,
  endpoint: string,
  method: string
) {
  if (error instanceof ApiException) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const responseMessage =
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      "message" in error.response.data
        ? String(error.response.data.message)
        : error.message;

    return new ApiException(responseMessage || "API request failed", {
      cause: error,
      details: error.response?.data,
      endpoint,
      method,
      status: error.response?.status,
    });
  }

  return new ApiException("An unexpected API error occurred", {
    cause: error,
    endpoint,
    method,
  });
}

async function request<T>(
  endpoint: string,
  method: string,
  requestOptions: ApiRequestOptions = {},
  zodSchema?: ZodType<T>,
  data?: unknown
) {
  try {
    const response = await axiosClient.request<unknown>({
      ...requestOptions,
      url: endpoint,
      method,
      data,
      headers: getDefaultHeaders(
        requestOptions.headers as Record<string, string> | undefined
      ),
    });

    return parseResponseData(endpoint, method, response.data, zodSchema);
  } catch (error) {
    throw normalizeError(error, endpoint, method);
  }
}

export const httpClient = {
  delete<T>(
    endpoint: string,
    requestOptions: ApiRequestOptions = {},
    zodSchema?: ZodType<T>
  ) {
    return request<T>(endpoint, "DELETE", requestOptions, zodSchema);
  },
  get<T>(
    endpoint: string,
    requestOptions: ApiRequestOptions = {},
    zodSchema?: ZodType<T>
  ) {
    return request<T>(endpoint, "GET", requestOptions, zodSchema);
  },
  post<T>(
    endpoint: string,
    data?: unknown,
    requestOptions: ApiRequestOptions = {},
    zodSchema?: ZodType<T>
  ) {
    return request<T>(endpoint, "POST", requestOptions, zodSchema, data);
  },
  put<T>(
    endpoint: string,
    data?: unknown,
    requestOptions: ApiRequestOptions = {},
    zodSchema?: ZodType<T>
  ) {
    return request<T>(endpoint, "PUT", requestOptions, zodSchema, data);
  },
};

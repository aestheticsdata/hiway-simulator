export const DEBUG_API_ERROR_HEADER = "x-debug-api-error";
export const DEBUG_API_ERROR_STORAGE_KEY = "debug-api-error";

export const debugApiErrorModes = ["rates-500", "simulate-500", "simulate-invalid-schema"] as const;

export type DebugApiErrorMode = (typeof debugApiErrorModes)[number];

export function isDebugApiEnabled() {
  return process.env.NODE_ENV !== "production";
}

export function parseDebugApiErrorMode(value: string | null | undefined): DebugApiErrorMode | null {
  if (!value) {
    return null;
  }

  return debugApiErrorModes.includes(value as DebugApiErrorMode) ? (value as DebugApiErrorMode) : null;
}

export function getDebugApiErrorModeFromHeaders(headers: Headers) {
  if (!isDebugApiEnabled()) {
    return null;
  }

  return parseDebugApiErrorMode(headers.get(DEBUG_API_ERROR_HEADER));
}

export function getClientDebugApiHeaders() {
  if (!isDebugApiEnabled() || typeof window === "undefined") {
    return {};
  }

  const debugMode = parseDebugApiErrorMode(window.localStorage.getItem(DEBUG_API_ERROR_STORAGE_KEY));

  if (!debugMode) {
    return {};
  }

  return {
    [DEBUG_API_ERROR_HEADER]: debugMode,
  };
}

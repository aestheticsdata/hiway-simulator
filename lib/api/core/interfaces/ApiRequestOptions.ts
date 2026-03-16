import type { AxiosRequestConfig } from "axios";

export type ApiRequestOptions = Omit<AxiosRequestConfig, "baseURL" | "data" | "method" | "url">;

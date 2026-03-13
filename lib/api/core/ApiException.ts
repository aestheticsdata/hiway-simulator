interface ApiExceptionOptions {
  cause?: unknown;
  details?: unknown;
  endpoint?: string;
  method?: string;
  status?: number;
}

export class ApiException extends Error {
  cause?: unknown;
  details?: unknown;
  endpoint?: string;
  method?: string;
  status?: number;

  constructor(message: string, options: ApiExceptionOptions = {}) {
    super(message);
    this.name = "ApiException";
    this.cause = options.cause;
    this.details = options.details;
    this.endpoint = options.endpoint;
    this.method = options.method;
    this.status = options.status;
  }
}

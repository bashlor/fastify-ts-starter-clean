import { ServiceError } from '../../application/service/error/service.error.js';

const HttpCodes = {
  NotFound: 404,
  InvalidValues: 400,
  Unauthorized: 401,
  Forbidden: 403,
  Conflict: 409,
  Unknown: 500,
  InvalidOperation: 422,
  InternalError: 500,
  OperationFailed: 500,
} as const;

export type ErrorType = keyof typeof HttpCodes;

export type HttpErrorPayload = {
  code: number;
  instance: string;
  message: string;
  details?: string | string[] | Record<string, string | number | boolean>;
  additional?: string | string[];
};

function errorCodeToHttpStatus(errorType: ErrorType) {
  return errorType in HttpCodes ? HttpCodes[errorType] : HttpCodes.InternalError;
}

export function serviceErrorToHttpPayload(
  error: ServiceError,
  url: string,
  message: string,
  additional?: string | string[]
): HttpErrorPayload {
  const code = errorCodeToHttpStatus(error.code);

  return {
    code,
    instance: url,
    message: message,
    details: error.safeMessage,
    additional,
  };
}

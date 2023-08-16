import { ErrorCodeType } from './code.error.js';

export interface ServiceError {
  code: ErrorCodeType;
  internalError: Error;
  safeMessage: string;
}

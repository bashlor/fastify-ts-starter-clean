export class MapperError extends Error {
  constructor(error: Error | string, public readonly metadata?: unknown) {
    super(typeof error === 'string' ? error : error.message);
    Error.captureStackTrace(this, MapperError);
  }
}

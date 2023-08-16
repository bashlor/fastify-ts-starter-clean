export class RepositoryError extends Error {
  constructor(message: string, public readonly error?: Error, public readonly metadata?: unknown) {
    super(message);
    Error.captureStackTrace(this, RepositoryError);
  }
}

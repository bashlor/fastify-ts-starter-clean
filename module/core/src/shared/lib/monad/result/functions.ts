import {FailedOperation, SuccessfulOperation} from './type.js';



/** Creates a successful Result with the given value.
 * @param value The value of the successful computation.
 * @returns A Result with the 'ok' type and the provided value.*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Ok<T, E extends never>(value: T): SuccessfulOperation<T, E> {
    return {
        type: 'ok',
        value,
        unwrap: () => value,
        isErr: () => false,
        isOk: () => true,
        _unsafeUnwrap: () => value,
        try<T>(value):T {
            return value;
        }
    };
}

/**
 * Creates a failed Result with the given error.
 * @param error The error that caused the computation to fail.
 * @returns A Result with the 'error' type and the provided error.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Err<T extends never, E>(error: E): FailedOperation<T, E> {
    return {
        type: 'error',
        error,
        unwrap: () => { throw error; },
        isErr: () => true,
        isOk: () => false,
        _unsafeUnwrap: () => error,
        try(param) {
            if(param instanceof Function) {
                return param(error);
            }
            return param;
        }
    };
}

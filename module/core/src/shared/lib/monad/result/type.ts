

type TryFn<K, E> = (error: E) => K;

/** Represents a failed computation.*/
export interface FailedOperation<T, E> {
    type: 'error';
    error: E;
    /*** Returns the value of the Result if it is successful, otherwise throws an error.*/
    unwrap(): never;
    /*** Returns true if the Result is an error, false otherwise.*/
    isErr(): this is FailedOperation<never, E>;
    /*** Returns true if the Result is successful, false otherwise.*/
    isOk(): this is SuccessfulOperation<T, never>;
    /** Unsafe unwrap. Testing purposes only. */
    _unsafeUnwrap(): E;
    /** Try unwrap or return default value*/
    try<K>(defaultValue: K | TryFn<K,E>): K;

}

/** Represents a successful computation.*/
export interface SuccessfulOperation<T, E>{
    type: 'ok';
    value: T;
    /*** Returns the value of the Result.*/
    unwrap(): T;
    /*** Returns true if the Result is an error, false otherwise.*/
    isErr(): this is FailedOperation<never, E>;
    /*** Returns true if the Result is successful, false otherwise.*/
    isOk(): this is SuccessfulOperation<T,never>;
    /** Unsafe unwrap. Testing purposes only. */
    _unsafeUnwrap(): T;
    /** Try unwrap or return default value*/
    try<K>(defaultValue: K | TryFn<K,E>): K;
}

/** Represents a computation that may fail.*/
export type Result<T, E> = FailedOperation<T, E> | SuccessfulOperation<T, E>;

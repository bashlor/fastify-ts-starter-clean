export interface SomeType<T> {
    type: 'some';
    value: T;
    /*** Returns the value of the Option if it exists, otherwise throws an error.*/
    unwrap(): T;
    /*** Returns true if the Option contains a value, false otherwise.*/
    isSome(this: Option<T>): this is SomeType<T>;
    /*** Returns true if the Option does not contain a value, false otherwise.*/
    isNone(this: Option<T>): this is NoneType;
    /*** Calls the provided function if the Option contains a value.*/
    try(defaultValue:T): T;
}

export interface NoneType {
    type: 'none';
    /*** Throws an error because None does not contain a value.*/
    unwrap(): never;
    /*** Returns the provided default value because None does not contain a value.*/
    /*** Returns true if the Option contains a value, false otherwise.*/
    isSome<T>(this: Option<T>): this is SomeType<T>;
    /*** Returns true if the Option does not contain a value, false otherwise.*/
    isNone<T>(this: Option<T>): this is NoneType;
    /*** Calls the provided function if the Option does not contain a value.*/
    try<T>(defaultValue:T):T;
}

export type Option<T> = SomeType<T> | NoneType

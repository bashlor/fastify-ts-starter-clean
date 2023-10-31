import {Option} from './type.js';


/**
 * Creates an Option with a value.
 * @param value The value to be wrapped in the Option.
 * @returns An Option with the 'some' type and the provided value.
 */
export function Some<T>(value: T): Option<T> {
    return {
        type: 'some',
        value,
        unwrap: () => value,
        isSome: () => true,
        isNone: () => false,
        try(): T {
            return value;
        }
    };
}
/**
 * Represents an empty Option with no value.
 * @returns An Option with the 'none' type.
 */
export const None: Option<never> = {
    type: 'none',
    unwrap: () => { throw new Error('Cannot unwrap None'); },
    isSome: () => false,
    isNone: () => true,
    try<T>(defaultValue:T): T {
        return defaultValue;
    }
};
//Freezing the None object to prevent any changes.
Object.freeze(None);

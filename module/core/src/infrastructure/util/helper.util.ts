import { Result } from '../../shared/lib/monad/result/type.js';
import { Option } from '../../shared/lib/monad/some/type.js';

export function matchResult<T, E>(result: Result<T, E>, args: MatchResultArgs<T, E>) {
  if (result.isErr()) {
    return args.error(result.error);
  }
  return args.ok(result.unwrap());
}

export function matchOption<T, K>(option: Option<T>, args: MatchOptionArgs<T, K>) {
  if (option.isNone()) {
    return args.none();
  }
  return args.some(option.unwrap());
}


type MatchOptionArgs<T, K> = {
  some: (value: T) => T;
  none: () => K;
};

type MatchResultArgs<T, E> = {
  ok: (value: T) => unknown;
  error: (error: E) => unknown;
};
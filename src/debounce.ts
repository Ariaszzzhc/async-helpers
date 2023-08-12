export interface DebouncedFunction<T extends Array<unknown>> {
  (...args: T): void;
  /** Clears the debounce timeout and omits calling the debounced function. */
  clear(): void;
  /** Clears the debounce timeout and calls the debounced function immediately. */
  flush(): void;
  /** Returns a boolean whether a debounce call is pending or not. */
  readonly pending: boolean;
}

export function debounce<T extends Array<any>>(
  fn: (this: DebouncedFunction<T>, ...args: T) => void,
  wait: number
): DebouncedFunction<T> {
  let timeout: number | null = null;
  let flush: (() => void) | null = null;

  const debounced: DebouncedFunction<T> = ((...args: T) => {
    debounced.clear();
    flush = () => {
      debounced.clear();
      fn.call(debounced, ...args);
    };
    timeout = +setTimeout(flush, wait);
  }) as DebouncedFunction<T>;

  debounced.clear = () => {
    if (typeof timeout === "number") {
      clearTimeout(timeout);
      timeout = null;
      flush = null;
    }
  };

  debounced.flush = () => {
    flush?.();
  };

  Object.defineProperty(debounced, "pending", {
    get: () => typeof timeout === "number",
  });

  return debounced;
}

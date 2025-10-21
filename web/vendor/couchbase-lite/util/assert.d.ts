/** Assertion function that throws an exception. */
export declare function assert(condition: unknown, message?: string, ...params: unknown[]): asserts condition;
export declare function assertDefined<T>(t: T | undefined, what?: string): asserts t is T;
export declare function assertEqual<T>(actual: T, expected: T, what?: string): void;
export declare function assertionFailed(message: string, ...params: unknown[]): never;
export declare function check(condition: boolean, message: string, errorType?: new (msg: string) => Error): asserts condition;
export declare function checkNumber(val: unknown, what?: string): number;
export declare function checkString(val: unknown, what?: string): string;

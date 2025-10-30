/** Creates a randomized UUID string. (May not be cryptographically secure.) */
export declare function createRandomUUID(): string;
/** Creates a UUID(-ish) string without using the `crypto` API. Not cryptographically secure! */
export declare function createInsecureRandomUUID(): string;

//
// util/assert.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//


//////// ASSERTIONS:


/** Assertion function that throws an exception. */
export function assert(condition: unknown, message = "", ...params: unknown[]): asserts condition {
    if (!condition) assertionFailed(message, ...params);
}

export function assertDefined<T>(t: T | undefined, what?: string): asserts t is T {
    if (t === undefined)
        assertionFailed(`${what ?? "something"} is unexpectedly undefined`);
}

export function assertEqual<T>(actual: T, expected: T, what: string = "value") {
    if (actual !== expected)
        assertionFailed(`${what} should be ${expected} but is actually ${actual}`);
}

export function assertionFailed(message: string, ...params: unknown[]) : never {
    console.error(message || "assertion failed", ...params);
    throw Error("Assertion failed: " + message);
}


//////// CHECKS:


export function check(condition: boolean,
                      message: string,
                      errorType?: new(msg:string)=>Error): asserts condition {
    if (!condition) {
        console.error(`Check failed: ${message}`);
        throw new (errorType ?? Error)(message);
    }
}


export function checkNumber(val: unknown, what?: string): number {
    check(typeof val === 'number', `${what ?? "value"} must be a number`, TypeError);
    return val;
}


export function checkString(val: unknown, what?: string): string {
    check(typeof val === 'string', `${what ?? "value"} must be a string`, TypeError);
    return val;
}

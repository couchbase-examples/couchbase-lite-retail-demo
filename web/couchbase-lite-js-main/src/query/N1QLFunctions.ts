//
// query/N1QLFunctions.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { EqualValues } from "@/database/types";
import { decodeBase64, encodeBase64 } from "@/util/base64";
import type { JSONArray, JSONObject } from "@/util/json_types";
import type { CompiledExpr, DefinedValue, NonNullValue, Value } from "./eval";
import type { Expr } from "./schema";

import * as datefns from "date-fns";
import { TZDate } from "@date-fns/tz";
import RegExpEscapePolyfill from "regexp.escape";


/* REFERENCES:
   - https://docs.couchbase.com/cloud/n1ql/n1ql-language-reference/functions.html
   - https://docs.couchbase.com/couchbase-lite/current/c/query-n1ql-mobile-server-diffs.html
 */

/* eslint-disable camelcase */


// Backwards-compatible `RegExp.escape()` implementation
const EscapeRE = (Object.getOwnPropertyDescriptor(RegExp, 'escape')?.value as (s:string)=>string)
                 ?? RegExpEscapePolyfill;


//---- ARRAYS:


export function array_avg(a: NonNullValue): number | null {
    if (!Array.isArray(a)) return null;
    let sum = 0, count = 0;
    for (const item of a) {
        if (typeof item === 'number') {
            sum += item;
            count += 1;
        }
    }
    return count > 0 ? sum / count : null;
}

export function array_contains(a: NonNullValue, val: NonNullValue): boolean | null {
    if (!Array.isArray(a)) return null;
    if (typeCode(val) < TypeCode.ARRAY)
        return a.includes(val);
    else
        return a.some( item => equals(item, val) );
}

export function array_count(a: NonNullValue): number | null {
    if (!Array.isArray(a)) return null;
    let count = 0;
    for (const item of a)
        if (item !== null) ++count;
    return count;
}

export function array_ifnull(a: NonNullValue): DefinedValue {
    if (!Array.isArray(a)) return null;
    for (const item of a)
        if (item !== null) return item;
    return null;
}

export function array_length(a: NonNullValue): number | null {
    if (!Array.isArray(a)) return null;
    return a.length;
}

function array_minmax(a: NonNullValue, dir: number): DefinedValue {
    if (!Array.isArray(a)) return null;
    let most = null;
    let first = true;
    for (const item of a) {
        if (item !== null) {
            if (first || compare(item, most) === dir)
                most = item;
            first = false;
        }
    }
    return most;
}

export function array_max(a: NonNullValue): DefinedValue {return array_minmax(a, 1);}
export function array_min(a: NonNullValue): DefinedValue {return array_minmax(a, -1);}

export function array_sum(a: NonNullValue): number | null {
    if (!Array.isArray(a)) return null;
    let sum = 0;
    for (const item of a)
        if (typeof item === 'number') sum += item;
    return sum;
}


//---- COMPARISON:


export type Comparison = -1 | 0 | 1;
export type Direction  = -1 | 1;

/** Comparison of two JSON values. (Not a N1QL function, but the '=', '<', etc. operators use this.)
 *  Also compatible with IndexedDB and CouchDB. NOT the same as JS's relational operators.
 *  - Data types are ranked: undefined, null, boolean, number, string, array, object.
 *  - Two values of different types compare by their ranks.
 *  - Two values of the same _scalar_ type compare as they do in JS.
 *  - Two arrays are compared item by item; if all items are equal the longer array is greater.
 *  - Objects are first compared by length; objects of equal length are compared pairwise,
 *    with the pairs sorted by name. (N1QL docs, "Comparison Operators")
 *  @warning N1QL's relational operators treat NULL and MISSING (undefined) specially;
 *           this function doesn't do that. They should be detected before calling this.
 *  @returns -1 if a < b; 0 if a == b; 1 if a > b */
export function compare(a: Value, b: Value): Comparison {
    const typea = typeCode(a), typeb = typeCode(b);
    if (typea !== typeb)
        return Math.sign(typea - typeb) as Comparison;
    switch (typea) {
        case TypeCode.ARRAY: {
            const arraya = a as JSONArray, arrayb = b as JSONArray;
            const aLen = arraya.length, bLen = arrayb.length, minLen = Math.min(aLen, bLen);
            for (let i = 0; i < minLen; ++i) {
                const c = compare(arraya[i], arrayb[i]);
                if (c !== 0)
                    return c;
            }
            return Math.sign(aLen - bLen) as Comparison;
        }
        case TypeCode.OBJECT: {
            const obja = a as JSONObject, objb = b as JSONObject;
            const keysa = Object.getOwnPropertyNames(obja);
            const keysb = Object.getOwnPropertyNames(objb);
            const len = keysa.length;
            const lencmp = Math.sign(len - keysb.length);
            if (lencmp !== 0) return lencmp as Comparison;
            keysa.sort();
            keysb.sort();
            for (let i = 0; i < len; ++i) {
                const keya = keysa[i], keyb = keysb[i];
                if (keya !== keyb)
                    return (keya > keyb) ? 1 : -1;
                const cmp = compare(obja[keya], objb[keyb]);
                if (cmp !== 0) return cmp;
            }
            return 0;
        }
        default: {
            if ((a as NonNullValue) < (b as NonNullValue))
                return -1;
            else if ((a as NonNullValue) > (b as NonNullValue))
                return 1;
            else
                return 0;
        }
    }
}


/** Compares two values for equality; equivalent to N1QL's `IS` or `compare(a,b) === 0`.
 *  @warning N1QL's `=` operator treats NULL and MISSING (undefined) specially;
 *           this function doesn't do that. */
export function equals(a: Value, b: Value): boolean {
    if (a === undefined || b === undefined)
        return a === b;
    else
        return EqualValues(a, b);
}


/** Implements N1QL's rules for interpreting values as boolean:
 *  - MISSING, NULL, and FALSE are FALSE
 *  - numbers +0, -0, and NaN are FALSE
 *  - empty strings, arrays, and objects are FALSE
 *  - all other values are TRUE
 *  (From https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/booleanlogic.html)
 *
 *  This differs from JavaScript in that N1QL considers empty arrays and objects to be false. */
export function isTruthy(v: Value): boolean {
    if (!v)
        return false;
    else if (typeof v !== 'object')
        return true;
    else if (Array.isArray(v))
        return v.length > 0;
    else
        return Object.keys(v).length > 0;       // (ugh, is there a cheaper test for this?)
}


// Used in implementation of GREATEST() and LEAST().
export function greatest_or_least(argfs: CompiledExpr[], dir: Direction): DefinedValue {
    let most = undefined;
    for (const f of argfs) {
        const item = f();
        if (item !== undefined && item !== null) {
            if (most === undefined || compare(item, most) === dir)
                most = item;
        }
    }
    return most ?? null;
}


//---- CONDITIONAL:


export function missingif(a: Value, b: Value): Value {
    if (b === undefined || equals(a, b))
        return undefined;
    else if (b === null)
        return null;
    else
        return a;
}

export function nullif(a: Value, b: Value): Value {
    if (a === undefined || b === undefined)
        return undefined;
    else if (b === null || equals(a, b))
        return null;
    else
        return a;
}


//---- DATE/TIME:


const kYearScales: Record<string,number> = {'millennium': 1000, 'century': 100, 'decade': 10};

// https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/datefun.html#manipulating-components
// https://date-fns.org
type DateDiffFn = (date1: string | number, date2: string | number) => number;
const kDateDifferenceFns: Record<string,DateDiffFn> = {
    'year':         datefns.differenceInCalendarYears,
    'iso_year':     datefns.differenceInCalendarISOWeekYears,
    'quarter':      datefns.differenceInCalendarQuarters,
    'month':        datefns.differenceInCalendarMonths,
    'week':         datefns.differenceInCalendarWeeks,
    'iso_week':     datefns.differenceInCalendarISOWeeks,
    'day':          datefns.differenceInCalendarDays,
    'day_of_year':  datefns.differenceInCalendarDays,
    'doy':          datefns.differenceInCalendarDays,
    'hour':         datefns.differenceInHours,
    'minute':       datefns.differenceInMinutes,
    'second':       datefns.differenceInSeconds,
    'millisecond':  datefns.differenceInMilliseconds,
};

type DateAddFn = (date: string | number, n: number) => Date;
const kDateAddFns: Record<string,DateAddFn> = {
    'year':         datefns.addYears,
    'iso_year':     datefns.addISOWeekYears,
    'quarter':      datefns.addQuarters,
    'month':        datefns.addMonths,
    'week':         datefns.addWeeks,
    'day':          datefns.addDays,
    'hour':         datefns.addHours,
    'minute':       datefns.addMinutes,
    'second':       datefns.addSeconds,
    'millisecond':  datefns.addMilliseconds,
};


/** Implements both DATE_ADD_STR() and DATE_ADD_MILLIS(). */
export function date_add(date: string | number, n: number, part: string): string | number | null {
    let yearScale = kYearScales[part];
    if (yearScale !== undefined) {
        n *= yearScale;
        part = 'year';
    }
    const fn = kDateAddFns[part];
    if (fn === undefined) {
        console.error(`date_add_str(): Unsupported date part "${part}"`);
        return null;
    }
    const newDate = fn(date, n);
    return (typeof date === 'string') ? newDate.toISOString() : newDate.valueOf();
}


/** Implements both DATE_DIFF_STR() and DATE_DIFF_MILLIS(). */
export function date_diff(str1: string | number, str2: string | number, part: string): number | null {
    const fn = kDateDifferenceFns[part];
    if (fn !== undefined)
        return fn(str1, str2);
    let yearScale = kYearScales[part];
    if (yearScale !== undefined)
        return Math.trunc(datefns.differenceInCalendarYears(str1, str2) / yearScale);
    console.error(`date_diff_str(): Unsupported date part "${part}"`);
    return null;
}


export function millis_to_str(millis: number): string {
    return new TZDate(millis).toISOString();
}


export function millis_to_utc(millis: number): string {
    return new Date(millis).toISOString();
}


export function millis_to_tz(millis: number, tz?: string): string | null {
    if (tz === undefined) {
        return millis_to_str(millis);
    } else if (tz === "UTC") {
        return millis_to_utc(millis);
    } else {
        try {
            return new TZDate(millis, tz).toISOString();
        } catch (x) {
            if (!(x instanceof RangeError))
                throw x;
            console.error(`millis_to_tz(): Unknown time zone "${tz}"`);
            return null;
        }
    }
}

export function str_to_millis(str: string): number | null {
    const millis = Date.parse(str);
    return isNaN(millis) ? null : millis;
}


export function str_to_utc(str: string): string | null {
    const millis = Date.parse(str);
    return isNaN(millis) ? null : millis_to_utc(millis);
}


export function str_to_tz(str: string, tz?: string): string | null {
    const millis = Date.parse(str);
    return isNaN(millis) ? null : millis_to_tz(millis, tz);
}


//---- NUMERIC:


// CBL-compatible "/" operator. Integer division if both args are integral, else float.
export function div(numer: number, denom: number): number | null {
    let result = numer / denom;
    if (!isFinite(result))
        return null;
    if (numer === Math.floor(numer) && denom === Math.floor(denom))
        result = Math.floor(result);
    return result;
}

// Euclidean vector distance. `v1` and `v2` must be arrays of the same length, else it returns null.
// https://en.wikipedia.org/wiki/Euclidean_distance
export function euclidean_distance(arg1: Value, arg2: Value, power?: number): number | null {
    const v1 = decodeVector(arg1), v2 = decodeVector(arg2);
    if (v1 === undefined || v2 === undefined)
        return null;
    const len = v1.length;
    if (v2.length !== len)
        return null;
    let dist = 0.0;
    for (let i = 0; i < len; ++i) {
        const d = v1[i] - v2[i];
        dist += d * d;
    }
    return Math.pow(dist, (power ?? 1) / 2);
}

// Cosine vector distance. `v1` and `v2` must be arrays of the same length, else it returns null.
// https://en.wikipedia.org/wiki/Cosine_similarity
export function cosine_distance(arg1: Value, arg2: Value): number | null {
    const v1 = decodeVector(arg1), v2 = decodeVector(arg2);
    if (v1 === undefined || v2 === undefined)
        return null;
    const len = v1.length;
    if (v2.length !== len)
        return null;
    let aa = 0.0, ab = 0.0, bb = 0.0;
    for (let i = 0; i < len; ++i) {
        const a = v1[i], b = v2[i];
        aa += a * a;
        ab += a * b;
        bb += b * b;
    }
    return 1.0 - ab / Math.sqrt(aa * bb);
}

/** Decodes a vector that may have been encoded to a string by `encodeVector`.
 *  - An array is returned as itself, cast to `number[]`.
 *  - A string is decoded as base64 and returned as a `Float32Array`. If base64 decoding fails
 *    or the decoded data's length isn't a multiple of 4, returns `undefined`.
 *  - Any other data type causes `undefined` to be returned.  */
export function decodeVector(v: Value): number[] | Float32Array | undefined {
    if (Array.isArray(v)) {
        return v as number[];
    } else if (typeof v === 'string') {
        const bytes = decodeBase64(v);
        if (bytes === undefined || bytes.length % 4 !== 0)
            return undefined;
        return new Float32Array(bytes.buffer);
    } else {
        return undefined;
    }
}

/** Encodes a vector as a string that can be passed to `euclidean_distance` or `cosine_distance`.
 *  > Note:  This is not a query function; it's to be used when saving a vector in a document, or
 *  >        when setting a query parameter value. */
export function encodeVector(vec: number[] | Float32Array): string {
    if (!(vec instanceof Float32Array))
        vec = new Float32Array(vec);
    return encodeBase64(new Uint8Array(vec.buffer));
}

// Integer division
export function idiv(numer: number, denom: number): number | null {
    let result = numer / denom;
    if (!isFinite(result))
        return null;
    return Math.floor(result);
}

function scaledRound(n: number, digits: number, fn: (n:number)=>number): number | null {
    if (digits === 0)
        return fn(n);
    if (digits !== Math.trunc(digits))
        return null;
    const scale = Math.pow(10, digits);
    return fn(n * scale) / scale;
}

export function round(n: number, digits = 0): number | null {
    return scaledRound(n, digits, Math.round);
}

export function round_even(n: number, digits = 0): number | null {
    return scaledRound(n, digits, num => {
        const i = Math.floor(num);
        if (num - i === 0.5)
            return (i % 2) ? i + 1 : i;
        else
            return Math.round(num);
    });
}

export function trunc(n: number, digits: number): number | null {
    return scaledRound(n, digits, Math.trunc);
}


//---- PATTERN MATCHING:


/** N1QL's "LIKE" function. */
export function like(str: string, pattern: string): boolean {
    const [mode, literal] = likeMode(pattern);
    switch (mode) {
        case 0:  return str === literal;
        case 1:  return str.startsWith(literal);
        case 2:  return str.endsWith(literal);
        default: return regexpFromLike(pattern).test(str);
    }
}

/** Removes typical backslash escapes, replacing `\x` with `x` for any character x. */
export function unescapeBackslashes(pattern: string): string {
    return pattern.replaceAll(/\\(.)/g, "$1");
}

/** Converts a "LIKE" pattern to a RegExp. */
export function regexpFromLike(pattern: string): RegExp {
    const parts = pattern.split(/([%_])/);    // TODO: ensure no backslash before
    const len = parts.length;
    for (let i = 0; i < len; i++) {
        const part = parts[i];
        if (i & 1)
            parts[i] = (part === '%') ? '.*' : '.';
        else
            parts[i] = EscapeRE(part);
    }
    return new RegExp(parts.join(''));
}

/** Categorizes 'LIKE' patterns as one of: 0=literal, 1=prefix, 2=suffix or 3=complicated.
 *  Returns the category and the unescaped literal/prefix/suffix string (except category 3). */
export function likeMode(pattern: string): [number, string] {
    const xpat = pattern.replaceAll(/\\./g, '##'); // Hide escaped characters in following tests
    if (xpat.indexOf('_') >= 0)
        return [3, pattern];                // 3: just punt on underscores, they're uncommon
    let i = xpat.indexOf('%');
    if (i < 0)
        return [0, unescapeBackslashes(pattern)];                   // 0: just a literal string
    if (xpat.lastIndexOf('%') === i) {
        if (i === 0)
            return [2, unescapeBackslashes(pattern.slice(1))];      // 2: suffix match
        else if (i === xpat.length - 1)
            return [1, unescapeBackslashes(pattern.slice(0, -1))];  // 1: prefix match
    }
    return [3, pattern];                                            // 3: it's complicated
}


//---- STRINGS:


export function length(str: string): number {
    // N1QL docs say "This function works with single bytes, not multi-byte characters".
    // Presumably that means UTF-8 encoding. But JS strings are UTF-16...
    const len = str.length;
    for (let i = 0; i < len; ++i) {
        if (str.charCodeAt(i) > 0x7F)
            return new TextEncoder().encode(str).length; // slower, but accurate for non-ASCII
    }
    return len;
}

export function ltrim(str: string, remove: string) {
    const len = str.length;
    for (let i = 0; i < len; ++i)
        if (!remove.includes(str[i]))
            return str.slice(i);
    return "";
}

export function rtrim(str: string, remove: string) {
    const len = str.length;
    for (let i = len - 1; i >= 0; --i)
        if (!remove.includes(str[i]))
            return str.slice(0, i + 1);
    return "";
}

export function trim(str: string, remove: string) {
    return ltrim(rtrim(str, remove), remove);
}


//---- TYPES:


// Note: The semantics of these are subtle, esp. around NULL/MISSING. Check the docs!!

export const isarray = Array.isArray;
export function isboolean(a: NonNullValue): boolean {return typeof a === 'boolean';}
export function isnumber(a: NonNullValue): boolean {return typeof a === 'number';}
export function isstring(a: NonNullValue): boolean {return typeof a === 'string';}
export function isobject(a: NonNullValue): boolean {return typeof a === 'object' && !Array.isArray(a);}
export function isvalued(a: Value): boolean {return a !== undefined && a !== null;}

export function isatom(a: NonNullValue): boolean {
    const typ = typeof a;
    return typ === 'boolean' || typ === 'number' || typ === 'string';
}

export function toarray(a: NonNullValue): JSONArray {return Array.isArray(a) ? a : [a];}

export function toatom(a: Value): Value {
    if (typeof a !== 'object' || a === null) {
        return a;
    } else if (Array.isArray(a)) {
        if (a.length === 1)
            return toatom(a[0]);
    } else {
        const keys = Object.getOwnPropertyNames(a);
        if (keys.length === 1)
            return toatom(a[keys[0]]);
    }
    return null;
}

export function toboolean(a: NonNullValue): boolean {
    if (!a)
        return false;               // false, ±0, NaN, "" -> false
    else if (typeof a !== 'object')
        return true;                // other boolean, number, string -> true
    else if (Array.isArray(a))
        return a.length > 0;        // nonempty arrays -> true
    else
        return Object.getOwnPropertyNames(a).length > 0; // nonempty objects -> true
}

export function tonumber(a: NonNullValue): number | null {
    switch (typeof a) {
        case 'number': return a;
        case 'boolean': return Number(a);
        case 'string': {
            const n = Number(a);
            return isNaN(n) ? null : n;
        }
        default: return null;
    }
}

export function toobject(a: NonNullValue): Value {
    if (typeof a === 'object' && !Array.isArray(a))
        return a;
    else
        return {};
}

export function tostring(a: NonNullValue): string | null {
    switch (typeof a) {
        case 'string':  return a;
        case 'number':
        case 'boolean': return String(a);
        default:        return null;
    }
}


export function type(a: Value): string {
    return kTypeNames[typeCode(a)];
}


export enum TypeCode { UNDEFINED = 0, NULL, BOOLEAN, NUMBER, STRING, ARRAY, OBJECT }
const kTypeNames = ['missing', 'null', 'boolean', 'number', 'string', 'array', 'object'];


/** Returns a value's type as an integer `TypeCode` enum. (Not a N1QL function.) */
export function typeCode(val: Value): TypeCode {
    switch (typeof val) {
        case 'undefined':           return TypeCode.UNDEFINED;
        case 'boolean':             return TypeCode.BOOLEAN;
        case 'number':              return TypeCode.NUMBER;
        case 'string':              return TypeCode.STRING;
        case 'object':
            if (Array.isArray(val)) return TypeCode.ARRAY;
            else if (val === null)  return TypeCode.NULL;
            else                    return TypeCode.OBJECT;
    }
}


//---- AGGREGATE FUNCTIONS:


/** An instance of an aggregate function. @internal */
export abstract class Aggregate {
    constructor(public readonly sourceExpression: Expr,
                public readonly compiledArg: CompiledExpr) { }

    /** Resets state before accumulating more values. */
    abstract reset(): void;

    /** Adds the current value of the compiledArg to my state. */
    accumulate() {this.add(this.compiledArg());};

    /** Returns the current result. */
    abstract get result(): DefinedValue;

    /* Creates a copy of myself. The copy starts out reset; state is not copied. */
    abstract clone(): Aggregate;

    /** Adds `value` to my internal state. */
    protected abstract add(value: Value): void;
};


// ARRAY_AGG
export class ArrayAggregate extends Aggregate {
    clone() {return new ArrayAggregate(this.sourceExpression, this.compiledArg);}
    reset() {this.result = [];}
    add(value: Value) {
        if (value !== undefined) this.result.push(value);
    }
    result: DefinedValue[] = [];
}

// AVG
export class AvgAggregate extends Aggregate {
    clone() {return new AvgAggregate(this.sourceExpression, this.compiledArg);}
    reset() {this.#count = this.#total = 0;}
    add(value: Value) {
        if (typeof value === 'number') {
            this.#count += 1;
            this.#total += value;
        }
    }
    get result() {
        return this.#count ? (this.#total / this.#count) : null;
    }

    #count = 0;
    #total = 0;
}

// COUNT
export class CountAggregate extends Aggregate {
    clone() {return new CountAggregate(this.sourceExpression, this.compiledArg);}
    reset() {this.result = 0;}
    add(_value: Value) {
        this.result++;
    }
    result = 0;
}

// MAX
export class MaxAggregate extends Aggregate {
    clone() {return new MaxAggregate(this.sourceExpression, this.compiledArg);}
    reset() {this.result = null;}
    add(value: Value) {
        if (value !== undefined && value !== null) {
            if (this.result === null || compare(value, this.result) > 0)
                this.result = value;
        }
    }
    result: DefinedValue = null;
}

// MIN
export class MinAggregate extends Aggregate {
    clone() {return new MinAggregate(this.sourceExpression, this.compiledArg);}
    reset() {this.result = null;}
    add(value: Value) {
        if (value !== undefined && value !== null) {
            if (this.result === null || compare(value, this.result) < 0)
                this.result = value;
        }
    }
    result: DefinedValue = null;
}

// SUM
export class SumAggregate extends Aggregate {
    clone() {return new SumAggregate(this.sourceExpression, this.compiledArg);}
    reset() {this.result = 0;}
    add(value: Value) {
        if (typeof value === 'number')
            this.result += value;
    }
    result = 0;
}

import { JSONArray } from '../util/json_types';
import { CompiledExpr, DefinedValue, NonNullValue, Value } from './eval';
import { Expr } from './schema';
export declare function array_avg(a: NonNullValue): number | null;
export declare function array_contains(a: NonNullValue, val: NonNullValue): boolean | null;
export declare function array_count(a: NonNullValue): number | null;
export declare function array_ifnull(a: NonNullValue): DefinedValue;
export declare function array_length(a: NonNullValue): number | null;
export declare function array_max(a: NonNullValue): DefinedValue;
export declare function array_min(a: NonNullValue): DefinedValue;
export declare function array_sum(a: NonNullValue): number | null;
export type Comparison = -1 | 0 | 1;
export type Direction = -1 | 1;
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
export declare function compare(a: Value, b: Value): Comparison;
/** Compares two values for equality; equivalent to N1QL's `IS` or `compare(a,b) === 0`.
 *  @warning N1QL's `=` operator treats NULL and MISSING (undefined) specially;
 *           this function doesn't do that. */
export declare function equals(a: Value, b: Value): boolean;
/** Implements N1QL's rules for interpreting values as boolean:
 *  - MISSING, NULL, and FALSE are FALSE
 *  - numbers +0, -0, and NaN are FALSE
 *  - empty strings, arrays, and objects are FALSE
 *  - all other values are TRUE
 *  (From https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/booleanlogic.html)
 *
 *  This differs from JavaScript in that N1QL considers empty arrays and objects to be false. */
export declare function isTruthy(v: Value): boolean;
export declare function greatest_or_least(argfs: CompiledExpr[], dir: Direction): DefinedValue;
export declare function missingif(a: Value, b: Value): Value;
export declare function nullif(a: Value, b: Value): Value;
/** Implements both DATE_ADD_STR() and DATE_ADD_MILLIS(). */
export declare function date_add(date: string | number, n: number, part: string): string | number | null;
/** Implements both DATE_DIFF_STR() and DATE_DIFF_MILLIS(). */
export declare function date_diff(str1: string | number, str2: string | number, part: string): number | null;
export declare function millis_to_str(millis: number): string;
export declare function millis_to_utc(millis: number): string;
export declare function millis_to_tz(millis: number, tz?: string): string | null;
export declare function str_to_millis(str: string): number | null;
export declare function str_to_utc(str: string): string | null;
export declare function str_to_tz(str: string, tz?: string): string | null;
export declare function div(numer: number, denom: number): number | null;
export declare function euclidean_distance(arg1: Value, arg2: Value, power?: number): number | null;
export declare function cosine_distance(arg1: Value, arg2: Value): number | null;
/** Decodes a vector that may have been encoded to a string by `encodeVector`.
 *  - An array is returned as itself, cast to `number[]`.
 *  - A string is decoded as base64 and returned as a `Float32Array`. If base64 decoding fails
 *    or the decoded data's length isn't a multiple of 4, returns `undefined`.
 *  - Any other data type causes `undefined` to be returned.  */
export declare function decodeVector(v: Value): number[] | Float32Array | undefined;
/** Encodes a vector as a string that can be passed to `euclidean_distance` or `cosine_distance`.
 *  > Note:  This is not a query function; it's to be used when saving a vector in a document, or
 *  >        when setting a query parameter value. */
export declare function encodeVector(vec: number[] | Float32Array): string;
export declare function idiv(numer: number, denom: number): number | null;
export declare function round(n: number, digits?: number): number | null;
export declare function round_even(n: number, digits?: number): number | null;
export declare function trunc(n: number, digits: number): number | null;
/** N1QL's "LIKE" function. */
export declare function like(str: string, pattern: string): boolean;
/** Removes typical backslash escapes, replacing `\x` with `x` for any character x. */
export declare function unescapeBackslashes(pattern: string): string;
/** Converts a "LIKE" pattern to a RegExp. */
export declare function regexpFromLike(pattern: string): RegExp;
/** Categorizes 'LIKE' patterns as one of: 0=literal, 1=prefix, 2=suffix or 3=complicated.
 *  Returns the category and the unescaped literal/prefix/suffix string (except category 3). */
export declare function likeMode(pattern: string): [number, string];
export declare function length(str: string): number;
export declare function ltrim(str: string, remove: string): string;
export declare function rtrim(str: string, remove: string): string;
export declare function trim(str: string, remove: string): string;
export declare const isarray: (arg: any) => arg is any[];
export declare function isboolean(a: NonNullValue): boolean;
export declare function isnumber(a: NonNullValue): boolean;
export declare function isstring(a: NonNullValue): boolean;
export declare function isobject(a: NonNullValue): boolean;
export declare function isvalued(a: Value): boolean;
export declare function isatom(a: NonNullValue): boolean;
export declare function toarray(a: NonNullValue): JSONArray;
export declare function toatom(a: Value): Value;
export declare function toboolean(a: NonNullValue): boolean;
export declare function tonumber(a: NonNullValue): number | null;
export declare function toobject(a: NonNullValue): Value;
export declare function tostring(a: NonNullValue): string | null;
export declare function type(a: Value): string;
export declare enum TypeCode {
    UNDEFINED = 0,
    NULL = 1,
    BOOLEAN = 2,
    NUMBER = 3,
    STRING = 4,
    ARRAY = 5,
    OBJECT = 6
}
/** Returns a value's type as an integer `TypeCode` enum. (Not a N1QL function.) */
export declare function typeCode(val: Value): TypeCode;
/** An instance of an aggregate function. @internal */
export declare abstract class Aggregate {
    readonly sourceExpression: Expr;
    readonly compiledArg: CompiledExpr;
    constructor(sourceExpression: Expr, compiledArg: CompiledExpr);
    /** Resets state before accumulating more values. */
    abstract reset(): void;
    /** Adds the current value of the compiledArg to my state. */
    accumulate(): void;
    /** Returns the current result. */
    abstract get result(): DefinedValue;
    abstract clone(): Aggregate;
    /** Adds `value` to my internal state. */
    protected abstract add(value: Value): void;
}
export declare class ArrayAggregate extends Aggregate {
    clone(): ArrayAggregate;
    reset(): void;
    add(value: Value): void;
    result: DefinedValue[];
}
export declare class AvgAggregate extends Aggregate {
    #private;
    clone(): AvgAggregate;
    reset(): void;
    add(value: Value): void;
    get result(): number | null;
}
export declare class CountAggregate extends Aggregate {
    clone(): CountAggregate;
    reset(): void;
    add(_value: Value): void;
    result: number;
}
export declare class MaxAggregate extends Aggregate {
    clone(): MaxAggregate;
    reset(): void;
    add(value: Value): void;
    result: DefinedValue;
}
export declare class MinAggregate extends Aggregate {
    clone(): MinAggregate;
    reset(): void;
    add(value: Value): void;
    result: DefinedValue;
}
export declare class SumAggregate extends Aggregate {
    clone(): SumAggregate;
    reset(): void;
    add(value: Value): void;
    result: number;
}

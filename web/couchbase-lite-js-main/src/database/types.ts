//
// types.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { JSONObject } from "@/util/json_types";
import { Blob } from "@/blob/blob";

/** An array in a CBLDocument. Can contain any JSON type as well as {@link Blob}s. */
export type CBLArray = Array<CBLValue>;

/** An object in a CBLDocument. Values can be any JSON type as well as {@link Blob}s. */
export type CBLDictionary = { [key: string]: CBLValue };

/** A value that can occur in a CBLDocument. JSON types plus {@link Blob}. */
export type CBLValue = null | boolean | number | string | CBLDictionary | CBLArray | Blob;


/** A document ID, equivalent to the primary key.
 *  Make a string into a DocID by using `as DocID`, or by calling the `DocID()` function. */
export type DocID = string & {__brand: "DocID"};

export function DocID(id: string) {return id as DocID;}


/** A revision ID, a string that uniquely identifies one revision of its document.
 *  Every time a document is saved (locally or on the server) its revision ID changes.
 *  @remarks
 *  RevIDs are mostly opaque, but the initial portion before the "-" is a generation number
 *  that indicates how many times the document has been changed. */
export type RevID = string & {__brand: "RevID"};


/** A chronological sequence in a local database.
    These are integers starting from 1, where newer changes are greater. */
export type Sequence = number & {__brand: "Sequence"};


/** The metadata of a local document revision. Used by {@link PusherConfig.filter}.
 *  @interface
 *  @property id        The document ID (primary key)
 *  @property rev       The revision ID
 *  @property deleted   `1` if this is a deletion (tombstone). */
export interface RevisionInfo {
    readonly id         : DocID;
    readonly rev        : RevID;
    readonly deleted?   : 1;        // indexed, so it cannot be a boolean :(
}


/** A document revision with its body.
 *  @property body  The document body, containing app-specific properties.
 */
export interface Revision extends RevisionInfo {
    body: JSONObject;
}


//////// TYPE TESTS:


/** Type guard that tests if a value is a CBLArray. */
export function isArray(val: CBLValue | undefined) : val is CBLArray {
    return Array.isArray(val);
}

/** Type guard that tests if a value is a CBLDictionary. */
export function isDictionary(val: CBLValue | undefined) : val is CBLDictionary {
    return typeof val === "object" && val !== null && !isArray(val) && !isBlob(val);
}

/** Type guard that tests if a value is a Blob. */
export function isBlob(val: CBLValue | undefined) : val is Blob {
    return val instanceof Blob;
}


/** Returns a value as a CBLArray if it is one, else `undefined`. */
export function asArray(val: CBLValue | undefined) : CBLArray | undefined {
    return isArray(val) ? val : undefined;
}

/** Returns a value as a CBLDictionary if it is one, else `undefined`. */
export function asDictionary(val: CBLValue | undefined) : CBLDictionary | undefined {
    return isDictionary(val) ? val : undefined;
}

/** Returns a value as a Blob if it is one, else `undefined`. */
export function asBlob(val: CBLValue | undefined) : Blob | undefined {
    return isBlob(val) ? val : undefined;
}


//////// DOC/REV ID VALIDATION:


export function isValidDocID(id: unknown): id is DocID {
    return typeof(id) === "string" && id.length > 0 && id.length < 256 && id[0] !== "_";
}

export function isValidRevID(id: unknown): id is RevID {
    return typeof(id) === "string" && id.length > 0 && id.length < 256;
}

export function assertValidDocID(id: unknown): asserts id is DocID {
    if (!isValidDocID(id))
        throw Error(`"${id}" is not a valid document ID`);
}


//////// COPYING VALUES:


/** Makes a deep copy of a CBLValue. (Arrays and Dictionaries are copied; not other types.) */
export function CopyValue(value: CBLValue, deep = true) : CBLValue {
    if (isArray(value))
        return CopyArray(value, deep);
    else if (isDictionary(value))
        return CopyDict(value, deep);
    else
        return value; // no-op for: null, boolean, number, string, Blob
}

export function CopyArray(arr: CBLArray, deep = true) {
    if (!deep)
        return arr.slice(); // shallow copy
    const cp: CBLArray = new Array<CBLValue>(arr.length);
    let i = 0;
    for (const val of arr)
        cp[i++] = CopyValue(val, true);
    return cp;
}

export function CopyDict<T extends CBLDictionary = CBLDictionary>(dict: T, deep = true): T {
    const cp: CBLDictionary = {};
    for (const key of Object.getOwnPropertyNames(dict)) {
        const val = dict[key];
        cp[key] = (deep ? CopyValue(val, true) : val);
    }
    return cp as T;
}


//////// COMPARING VALUES:


/** Deep equality test of two document values. */
export function EqualValues(a: CBLValue | undefined, b: CBLValue | undefined): boolean {
    const type = typeof a;
    if (type !== typeof b)
        return false;
    if (type !== 'object' || a === null) {
        return a === b;
    } else if (Array.isArray(a)) {
        const length = a.length;
        if (!Array.isArray(b) || length !== b.length)
            return false;
        return a.every( (aitem, i) => EqualValues(aitem, b[i]) );
    } else {
        const aobj = a as CBLDictionary, bobj = b as CBLDictionary;
        const keysa = Object.keys(aobj);
        if (keysa.length !== Object.keys(bobj).length)
            return false;
        return keysa.every( key => EqualValues(aobj[key], bobj[key]) );
    }
}

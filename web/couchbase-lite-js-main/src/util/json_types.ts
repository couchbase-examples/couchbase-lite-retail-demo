//
// util/json_types.ts
// TypeScript types for JSON-compatible values.
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//


/** A JSON array. */
export type JSONArray = Array<JSONValue>;

/** A JSON object. */
export type JSONObject = { [key: string]: JSONValue };

/** A JSON object or array. */
export type JSONCollection = JSONObject | JSONArray;

/** A JSON scalar (non-collection) value, except `null`. */
export type JSONScalar = boolean | number | string;

/** Any JSON-compatible value, including `null`. */
export type JSONValue = JSONScalar | JSONCollection | null;


export function isJSONArray(o: JSONValue) : o is JSONArray {
    return Array.isArray(o);
}

export function isJSONObject(o: JSONValue) : o is JSONObject {
    return typeof(o) === 'object' && !Array.isArray(o) && o !== null;
}

//
// util/jsonMap.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { assert } from "@/util/assert";

export type JSONValue = JSONScalar | JSONArray | JSONObject;
export type JSONScalar = null | boolean | number | string;
export type JSONArray = Array<JSONValue>;
export type JSONObject = { [key: string]: JSONValue };

export type JSONMapKey = JSONValue | undefined;


/** A key-value map whose keys can be any JSON value plus `undefined`.
 *  Keys are compared by deep equality.
 *  @warning  Unlike Map, JSONMap does _not_ preserve the order of keys. */
export class JSONMap<T> {

    get size(): number {
        return this.#scalars.size + this.#arrays.size + this.#objects.size;
    }


    /** Returns the value (T) associated with `key`, else `undefined`. */
    get(key: JSONMapKey): T | undefined {
        if (typeof key !== 'object' || key === null) {
            return this.#scalars.get(key);
        } else if (Array.isArray(key)) {
            const keyStr = this.encodeExistingKey(key, this.#arrayItemMap);
            return keyStr !== undefined ? this.#arrays.get(keyStr) : undefined;
        } else {
            if (!this.#objectItemMap)
                return undefined;
            const arrayKey = this.objectToArray(key);
            const keyStr = this.encodeExistingKey(arrayKey, this.#objectItemMap);
            return keyStr !== undefined ? this.#objects.get(keyStr) : undefined;
        }
    }


    /** Sets the value of `key` to `value`, replacing any existing value. */
    set(key: JSONMapKey, value: T) {
        if (typeof key !== 'object' || key === null) {
            this.#scalars.set(key, value);
        } else if (Array.isArray(key)) {
            this.#arrays.set(this.encodeArrayKey(key), value);
        } else {
            this.#objects.set(this.encodeObjectKey(key), value);
        }
    }


    /** Adds a new key `key` with value `value` and returns true;
     *  if `key` already has a value, does nothing and returns false. */
    insert(key: JSONMapKey, value: T): boolean {
        if (typeof key !== 'object' || key === null) {
            return insert(this.#scalars, key, value);
        } else if (Array.isArray(key)) {
            return insert(this.#arrays, this.encodeArrayKey(key), value);
        } else {
            return insert(this.#objects, this.encodeObjectKey(key), value);
        }
    }


    /** Returns the value (T) associated with the `key`.
     *  If there isn't one yet, it calls the `makeValue` function to create one and adds it.
     *  > Note:  With complex keys this is more efficient than calling `get` and then `insert`. */
    upsert(key: JSONMapKey, makeValue: ()=>T): T {
        if (typeof key !== 'object' || key === null) {
            return upsert(this.#scalars, key, makeValue);
        } else if (Array.isArray(key)) {
            return upsert(this.#arrays, this.encodeArrayKey(key), makeValue);
        } else {
            return upsert(this.#objects, this.encodeObjectKey(key), makeValue);
        }
    }


    [Symbol.iterator]() {return this.entries();}


    * entries(): Generator<[JSONMapKey, T]> {
        for (let entry of this.#scalars.entries())
            yield entry;
        for (let [keyStr, v] of this.#arrays.entries())
            yield [this.decodeArrayKey(keyStr), v];
        for (let [keyStr, v] of this.#objects.entries())
            yield [this.decodeObjectKey(keyStr), v];
    }


    * keys(): Generator<JSONMapKey> {
        for (let k of this.#scalars.keys())
            yield k;
        for (let keyStr of this.#arrays.keys())
            yield this.decodeArrayKey(keyStr);
        for (let keyStr of this.#arrays.keys())
            yield this.decodeObjectKey(keyStr);
    }


    * values(): Generator<T> {
        for (let v of this.#scalars.values())
            yield v;
        for (let v of this.#arrays.values())
            yield v;
        for (let v of this.#objects.values())
            yield v;
    }


    toString(): string {
        let lines: string[] = ["JSONMap {"];
        for (const [key, value] of this)
            lines.push(`\t${JSON.stringify(key)} : ${JSON.stringify(value)}`);
        lines.push("}");
        return lines.join('\n');
    }


    //---- INTERNALS:


    /** Maps each array item to a unique number and joins those numbers in a string. */
    private encodeArrayKey(key: JSONArray): string {
        let itemMap = this.#arrayItemMap;
        if (!itemMap)
            itemMap = this.#arrayItemMap = new JSONMap<number>();
        return key.map( item => itemMap.upsert(item, () => {
            this.#arrayKeys.push(item);
            return this.#arrayKeys.length - 1;
        }) ).toString();
    }

    /** Converts an encoded array key back into the same array. */
    private decodeArrayKey(keyStr: string): JSONArray {
        return (keyStr !== "") ? keyStr.split(',').map(i => this.#arrayKeys[Number(i)]) : [];
    }


    private encodeExistingKey(array: JSONArray, itemMap?: JSONMap<number>): string | undefined {
        if (!itemMap)
            return undefined;
        let items = [];
        for (const item of array) {
            const i = itemMap.get(item);
            if (i === undefined)
                return undefined;
            items.push(i);
        }
        return items.toString();
    }


    /** Converts an object to an array consisting of the values sorted by key,
     *  ending with an array of sorted keys. */
    private objectToArray(key: JSONObject): JSONArray {
        const shape = Object.keys(key).sort();
        const arrayKey = shape.map( k => key[k] );
        arrayKey.push(shape);
        return arrayKey;
    }

    private encodeObjectKey(key: JSONObject): string {
        let itemMap = this.#objectItemMap;
        if (!itemMap)
            itemMap = this.#objectItemMap = new JSONMap<number>();
        const arrayKey = this.objectToArray(key);
        return arrayKey.map( item => itemMap.upsert(item, () => {
            this.#objectKeys.push(item);
            return this.#objectKeys.length - 1;
        }) ).toString();
    }

    /** Converts an encoded object key back into the same object. */
    private decodeObjectKey(keyStr: string): JSONObject {
        if (keyStr === "")
            return {};
        const pieces = keyStr.split(',').map(i => this.#objectKeys[Number(i)]);
        const shape = pieces.pop() as string[];
        assert(pieces.length === shape.length);

        let obj: JSONObject = {};
        for (let i = 0; i < shape.length; ++i)
            obj[shape[i]] = pieces[i];
        return obj;
    }


    /*  # How It Works:

        Scalar keys are stored in the #scalars Map, array keys in #arrays, object keys in #objects.

        Array keys are converted to strings.
        To convert an array to a string, each item is first mapped to a number.
        The mapping for this is #arrayItemMap, a nested JSONMap,
        whose values are consecutive integers starting at 0.
        Those integers are concatenated separated by commas to form the key string.

        Object keys are converted to arrays, then processed like array keys (above),
        but using a different JSONMap, #objectItemMap, to avoid collisions with arrays.
        To convert an object to an array, first its keys are sorted alphabetically.
        The values are put into an array, ordered by key; then the array of keys is added.
        For example, {b: 12, a: 34} turns into [34, 12, ["a", "b"]].

        (The reason for doing it this way is that it's expected that lots of objects will have
        the same set of keys, or "shape". Putting the shape into one array item means it will be
        stored only once, saving space in the nested #objectItemMap.)
    */


    #scalars        = new Map<JSONScalar | undefined, T>();

    #arrays         = new Map<string,T>();          // string-encoded array -> value
    #arrayItemMap?  : JSONMap<number>;              // array item -> serial number
    #arrayKeys      = new Array<JSONValue>();       // serial number -> array item

    #objects         = new Map<string,T>();         // string-encoded object -> value
    #objectItemMap?  : JSONMap<number>;             // object item -> serial number
    #objectKeys      = new Array<JSONValue>();      // serial number -> object item
}


// Sets the key's value only if it doesn't already exist.
function insert<K,V>(map: Map<K,V>, key: K, value: V): boolean {
    if (map.has(key))
        return false;
    map.set(key, value);
    return true;
}


// If `key` is in `map`, return the value; else call `makeValue`, add that value, return it.
function upsert<K,V>(map: Map<K,V>, key: K, makeValue: () => V): V {
    let val = map.get(key);
    if (val === undefined) {
        val = makeValue();
        map.set(key, val);
    }
    return val;
}

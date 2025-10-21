export type JSONValue = JSONScalar | JSONArray | JSONObject;
export type JSONScalar = null | boolean | number | string;
export type JSONArray = Array<JSONValue>;
export type JSONObject = {
    [key: string]: JSONValue;
};
export type JSONMapKey = JSONValue | undefined;
/** A key-value map whose keys can be any JSON value plus `undefined`.
 *  Keys are compared by deep equality.
 *  @warning  Unlike Map, JSONMap does _not_ preserve the order of keys. */
export declare class JSONMap<T> {
    #private;
    get size(): number;
    /** Returns the value (T) associated with `key`, else `undefined`. */
    get(key: JSONMapKey): T | undefined;
    /** Sets the value of `key` to `value`, replacing any existing value. */
    set(key: JSONMapKey, value: T): void;
    /** Adds a new key `key` with value `value` and returns true;
     *  if `key` already has a value, does nothing and returns false. */
    insert(key: JSONMapKey, value: T): boolean;
    /** Returns the value (T) associated with the `key`.
     *  If there isn't one yet, it calls the `makeValue` function to create one and adds it.
     *  > Note:  With complex keys this is more efficient than calling `get` and then `insert`. */
    upsert(key: JSONMapKey, makeValue: () => T): T;
    [Symbol.iterator](): Generator<[JSONMapKey, T], any, any>;
    entries(): Generator<[JSONMapKey, T]>;
    keys(): Generator<JSONMapKey>;
    values(): Generator<T>;
    toString(): string;
    /** Maps each array item to a unique number and joins those numbers in a string. */
    private encodeArrayKey;
    /** Converts an encoded array key back into the same array. */
    private decodeArrayKey;
    private encodeExistingKey;
    /** Converts an object to an array consisting of the values sorted by key,
     *  ending with an array of sorted keys. */
    private objectToArray;
    private encodeObjectKey;
    /** Converts an encoded object key back into the same object. */
    private decodeObjectKey;
}

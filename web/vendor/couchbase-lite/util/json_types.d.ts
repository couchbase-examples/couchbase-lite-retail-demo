/** A JSON array. */
export type JSONArray = Array<JSONValue>;
/** A JSON object. */
export type JSONObject = {
    [key: string]: JSONValue;
};
/** A JSON object or array. */
export type JSONCollection = JSONObject | JSONArray;
/** A JSON scalar (non-collection) value, except `null`. */
export type JSONScalar = boolean | number | string;
/** Any JSON-compatible value, including `null`. */
export type JSONValue = JSONScalar | JSONCollection | null;
export declare function isJSONArray(o: JSONValue): o is JSONArray;
export declare function isJSONObject(o: JSONValue): o is JSONObject;

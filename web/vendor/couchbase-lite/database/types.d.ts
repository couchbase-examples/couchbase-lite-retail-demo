import { JSONObject } from '../util/json_types';
import { Blob } from '../blob/blob';
/** An array in a CBLDocument. Can contain any JSON type as well as {@link Blob}s. */
export type CBLArray = Array<CBLValue>;
/** An object in a CBLDocument. Values can be any JSON type as well as {@link Blob}s. */
export type CBLDictionary = {
    [key: string]: CBLValue;
};
/** A value that can occur in a CBLDocument. JSON types plus {@link Blob}. */
export type CBLValue = null | boolean | number | string | CBLDictionary | CBLArray | Blob;
/** A document ID, equivalent to the primary key.
 *  Make a string into a DocID by using `as DocID`, or by calling the `DocID()` function. */
export type DocID = string & {
    __brand: "DocID";
};
export declare function DocID(id: string): DocID;
/** A revision ID, a string that uniquely identifies one revision of its document.
 *  Every time a document is saved (locally or on the server) its revision ID changes.
 *  @remarks
 *  RevIDs are mostly opaque, but the initial portion before the "-" is a generation number
 *  that indicates how many times the document has been changed. */
export type RevID = string & {
    __brand: "RevID";
};
/** A chronological sequence in a local database.
    These are integers starting from 1, where newer changes are greater. */
export type Sequence = number & {
    __brand: "Sequence";
};
/** The metadata of a local document revision. Used by {@link PusherConfig.filter}.
 *  @interface
 *  @property id        The document ID (primary key)
 *  @property rev       The revision ID
 *  @property deleted   `1` if this is a deletion (tombstone). */
export interface RevisionInfo {
    readonly id: DocID;
    readonly rev: RevID;
    readonly deleted?: 1;
}
/** A document revision with its body.
 *  @property body  The document body, containing app-specific properties.
 */
export interface Revision extends RevisionInfo {
    body: JSONObject;
}
/** Type guard that tests if a value is a CBLArray. */
export declare function isArray(val: CBLValue | undefined): val is CBLArray;
/** Type guard that tests if a value is a CBLDictionary. */
export declare function isDictionary(val: CBLValue | undefined): val is CBLDictionary;
/** Type guard that tests if a value is a Blob. */
export declare function isBlob(val: CBLValue | undefined): val is Blob;
/** Returns a value as a CBLArray if it is one, else `undefined`. */
export declare function asArray(val: CBLValue | undefined): CBLArray | undefined;
/** Returns a value as a CBLDictionary if it is one, else `undefined`. */
export declare function asDictionary(val: CBLValue | undefined): CBLDictionary | undefined;
/** Returns a value as a Blob if it is one, else `undefined`. */
export declare function asBlob(val: CBLValue | undefined): Blob | undefined;
export declare function isValidDocID(id: unknown): id is DocID;
export declare function isValidRevID(id: unknown): id is RevID;
export declare function assertValidDocID(id: unknown): asserts id is DocID;
/** Makes a deep copy of a CBLValue. (Arrays and Dictionaries are copied; not other types.) */
export declare function CopyValue(value: CBLValue, deep?: boolean): CBLValue;
export declare function CopyArray(arr: CBLArray, deep?: boolean): CBLArray;
export declare function CopyDict<T extends CBLDictionary = CBLDictionary>(dict: T, deep?: boolean): T;
/** Deep equality test of two document values. */
export declare function EqualValues(a: CBLValue | undefined, b: CBLValue | undefined): boolean;

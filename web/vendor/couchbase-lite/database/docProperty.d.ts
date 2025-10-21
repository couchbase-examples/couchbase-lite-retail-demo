import { ExpiresKey, IDKey, LocalRevision, SeqKey } from './internals';
import { CBLValue } from './types';
/** Represents the document's DocID in a DocProperty. */
export declare const DocIDProperty = "_id";
/** Represents the document's Sequence in a DocProperty. */
export declare const SequenceProperty = "_sequence";
/** Represents the document's expiration in a DocProperty. */
export declare const ExpiresProperty = "_expires";
/** Represents a property, or property path, in a document.
 *  Maps from its public name to the internal IndexedDB key-path, which for all but the built-in
 *  properties will have "body." prepended.
 *  Also handles resolving property paths in in-memory document objects.
 *  @property name     The public name/path, i.e. relative to the document body
 *  @property keypath  The IndexedDB key-path, i.e. within a `LocalRev`
 *  @property indexed  True if the property is indexed in its collection.
 *  @property encrypted  True if the property is stored in encrypted form. */
export declare abstract class DocProperty {
    readonly name: string;
    readonly keypath: string;
    readonly indexed: boolean;
    encrypted: boolean;
    /** Creates a DocProperty from a public property name or path. */
    static create(name: string, indexed?: boolean, encrypted?: boolean): DocProperty;
    constructor(name: string, keypath: string, indexed: boolean, encrypted: boolean);
    get rootName(): string;
    /** True if `doc` has this property. */
    abstract in(doc: LocalRevision): boolean;
    /** Returns the value of this property in `doc`, or `undefined` if missing. */
    abstract getFrom(doc: LocalRevision): CBLValue | undefined;
    toString(): string;
    protected bad(): never;
}
type BuiltinKey = typeof IDKey | typeof SeqKey | typeof ExpiresKey;
/** A built-in property, namely 'id', 'seq', 'expires' */
export declare class BuiltInProperty extends DocProperty {
    private key;
    constructor(name: string, key: BuiltinKey);
    in(doc: LocalRevision): boolean;
    getFrom(doc: LocalRevision): CBLValue | undefined;
}
export {};

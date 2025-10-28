// docProperty.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { ExpiresKey, IDKey, type LocalRevision, SeqKey } from "./internals";
import { type CBLValue, isDictionary } from "./types";
import { assert } from "@/util/assert";


/** Represents the document's DocID in a DocProperty. */
export const DocIDProperty    = "_id";
/** Represents the document's Sequence in a DocProperty. */
export const SequenceProperty = "_sequence";
/** Represents the document's expiration in a DocProperty. */
export const ExpiresProperty  = "_expires";


/** Represents a property, or property path, in a document.
 *  Maps from its public name to the internal IndexedDB key-path, which for all but the built-in
 *  properties will have "body." prepended.
 *  Also handles resolving property paths in in-memory document objects.
 *  @property name     The public name/path, i.e. relative to the document body
 *  @property keypath  The IndexedDB key-path, i.e. within a `LocalRev`
 *  @property indexed  True if the property is indexed in its collection.
 *  @property encrypted  True if the property is stored in encrypted form. */
export abstract class DocProperty {
    /** Creates a DocProperty from a public property name or path. */
    static create(name: string, indexed: boolean = false, encrypted: boolean = false): DocProperty {
        switch (name) {
            case DocIDProperty:       return new BuiltInProperty(DocIDProperty,    IDKey);
            case SequenceProperty:    return new BuiltInProperty(SequenceProperty, SeqKey);
            case ExpiresProperty:     return new BuiltInProperty(ExpiresProperty,  ExpiresKey);
            default:
                if (name.indexOf(".") < 0)
                    return new RootDocProperty(name, indexed, encrypted);
                else
                    return new NestedDocProperty(name, indexed, encrypted);
        }
    }

    constructor(public readonly name: string,
                public readonly keypath: string,
                public readonly indexed: boolean,
                public encrypted: boolean)
    {
        assert(!(indexed && encrypted));
        if (name.length === 0 || keypath.length === 0)
            this.bad();
    }

    get rootName(): string {return this.name;}

    /** True if `doc` has this property. */
    abstract in(doc: LocalRevision): boolean;

    /** Returns the value of this property in `doc`, or `undefined` if missing. */
    abstract getFrom(doc: LocalRevision): CBLValue | undefined ;

    toString() {return this.name;}

    protected bad(): never { throw Error(`Invalid property path '${this.name}'`); }

}


type BuiltinKey = typeof IDKey | typeof SeqKey | typeof ExpiresKey;

/** A built-in property, namely 'id', 'seq', 'expires' */
export class BuiltInProperty extends DocProperty {
    constructor(name: string, private key: BuiltinKey)  {super(name, key, true, false);}
    override in(doc: LocalRevision): boolean            {return this.key in doc;}
    override getFrom(doc: LocalRevision): CBLValue | undefined       {return doc[this.key];}
}


/** A top-level property. */
class RootDocProperty extends DocProperty {
    constructor(name: string, indexed: boolean, encrypted: boolean) {
        super(name, "body." + name, indexed, encrypted);
        if (name.startsWith("_"))
            this.bad();
    }
    override in(doc: LocalRevision): boolean        {return Object.hasOwn(doc.body, this.name);}
    override getFrom(doc: LocalRevision): CBLValue | undefined    {return doc.body[this.name];}
}


/** A nested property, one with multiple keys in its path. */
class NestedDocProperty extends RootDocProperty {
    constructor(name: string, indexed: boolean, encrypted: boolean) {
        super(name, indexed, encrypted);
        if (name.startsWith(".") || name.endsWith(".") || name.indexOf("..") >= 0)
            this.bad();
        this.path = name.split(".");
    }

    public readonly path: readonly string[];

    override get rootName(): string {return this.path[0];}

    override in(doc: LocalRevision): boolean {
        return this.getFrom(doc) !== undefined;
    }

    override getFrom(doc: LocalRevision): CBLValue | undefined {
        let val: CBLValue = doc.body;
        for (const component of this.path) {
            if (!isDictionary(val))
                return undefined;
            val = val[component];
        }
        return val;
    }

}

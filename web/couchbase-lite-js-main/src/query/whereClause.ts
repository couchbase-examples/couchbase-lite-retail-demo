//
// query/whereClause.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type {CompiledExpr, Value } from "./eval";
import { Decompile } from "./decompile";
import type { Expr } from "./schema";
import { assert } from "@/util/assert";
import type { DocProperty } from "@/database/docProperty";
import type { LocalRevision } from "@/database/internals";
import type * as dexie from "dexie";


export type DexieWhereClause = dexie.WhereClause<LocalRevision, string, LocalRevision>;
export type DexieQuery = dexie.Collection<LocalRevision, string, LocalRevision>;


/** A constraint on a document property which can be handled by an index.
 *  Subclasses represent single values, string prefixes, and value ranges.
 *  @property sourceExpression  The JSON `Expr` this represents.
 *  @property key  The document property. */
export abstract class WhereClause {
    constructor(public readonly sourceExpression: Expr,
                public readonly key: DocProperty) { }

    /** Increases with the number of values this matches:
     *  1 = single value; 2 = range of values; 3 = open-ended range */
    abstract get generality(): number;

    /** Calls a range constraint function on the `DexieWhereClause` -- equals(), above(), etc.
     *  Returns `undefined` if the value evaluates to something IndexedDB can't index (null,
     *          boolean, objects...) */
    abstract applyTo(dxWhere: DexieWhereClause): DexieQuery | undefined;

    abstract toString(): string;
}


/** A typical WhereClause using a scalar index. */
export abstract class ScalarWhereClause extends WhereClause {
    abstract get minValue(): Value;
    abstract get maxValue(): Value;

    get includeMin(): boolean {return true;}
    get includeMax(): boolean {return true;}
}


/** A WhereClause that constrains a property to a single value.
 *  @property valueExpr  An expression evaluating to the single value. */
export class KeyValueClause extends ScalarWhereClause {
    constructor(sourceExpression: Expr,
                key: DocProperty,
                public readonly valueExpr: CompiledExpr)
    { super(sourceExpression, key); }

    value(): Value  {return this.valueExpr();}

    get minValue(): Value {return this.value();}
    get maxValue(): Value {return this.value();}

    get generality() {return 1;}


    applyTo(dxWhere: DexieWhereClause): DexieQuery | undefined {
        const val = asIndexable(this.value());
        return (val !== undefined) ? dxWhere.equals(val) : undefined;
    }

    toString() {
        return `${this.key} = ${Decompile(this.valueExpr)}`;
    }
}


/** A WhereClause that constrains a property to a string with a given prefix.
 *  @property prefix  The key prefix (case-sensitive). */
export class KeyPrefixClause  extends ScalarWhereClause {
    constructor(sourceExpression: Expr,
                key: DocProperty,
                public readonly prefix: string)
    { super(sourceExpression, key); }

    get minValue(): Value {return this.prefix;}
    get maxValue(): Value {return this.prefix + '\uFFFF';}

    get generality() {return 2;}

    applyTo(dxWhere: DexieWhereClause): DexieQuery {
        return dxWhere.startsWith(this.prefix);
    }

    toString() {
        return `${this.key} starts with ${JSON.stringify(this.prefix)}`;
    }
}


/** A WhereClause that constrains a property to a range of values.
 *  @property minValueExpr  Minimum property value, or `undefined` for no minimum
 *  @property maxValueExpr  Maximum property value, or `undefined` for no maximum
 *  @property includeMin    Should values equal to `min` be included? (default is true)
 *  @property includeMax    Should values equal to `max` be included? (default is true) */
export class KeyRangeClause extends ScalarWhereClause {
    constructor(sourceExpression: Expr,
                key: DocProperty,
                public readonly minValueExpr : CompiledExpr | undefined,
                public readonly maxValueExpr : CompiledExpr | undefined,
                public readonly includeMin_ = true,
                public readonly includeMax_ = true)
    {
        super(sourceExpression, key);
        assert(minValueExpr || maxValueExpr);
    }

    get minValue(): Value  {return this.minValueExpr ? this.minValueExpr() : undefined;}
    get maxValue(): Value  {return this.maxValueExpr ? this.maxValueExpr() : undefined;}
    get includeMin(): boolean {return this.includeMin_;}
    get includeMax(): boolean {return this.includeMax_;}

    get generality() {return 4 + (this.minValueExpr ? -1 : 0) + (this.maxValueExpr ? -1 : 0);}

    applyTo(dxWhere: DexieWhereClause): DexieQuery | undefined {
        const min = asIndexable(this.minValue), max = asIndexable(this.maxValue);
        if (this.minValueExpr) {
            if (min === undefined) return undefined;
            if (this.maxValueExpr !== undefined) {
                if (max === undefined) return undefined;
                return dxWhere.between(min, max, this.includeMin, this.includeMax);
            } else if (this.includeMin)
                return dxWhere.aboveOrEqual(min);
            else
                return dxWhere.above(min);
        } else if (this.maxValueExpr !== undefined) {
            if (max === undefined) return undefined;
            if (this.includeMax)
                return dxWhere.belowOrEqual(max);
            else
                return dxWhere.below(max);
        } else {
            return undefined;
        }
    }

    toString() {
        const minStr = this.minValueExpr ? Decompile(this.minValueExpr) : "";
        const maxStr = this.maxValueExpr ? Decompile(this.maxValueExpr) : "";
        const lb = this.includeMin ? "[" : "(";
        const rb = this.includeMax ? "]" : ")";
        return `${this.key} in range ${lb}${minStr} ... ${maxStr}${rb}`;
    }
}


/** Returns its argument cast to an indexable type, or undefined if it's not indexable.
 *  (IndexedDB can only index numbers, strings, and arrays of them.) */
function asIndexable(val: Value): dexie.IndexableType | undefined {
    if (typeof val === 'number' || typeof val === 'string')
        return val;
    else if (Array.isArray(val))
        return val as dexie.IndexableTypeArray;     //TODO: Probably need to examine the contents
    else
        return undefined;
}


/** A WhereClause that tests if a value is contained in an array property.
 *  @property itemExpr  An expression evaluating to the value. */
export class ArrayContainsClause extends WhereClause {
    constructor(sourceExpression: Expr,
                key: DocProperty,
                public readonly itemExpr: CompiledExpr)
    { super(sourceExpression, key); }

    itemValue(): Value  {return this.itemExpr();}

    get generality() {return 1;}

    applyTo(dxWhere: DexieWhereClause): DexieQuery | undefined {
        const val = asIndexable(this.itemValue());
        return (val !== undefined) ? dxWhere.equals(val).distinct() : undefined;
    }

    toString() {
        return `${Decompile(this.itemExpr)} IN ${this.key}`;
    }
}

import { CompiledExpr, Value } from './eval';
import { Expr } from './schema';
import { DocProperty } from '../database/docProperty';
import { StoredRevision } from '../database/internals';
import type * as dexie from "dexie";
export type DexieWhereClause = dexie.WhereClause<StoredRevision, string, StoredRevision>;
export type DexieQuery = dexie.Collection<StoredRevision, string, StoredRevision>;
/** A constraint on a document property which can be handled by an index.
 *  Subclasses represent single values, string prefixes, and value ranges.
 *  @property sourceExpression  The JSON `Expr` this represents.
 *  @property key  The document property. */
export declare abstract class WhereClause {
    readonly sourceExpression: Expr;
    readonly key: DocProperty;
    constructor(sourceExpression: Expr, key: DocProperty);
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
export declare abstract class ScalarWhereClause extends WhereClause {
    abstract get minValue(): Value;
    abstract get maxValue(): Value;
    get includeMin(): boolean;
    get includeMax(): boolean;
}
/** A WhereClause that constrains a property to a single value.
 *  @property valueExpr  An expression evaluating to the single value. */
export declare class KeyValueClause extends ScalarWhereClause {
    readonly valueExpr: CompiledExpr;
    constructor(sourceExpression: Expr, key: DocProperty, valueExpr: CompiledExpr);
    value(): Value;
    get minValue(): Value;
    get maxValue(): Value;
    get generality(): number;
    applyTo(dxWhere: DexieWhereClause): DexieQuery | undefined;
    toString(): string;
}
/** A WhereClause that constrains a property to a string with a given prefix.
 *  @property prefix  The key prefix (case-sensitive). */
export declare class KeyPrefixClause extends ScalarWhereClause {
    readonly prefix: string;
    constructor(sourceExpression: Expr, key: DocProperty, prefix: string);
    get minValue(): Value;
    get maxValue(): Value;
    get generality(): number;
    applyTo(dxWhere: DexieWhereClause): DexieQuery;
    toString(): string;
}
/** A WhereClause that constrains a property to a range of values.
 *  @property minValueExpr  Minimum property value, or `undefined` for no minimum
 *  @property maxValueExpr  Maximum property value, or `undefined` for no maximum
 *  @property includeMin    Should values equal to `min` be included? (default is true)
 *  @property includeMax    Should values equal to `max` be included? (default is true) */
export declare class KeyRangeClause extends ScalarWhereClause {
    readonly minValueExpr: CompiledExpr | undefined;
    readonly maxValueExpr: CompiledExpr | undefined;
    readonly includeMin_: boolean;
    readonly includeMax_: boolean;
    constructor(sourceExpression: Expr, key: DocProperty, minValueExpr: CompiledExpr | undefined, maxValueExpr: CompiledExpr | undefined, includeMin_?: boolean, includeMax_?: boolean);
    get minValue(): Value;
    get maxValue(): Value;
    get includeMin(): boolean;
    get includeMax(): boolean;
    get generality(): number;
    applyTo(dxWhere: DexieWhereClause): DexieQuery | undefined;
    toString(): string;
}
/** A WhereClause that tests if a value is contained in an array property.
 *  @property itemExpr  An expression evaluating to the value. */
export declare class ArrayContainsClause extends WhereClause {
    readonly itemExpr: CompiledExpr;
    constructor(sourceExpression: Expr, key: DocProperty, itemExpr: CompiledExpr);
    itemValue(): Value;
    get generality(): number;
    applyTo(dxWhere: DexieWhereClause): DexieQuery | undefined;
    toString(): string;
}

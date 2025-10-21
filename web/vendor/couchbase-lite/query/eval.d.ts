import { LocalRevision } from '../database/internals';
import { JSONArray, JSONObject, JSONValue } from '../util/json_types';
import { Expr } from './schema';
import type * as N1QL from "./N1QLFunctions";
/** The result of evaluating an Expr: a JSON value or `undefined` aka MISSING.
 *  (Unlike CBLValue it doesn't include `Blob` objects.) */
export type Value = DefinedValue | undefined;
export type DefinedValue = JSONValue;
export type NonNullValue = boolean | number | string | JSONObject | JSONArray;
/** The result of compiling an Expr: a no-arg function that when called returns the Expr's value.
 *  May have a `sourceExpression` property pointing to the original Expr; this is used by the
 *  query's `explanation` property as a way of "decompiling" to a semi-readable form. */
export type CompiledExpr = {
    (): Value;
    sourceExpression?: Expr;
};
export type DataSourceType = 'collection' | 'join' | 'unnest';
/** Context (state) for evaluating a CompiledExpr. Accessed by '.', '$', '?' operators.
 *  A CompiledExpr will capture this as part of its closure if it needs access to it. */
export declare class EvalContext {
    #private;
    readonly sourceTypes: Map<string, DataSourceType>;
    readonly parameterNames: Set<string>;
    readonly variables: Record<string, DefinedValue>;
    readonly results: Map<string, CompiledExpr>;
    readonly parameters: Map<string, JSONValue>;
    /** Per-row state. Only exists while processing a row during a query. */
    row?: RowState;
    /** Compiles an Expr, returning a function that when called returns its value, incorporating the
     *  current state of the EvalContext.
     *  The function's `sourceExpression` property will point back to `expr` for later reference.
     *  > Note:  `expr` must be normalized; in particular, operation names must be uppercase. */
    compile(expr: Expr): CompiledExpr;
    /** Same as `compile`, but allows aggregate functions to be compiled. */
    compileWithAggregates(expr: Expr): CompiledExpr;
    allowCompilingAggregates: boolean;
    /** Given an Aggregate instance, returns the compiled form of its Expression. */
    compileAggregate(agg: N1QL.Aggregate): CompiledExpr;
    get hasAggregators(): boolean;
    /** Returns a copy of the `aggregatorsTemplate`. */
    copyAggregates(): N1QL.Aggregate[] | undefined;
}
/** Per-row state. The portion of `EvalContext` (its `row`) that changes during a query. */
export declare class RowState {
    readonly ctx: EvalContext;
    constructor(ctx: EvalContext);
    dataSources: Map<string, JSONValue | LocalRevision>;
    aggregates?: N1QL.Aggregate[];
    /** Evaluates an expression with this state. */
    eval(expr: CompiledExpr): Value;
    /** Loads this state into its EvalContext, calls the expression, then unloads the state. */
    use<T>(fn: () => T): T;
    getSourceRevision(alias: string): LocalRevision;
    clone(): RowState;
}

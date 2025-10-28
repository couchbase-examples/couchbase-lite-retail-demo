//
// query/eval.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { LocalRevision } from "@/database/internals";
import { check } from "@/util/assert";
import type { JSONArray, JSONObject, JSONValue } from "@/util/json_types";
import { compile } from "./compile";
import type * as N1QL from "./N1QLFunctions";
import type { Expr } from "./schema";


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
export class EvalContext {
    readonly sourceTypes = new Map<string,DataSourceType>;    // Types of the data sources
    readonly parameterNames = new Set<string>();              // Names of all "$" parameters
    readonly variables   : Record<string,DefinedValue> = {};  // "?" variables inside ANY/EVERY
    readonly results     = new Map<string,CompiledExpr>();    // Maps result alias to expression

    readonly parameters  = new Map<string,DefinedValue>;      // query parameters, set at runtime

    /** Per-row state. Only exists while processing a row during a query. */
    row?: RowState;

    /** Compiles an Expr, returning a function that when called returns its value, incorporating the
     *  current state of the EvalContext.
     *  The function's `sourceExpression` property will point back to `expr` for later reference.
     *  > Note:  `expr` must be normalized; in particular, operation names must be uppercase. */
    compile(expr: Expr): CompiledExpr {
        let compiled = compile(expr, this);
        if (compiled.sourceExpression === undefined)
            compiled.sourceExpression = expr;
        return compiled;
    }

    /** Same as `compile`, but allows aggregate functions to be compiled. */
    compileWithAggregates(expr: Expr): CompiledExpr {
        this.allowCompilingAggregates = true;
        try {
            return this.compile(expr);
        } finally {
            this.allowCompilingAggregates = false;
        }
    }

    allowCompilingAggregates = false;

    /** Given an Aggregate instance, returns the compiled form of its Expression. */
    compileAggregate(agg: N1QL.Aggregate): CompiledExpr {
        const i = this.#aggregatorsTemplate.length;
        this.#aggregatorsTemplate.push(agg);
        // The aggregate function returns its Aggregate's result. Note that we look it up by
        // index in `this.row?.aggregators`, because at runtime it may be swapped out for another
        // instance (when GROUP BY is in effect and there are multiple aggregations.)
        return () => {
            const aggregators = this.row?.aggregates;
            check(aggregators !== undefined,
                  "aggregate function called outside aggregation context");
            return aggregators[i].result;
        };
    }

    get hasAggregators() {return this.#aggregatorsTemplate.length > 0;}

    /** Returns a copy of the `aggregatorsTemplate`. */
    copyAggregates(): N1QL.Aggregate[] | undefined {
        return this.#aggregatorsTemplate.map( a => a.clone() );
    }

    #aggregatorsTemplate : N1QL.Aggregate[] = [];
}


/** Per-row state. The portion of `EvalContext` (its `row`) that changes during a query. */
export class RowState {
    constructor(public readonly ctx: EvalContext) { }

    dataSources = new Map<string, LocalRevision | DefinedValue>();
    aggregates? : N1QL.Aggregate[];

    /** Evaluates an expression with this state. */
    eval(expr: CompiledExpr): Value {
        return this.use(expr);
    }

    /** Loads this state into its EvalContext, calls the expression, then unloads the state. */
    use<T>(fn: ()=>T): T {
        this.ctx.row = this;
        try {
            return fn();
        } finally {
            this.ctx.row = undefined;
        }
    }

    getSourceRevision(alias: string): LocalRevision {
        return this.dataSources.get(alias) as LocalRevision;
    }

    clone(): RowState {
        let rs = new RowState(this.ctx);
        for (const [k, v] of this.dataSources)
            rs.dataSources.set(k, v);
        rs.aggregates = this.aggregates;
        return rs;
    }
}

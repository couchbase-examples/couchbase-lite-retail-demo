//
// query/query.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { type Collection, type ListenerToken, ValueIndex, type Database, DefaultCollectionName } from "@/couchbase-lite";
import type { NoSchema, SchemaLike } from "@/database/database";
import { DocIDProperty, ExpiresProperty, SequenceProperty, type DocProperty } from "@/database/docProperty";
import { assert, assertDefined, check, checkString } from "@/util/assert";
import type { JSONObject, JSONValue } from "@/util/json_types";
import { MatchOp, MissingDataSourceError, MissingParameterError, RegisterUserFunction, type UserFunction, type UserFunctionOptions } from "./compile";
import type { CompiledExpr, DataSourceType, RowState } from "./eval";
import { EvalContext, type Value } from "./eval";
import { likeMode } from "./N1QLFunctions";
import { N1QLParseError, ParseSelect } from "./N1QLParser";
import { ExprAliases, Normalize, NormalizePaths, SplitANDs } from "./normalize";
import { Aggregator, Distinctifier, Grouper, InterruptedQueryError, Joiner, Limiter, NullRevProducer, Projector, RevProducer, RowObjectifier, RowPasser, SorterProjector, Unnester, type Producer, type QueryRow, type RevProducerConfig, type SortExpr } from "./pipeline";
import type { DataSource, Expr, JoinSource, Operation, Select, UnnestSource } from "./schema";
import type { WhereClause } from "./whereClause";
import { ArrayContainsClause, KeyPrefixClause, KeyRangeClause, KeyValueClause, ScalarWhereClause } from "./whereClause";
import { QueryObserver } from "./queryObserver";
import { QueryLogger } from "@/util/logging";
import type * as logtape from "@logtape/logtape";
import { EqualValues } from "@/database/types";

export { RegisterUserFunction, type UserFunction, type UserFunctionOptions } from "./compile";
export { N1QLParseError } from "./N1QLParser";
export { InterruptedQueryError } from "./pipeline";


export type JSONObjectLike<D> = { [K in keyof D]: JSONValue }

export type QueryResult<T extends QueryResult<T> = JSONObject> = { [K in keyof T]: JSONObjectLike<T[K]> } | JSONObject;

export type QueryChangeCallback<T extends QueryResult<T> = JSONObject> = (result: QueryResult<T>[]) => void;


/** A compiled N1QL query. Created by {@link Database.createQuery}.
 *  @property database  The Database being queried.
 *  @template Schema  The database schema type, inherited from its Database. */
export class Query<Schema extends SchemaLike<Schema> = NoSchema> {

    /** @internal */
    constructor(public readonly database: Database<Schema>,
                query: string | JSONObject)
    {
        this.logger = QueryLogger.with({db: database.name});

        let select: Select;
        if (typeof query === 'string') {
            select = ParseSelect(query);
            this.selectExpr = select as unknown as JSONObject;
        } else {
            // Clean up a JSON query that might have been hand-written:
            this.selectExpr = query;
            select = query as unknown as Select;
            Normalize(select);
        }

        // Identify the data sources (FROM):
        let mainSource: SourceInfo | undefined;
        for (let source of select.FROM) {
            // Determine the Collection:
            let type: DataSourceType;
            let collection: Collection | undefined;
            if ('COLLECTION' in source) {
                let collectionName = source.COLLECTION;
                if (collectionName === "_")
                    collectionName = DefaultCollectionName;
                if (source.SCOPE)
                    collectionName = source.SCOPE + '.' + collectionName;
                collection = this.database.getCollection(collectionName);

                if ('JOIN' in source) {
                    assert(mainSource !== undefined, "first FROM source can't be a JOIN");
                    type = 'join';
                } else {
                    check(mainSource === undefined, "subsequent FROM sources must be JOINs");
                    type = 'collection';
                }
            } else {
                type = 'unnest';
            }

            // Determine its alias:
            let alias;
            if (source.AS !== undefined)
                alias = source.AS;
            else if ('COLLECTION' in source)
                alias = source.COLLECTION;
            else
                throw new N1QLParseError(`UNNEST clause must have an AS`);
            if (this.#aliases.has(alias))
                throw new N1QLParseError(`Duplicate sources named "${alias}"`);

            const sourceInfo = {collection, source, type, alias};
            if (!mainSource)
                mainSource = sourceInfo;
            this.#aliases.set(alias, sourceInfo);
            this.#context.sourceTypes.set(alias, type);
        }

        // Collect the result column (WHAT) aliases:
        let columnAliases: Array<string | undefined> = [];
        let columnExprs: Expr[] = [];
        for (let what of select.WHAT) {
            let alias: string | undefined;
            if (Array.isArray(what) && what[0] === 'AS') {
                alias = what[2] as string;
                what = what[1];

                if (this.#aliases.has(alias))
                    throw new N1QLParseError(`Duplicate column alias "${alias}"`);
                this.#aliases.set(alias, {
                    type: 'result',
                    alias: alias,
                    what: what
                });
            }
            columnAliases.push(alias);
            columnExprs.push(what);
        }

        // Ensure all '.' and 'META()' exprs start with an alias:
        NormalizePaths(select, this.#aliases,
                       (select.FROM.length === 1) ? mainSource?.alias : undefined);

        const compiledColumnExprs = columnExprs.map( x => this.#context.compileWithAggregates(x) );

        // Name the result columns that don't have explicit aliases.
        // (This can't be done until after the NormalizePaths() call.)
        let columnNames: string[] = [];
        let aliasCounter = 0;
        for (let i = 0; i < select.WHAT.length; ++i) {
            let name = columnAliases[i];
            if (name === undefined) {
                name = this.defaultResultName(select.WHAT[i]);
                while (name === undefined || columnNames.includes(name))
                    name = `$${++aliasCounter}`;
            } else {
                this.#context.results.set(name, compiledColumnExprs[i]);
            }
            columnNames.push(name);
        }
        this.columnNames = columnNames;

        // Find which sources each result is dependent on, and store in its `sources` property:
        this.findResultSources();

        // Split the WHERE clause into a set of AND'ed expressions:
        const whereExprs = new Set(select.WHERE ? SplitANDs(select.WHERE) : []);

        // Parse the ORDER BY:
        let sortExprs: SortExpr[] | undefined = undefined;
        if (select.ORDER_BY !== undefined)
            sortExprs = select.ORDER_BY.map( order => makeSortExpr(this.#context, order) );

        //---- Now build the pipeline:

        let allowedSources = new Set<SourceInfo>();
        let pipelineStart: NullRevProducer | undefined;
        let revPipe: Producer<RowState> | undefined;

        // Create a RevProducer, Joiner or Unnester for each source:
        eachsource: for (const [alias, source] of this.#aliases) {
            switch (source.type) {
                case 'collection': {
                    pipelineStart = this.makeRevProducer(source, whereExprs, sortExprs,
                                                         allowedSources);
                    revPipe = pipelineStart;
                    break;
                }
                case 'join': {
                    for (const on of SplitANDs((source.source as JoinSource).ON))
                        whereExprs.add(on);
                    const joinType = (source.source as JoinSource).JOIN;
                    const producer = this.makeRevProducer(source, whereExprs, sortExprs, allowedSources);
                    revPipe = revPipe!.then(new Joiner(producer, joinType));
                    break;
                }
                case 'unnest': {
                    const expr = this.#context.compile((source.source as UnnestSource).UNNEST);
                    revPipe = revPipe!.then(new Unnester(expr, alias));
                    break;
                }
                case 'result':
                    continue eachsource;    // ignore results
            }
            allowedSources.add(source);
        }

        if (pipelineStart) {
            assertDefined(revPipe);
        } else {
            // There is no FROM clause at all
            pipelineStart = new NullRevProducer();
            revPipe = pipelineStart;
        }
        this.#pipelineStart = pipelineStart;

        // Add nodes for GROUP BY or aggregates:
        if (select.GROUP_BY !== undefined) {
            const groups = select.GROUP_BY.map( expr => this.#context.compile(expr) );
            const having = select.HAVING !== undefined
                ? this.#context.compileWithAggregates(select.HAVING)
                : undefined;
            revPipe = revPipe.then(new Grouper(groups, having, this.#context));
        } else {
            if (this.#context.hasAggregators)
                revPipe = revPipe.then(new Aggregator(this.#context));
        }

        // Add a node for sort and/or projection:
        let rowPipe: Producer<QueryRow>;
        if (sortExprs?.length)
            rowPipe = revPipe.then(new SorterProjector(compiledColumnExprs, columnNames, sortExprs));
        else
            rowPipe = revPipe.then(new Projector(compiledColumnExprs, columnNames));

        // Add a node for DISTINCT:
        if (select.DISTINCT)
            rowPipe = rowPipe.then(new Distinctifier());

        // Add a node for OFFSET / LIMIT:
        if (select.OFFSET !== undefined || select.LIMIT !== undefined) {
            const compileOffLim = (expr: Expr | undefined, name: string) => {
                if (expr === undefined) return undefined;
                check(ExprAliases(expr).size === 0, `invalid ${name} expression`);
                return this.#context.compile(expr);
            };
            rowPipe = rowPipe.then(new Limiter(compileOffLim(select.OFFSET, "OFFSET"),
                                               compileOffLim(select.LIMIT, "LIMIT")));
        }

        this.#pipelineEnd = rowPipe
            .then(new RowObjectifier(columnNames))
            .then(new RowPasser());

        // Initialize parameters:
        this.#proxyParameters = new Proxy(this.#parameters, {
            set: (target, key, value) => {
                this.checkParameterName(key);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                target[key] = value;
                // Notify observer to re-run query after a parameter changes:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                if (this.#observer && !EqualValues(value, this.#parameters[key]))
                    this.#observer.trigger();
                return true;
            }
        });

    }


    /** The JSON form of the parsed query. @internal */
    readonly selectExpr: JSONObject;

    /** A map from query parameter names to their values.
     *
     *  You must set the values of all parameters before running the query.
     *
     *  Changing any parameter value will cause query change listeners to re-evaluate the query,
     *  triggering the callback if the results change.
     *
     *  >Note: Omit the "$" in the keys: if the N1QL query uses `$date`, the key is `"date"`. */
    get parameters(): Record<string,JSONValue> {
        return this.#proxyParameters;
    }

    set parameters(p: Record<string,JSONValue>) {
        const nParams = this.#context.parameterNames.size;
        const entries = Object.entries(p);
        check(entries.length >= nParams, `All ${nParams} parameters must be set`);
        for (const [key, value] of entries) {
            this.checkParameterName(key);
            this.#parameters[key] = value;
        }
    }

    /** The names of all query parameters. */
    get parameterNames(): Set<string> {return this.#context.parameterNames;}

    /** The names of the result columns, i.e. the keys in a row object. */
    readonly columnNames: readonly string[];

    /** @internal */
    readonly logger: logtape.Logger;


    /** A string that describes in human-readable form the steps the query will perform
     *  when it runs. (Format subject to change without notice.) */
    get explanation(): string {
        let x: string[] = [];
        this.#pipelineStart.explain(x);
        return x.join('\n');
    }


    /** Runs the query, returning an array of rows.
     *  @throws InterruptedQueryError if {@link interrupt} was called during execution.
     *  @template T  The type of the returned rows; defaults to JSONObject.
     *              This is not type-checked, so it's up to you to make it accurate. */
    async execute<T extends QueryResult<T> = JSONObject>(): Promise<T[]>;

    /** Runs the query, calling the callback for each row.
     *  @returns  True if the query completed, false if it was interrupted.
     *  @template T  The type of the returned rows; defaults to JSONObject.
     *              This is not type-checked, so it's up to you to make it accurate. */
    async execute<T extends QueryResult<T> = JSONObject>(callback: (doc: T) => void): Promise<boolean>;

    async execute<T extends QueryResult<T> = JSONObject>(callback?: (row: T) => void): Promise<T[] | boolean> {
        if (callback) {
            return this.run(callback as (row: JSONObject) => void);
        } else {
            let rows = new Array<JSONObject>();
            if (await this.run( row => rows.push(row) ))
                return rows as T[];
            else
                throw new InterruptedQueryError();
        }
    }


    /** Stops an active {@link execute} call ASAP. Does nothing if the query is not running. */
    interrupt() {
        if (this.#running) {
            this.#interrupted = true;
            this.#pipelineStart.interrupt();
        }
    }


    /** Registers a function that will be called when the query's results change, as a result of
     *  changes to documents or to a parameter value.
     *  @param callback  The function to call. Its parameter is the new query result array.
     *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
     *            remove the listener. */
    addChangeListener<T extends QueryResult<T> = JSONObject>(callback: QueryChangeCallback<T>): ListenerToken {
        if (!this.#observer)
            this.#observer = new QueryObserver(this);
        return this.#observer.addChangeListener(callback);
    }


    /** Registers a custom N1QL function.
     *
     *  Registration is global: it will be available in all queries on all Databases.
     *  @param name  Function's name. Case-insensitive.
     *  @param implementation  The function itself. See the type {@link UserFunction} for details.
     *  @param options  Other options such as min/max arg counts. */
    registerUserFunction(name: string,
                         implementation: UserFunction,
                         options?: UserFunctionOptions): void
    {
        RegisterUserFunction(name, implementation, options);
    }


    /** All Collections used by this query. @internal */
    collections(): Set<Collection> {
        let result = new Set<Collection>();
        for (const alias of this.#aliases.values()) {
            if (alias.type !== 'result' && alias.collection)
                result.add(alias.collection);
        }
        return result;
    }


    //---- INTERNALS:


    private checkParameterName(name: unknown): asserts name is string {
        check(typeof name === 'string', "Query parameter name must be a string");
        check(!name.startsWith('$'), "Don't use '$' prefix in query parameter names");
        check(this.#context.parameterNames.has(name), `"${name}" is not a parameter of this query`);
    }


    private async run(callback: (row: JSONObject) => void): Promise<boolean> {
        check(!this.#running, "query is already running");

        this.#context.parameters.clear();
        for (const param of this.#context.parameterNames) {
            const value = this.#parameters[param];
            if (value === undefined)
                throw Error(`The query parameter "${param}" must have a value`);
            this.#context.parameters.set(param, value);
        }

        this.#running = true;
        this.#interrupted = false;
        try {
            this.#pipelineEnd.callback = (row) => {
                callback(row);
                return !this.#interrupted;
            };
            await this.#pipelineStart.run(this.#context);
            this.#pipelineEnd.callback = undefined;
            return this.#pipelineEnd.ok;
        } catch (x) {
            if (x instanceof InterruptedQueryError)
                return false;
            else
                throw x;
        } finally {
            this.#running = false;
        }
    }


    /** Creates a pipeline `RevProducer` for the main FROM source or a JOIN.
     *  @param source  The source.
     *  @param whereExprs  The remaining unused expressions from the WHERE clause.
     *                     Expressions used by this RevProducer will be **removed** from the array.
     *  @param sortExprs  The remaining unused sorts from the ORDER BY clause.
     *                    Items used by this RevProducer will be **removed** from the array.
     *  @param allowedSources  Prior sources that will already have values at runtime, and so
     *                         can be used by this RevProducer. */
    private makeRevProducer(source: SourceInfo,
                            whereExprs: Set<Operation>,
                            sortExprs: SortExpr[] | undefined,
                            allowedSources: Set<SourceInfo>) : RevProducer
    {
        // Create WhereClauses from allowed relational expressions:
        const whereClauses: WhereClause[] = [];
        for (const expr of whereExprs) {
            const rel = this.asWhereClause(expr, source, allowedSources);
            if (rel)
                whereClauses.push(rel);
        }
        // Put the most specific clauses first:
        whereClauses.sort( (a, b) => a.generality - b.generality );

        // See if the primary ORDER BY expression is an indexed property on this source:
        let sortProp: DocProperty | undefined;
        if (sortExprs?.length) {
            const [srcInfo, prop] = this.expToKeyPath(sortExprs[0].expr.sourceExpression!);
            if (prop?.indexed && srcInfo === source)
                sortProp = prop;
        }
        let usedSortProp = false;

        let producer: RevProducerConfig = {collection: source.collection!, alias: source.alias};

        // Consider each index in turn, seeing which whereClause(s) match it:
        let bestPlan: WhereClause[] | undefined;
        for (const index of source.collection!.getIndexes()) {
            let plan: WhereClause[] = [];
            if (index.type === ValueIndex) {
                // Value index, possibly multi-column:
                for (const prop of index.on) {
                    const clause = whereClauses.find( wc =>
                        wc.key === prop && wc instanceof ScalarWhereClause );
                    if (clause === undefined)
                        break;
                    plan.push(clause);
                    if (clause.generality > 1)    // only the last used column may be an inequality
                        break;
                }
            } else {
                // Array index:
                assert(index.on.length === 1);
                const prop = index.on[0];
                const clause = whereClauses.find( wc =>
                    wc.key === prop && wc instanceof ArrayContainsClause );
                if (clause)
                    plan.push(clause);
            }
            if (plan.length > 0) {
                // OK, this set of WhereClauses matches this index. But is it the best?
                if (bestPlan === undefined || plan.length > bestPlan.length
                        || plan.at(-1)!.generality < bestPlan.at(-1)!.generality) {
                    bestPlan = plan;
                    producer.index = index;
                }
            }
        }

        if (bestPlan) {
            producer.indexedWhereOrSort = bestPlan;
            for (const clause of bestPlan)
                whereExprs.delete(clause.sourceExpression as Operation);
            if (bestPlan[0].key === sortProp)
                usedSortProp = true;
        } else if (sortProp) {
            // No indexed WHERE expressions, but we can use an index for ORDER BY:
            producer.index = source.collection!.indexOfProperty(sortProp);
            producer.indexedWhereOrSort = [sortProp];
            usedSortProp = true;
        }

        if (usedSortProp) {
            producer.reverse = sortExprs![0].descending ?? false;
            sortExprs?.splice(0, 1); // it's not needed for sorting anymore
        }

        // See if there are other whereExprs we can use as unindexed filters at this stage:
        allowedSources.add(source); // temporarily allow this source
        for (const expr of Array.of(...whereExprs)) {
            if (this.exprUsesAllowedSources(expr, allowedSources)) {
                if (!producer.filters) producer.filters = [];
                producer.filters.push(this.#context.compile(expr));
                whereExprs.delete(expr);
            }
        }
        allowedSources.delete(source);

        return new RevProducer(producer);
    }


    // Subroutine of processWhereClause().
    // Attempts to translate `expr` into a `WhereClause` on a property of `source`.
    // - The opcode must be a supported binary relation, or BETWEEN.
    // - One operand must be a property of `source`.
    // - Other operands must not use any sources except those in `allowedSources`.
    // If this isn't possible, it returns `undefined`.
    private asWhereClause(expr: Operation,
                          source: SourceInfo,
                          allowedSources: Set<SourceInfo>) : WhereClause | undefined {
        if (expr.length < 3)
            return undefined;
        let [op, keyExp, valExp] = expr;
        if (op === 'ANY')
            return this.anyAsWhereClause(expr, source, allowedSources);
        if (expr.length > 3 && op !== 'BETWEEN')
            return undefined;

        // Get the property:
        let [keySource, key] = this.expToKeyPath(keyExp);
        if (keySource !== source || key === undefined) {
            // LHS isn't a property; try the RHS:
            [keyExp, valExp] = [valExp, keyExp];
            [keySource, key] = this.expToKeyPath(keyExp);
            if (keySource !== source || key === undefined)
                return undefined;                   // -> neither side is a property of `source`
            // Swapping LHS/RHS reverses the op too:
            switch (op) {
                case '<':   op = '>'; break;
                case '<=':  op = '>='; break;
                case '>':   op = '<'; break;
                case '>=':  op = '<='; break;
                case 'LIKE':
                case 'BETWEEN': return undefined;   // -> LIKE and BETWEEN can't be reversed
            }
        }

        // Check whether `valExp` uses sources not in `allowedSources`:
        if (!this.exprUsesAllowedSources(valExp, allowedSources))
            return undefined;                       // -> Value depends on disallowed sources

        // Based on the operation, create a WhereClause for BasicQuery:
        const ctx = this.#context;
        const valCompiled = ctx.compile(valExp);
        switch(op) {
            case '<':
            case '<=':
                return new KeyRangeClause(expr, key, undefined, valCompiled, true, (op === '<='));
            case '>':
            case '>=':
                return new KeyRangeClause(expr, key, valCompiled, undefined, (op === '>='), true);
            case '=':
            case 'IS':
                return new KeyValueClause(expr, key, valCompiled);
            case 'LIKE': {
                const val = preEvaluate(ctx, valCompiled);
                if (typeof val === 'string') {
                    const [mode, substring] = likeMode(val);
                    switch (mode) {
                        case 0:  return new KeyValueClause(expr, key, ctx.compile(substring));
                        case 1:  return new KeyPrefixClause(expr, key, substring);
                    }
                }
                break;
            }
            case 'BETWEEN': {
                if (this.exprUsesAllowedSources(expr[3], allowedSources))
                    return new KeyRangeClause(expr, key, valCompiled, ctx.compile(expr[3]));
                break;
            }
            case 'IN': {
                return new ArrayContainsClause(expr, key, valCompiled);
            }
        }
        return undefined;
    }


    // Subroutine of asWhereClause() that handles 'ANY' expressions.
    private anyAsWhereClause(expr: Operation,
                             source: SourceInfo,
                             allowedSources: Set<SourceInfo>) : WhereClause | undefined {
        const [_op, varName, arrayExpr, testExpr] = expr;
        let [keySource, key] = this.expToKeyPath(arrayExpr);
        if (keySource !== source || key === undefined)
            return undefined;
        if (MatchOp(testExpr, '=')) {
            let itemExpr;
            if (MatchOp(testExpr[1], '?', varName))
                itemExpr = testExpr[2];
            else if (MatchOp(testExpr[2], '?', varName))
                itemExpr = testExpr[1];
            if (itemExpr && this.exprUsesAllowedSources(itemExpr, allowedSources))
                return new ArrayContainsClause(expr, key, this.#context.compile(itemExpr));
        }
        //TODO: Handle testExpr being 'IN', or multiple 'OR'ed '=' comparisons
        return undefined;
    }


    // True if `expr` uses only the data sources given in `allowedSources`.
    private exprUsesAllowedSources(expr: Expr, allowedSources: Set<SourceInfo>): boolean {
        for (const alias of ExprAliases(expr)) {
            const info = this.#aliases.get(alias);
            assertDefined(info);
            if (info.type === 'result') {
                if (info.sources) {
                    for (const src of info.sources)
                        if (!allowedSources.has(src))
                            return false;
                }
            } else {
                return allowedSources.has(info);
            }
        }
        return true;
    }


    // Converts an Expr to a property of a source, if its operation is '.' or 'META()'.
    private expToKeyPath(expr: Expr): [SourceInfo | undefined, DocProperty | undefined] {
        if (Array.isArray(expr) && (expr[0] === '.' || expr[0] === 'META()')) {
            const source = this.#aliases.get(checkString(expr[1]));
            if (source?.type === 'collection' || source?.type === 'join') {
                let path = undefined;
                if (expr[0] === '.') {
                    for (let i = 2; i < expr.length; ++i)
                        if (typeof expr[i] !== 'string')
                            return [undefined, undefined];
                    path = (expr as string[]).slice(2).join('.');
                } else { // 'META()':
                    switch (expr[2]) {
                        case 'id':       path = DocIDProperty; break;
                        case 'sequence': path = SequenceProperty; break;
                        case 'expires':  path = ExpiresProperty; break;
                    }
                }
                if (path)
                    return [source, source.collection!.property(path)];
            }
        }
        return [undefined, undefined];
    }


    // Tries to come up with a name for a result column that doesn't have an explicit alias.
    private defaultResultName(what: Expr): string | undefined {
        if (!Array.isArray(what))
            return undefined;
        const op = what[0];
        if (op === '.' || op === 'META()') {
            // Use the source or property name as a default alias:
            const src = what[1] as string;
            if (this.#aliases.has(src)) {
                if (op === '.' && what.length === 2 && !what.aliasAdded) {
                    // `collection.*` is unnested; add ".*" to inform RowObjectifier.
                    // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/selectclause.html#ex-star
                    return src + ".*";
                } else {
                    const last = what.at(-1);
                    if (typeof last === 'string')
                        return last;
                }
            }
        }
        return undefined;
    }


    /** Finds which sources each result is dependent on. */
    private findResultSources() {
        for (const [_alias, info] of this.#aliases) {
            if (info.type === 'result')
                this.getResultSources(info);
        }
    }

    private getResultSources(result: ResultInfo): Set<SourceInfo> {
        if (result.sources === undefined) {
            check(!result._findingSources, `Result "${result.alias} has a circular dependency`);
            result._findingSources = true;
            let sources = new Set<SourceInfo>;
            for (const usesAlias of ExprAliases(result.what)) {
                const uses = this.#aliases.get(usesAlias);
                assertDefined(uses);
                if (uses.type !== 'result') {
                    sources.add(uses);
                } else {
                    for (const source of this.getResultSources(uses))
                        sources.add(source);
                }
            }
            result.sources = sources;
            delete result._findingSources;
        }
        return result.sources;
    }


    readonly #context       = new EvalContext();            // State for CompiledExprs to read
    readonly #aliases       = new Map<string,AliasInfo>();  // Maps alias -> source/result info
    readonly #pipelineStart : NullRevProducer;              // Head of pipeline
    readonly #pipelineEnd   : RowPasser<JSONObject>;        // Tail of pipeline
    #parameters             : Record<string,JSONValue> = {};
    readonly #proxyParameters: Record<string,JSONValue>;
    #running                = false;                        // Prevents reentrant `run` calls
    #interrupted            = false;
    #observer?              : QueryObserver<Schema>;
}


// Info about a data source, stored in Query.#aliases.
interface SourceInfo {
    type        : DataSourceType,   // Type of source: 'collection' | 'join' | 'unnest'
    alias       : string;           // Its alias
    collection? : Collection,       // Source collection (unless it's an UNNEST)
    source      : DataSource,       // JSON specification
}

// Info about a named result, stored in Query.#aliases.
interface ResultInfo {
    type        : 'result';         // To distinguish this from SourceInfo
    alias       : string;           // Only explicit aliases here
    what        : Expr;             // The column's expression
    sources?    : Set<SourceInfo>;  // Sources used in the `what` expression
    _findingSources?: boolean;
}

type AliasInfo = SourceInfo | ResultInfo;


// Attempts to evaluate an Expr, but if it relies on a data source that isn't present,
// returns `undefined` instead of throwing.
function preEvaluate(context: EvalContext, expr: Expr | CompiledExpr): Value {
    try {
        if (typeof expr === 'function')
            return expr();
        else
            return context.compile(expr)();
    } catch (x) {
        if (x instanceof MissingDataSourceError || x instanceof MissingParameterError)
            return undefined;   // -> depends on doc properties, can't be evaluated yet
        else
            throw x;
    }
}


// Converts an item of a Select's ORDER_BY clause into a SortExpr for use by the SorterProjector.
function makeSortExpr(context: EvalContext, order: Expr): SortExpr {
    let desc = undefined;
    if (Array.isArray(order)) {
        if (order[0] === 'DESC') {
            desc = true;
            order = order[1];
        } else if (order[0] === 'ASC') {
            order = order[1];
        }
    }
    return {expr: context.compile(order), descending: desc};
}

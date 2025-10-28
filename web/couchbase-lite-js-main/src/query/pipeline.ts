//
// query/pipeline.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import * as N1QL from './N1QLFunctions';
import { EvalContext, RowState, type Value } from "./eval";
import { assert, assertDefined, assertionFailed, check, checkNumber } from "@/util/assert";
import { IDKey, RevFlagDeleted, SeqKey, type LocalRevision } from "@/database/internals";
import { ScalarWhereClause, type DexieQuery, type WhereClause } from "./whereClause";
import type { Collection, DocID, JSONArray, JSONObject } from "@/couchbase-lite";
import * as dexie from "dexie";
import { DocProperty } from "@/database/docProperty";
import { Decompile } from "./decompile";
import { isDictionary } from "@/database/types";
import type { CompiledExpr } from "./eval";
import { JSONMap } from "@/util/jsonMap";
import type { JoinType } from "./schema";
import type { Index } from "@/database/collection";


/*  This is the runtime engine of a query. It's a group of classes that implement
    interfaces `Producer` and `Receiver` that let them pipe data to each other.
    The `Query` class assembles these to implement specific queries.
*/


export type QueryRow = Value[];


export interface Explainable {
    explain(explanation: string[]): void;
}


/** A Producer creates instances of `Output` and passes them to a compatible `Receiver`. */
export interface Producer<Output> extends Explainable {
    /** The object that will receive the `Output` values produced. */
    receiver: Receiver<Output>;

    /** Composes this Producer with a compatible Receiver.
     *  Sets the `receiver` property, and returns the Receiver instance for further chaining. */
    then<T extends Receiver<Output>> (r: T): T;
}


/** A Receiver handles a series of `Input` values sent by a Producer. */
export interface Receiver<Input> extends Explainable {
    /** Always called once before a new series of values is sent. Clears this object's state. */
    start(): void;
    /** Receives a new input value. */
    next(input: Input): boolean;
    /** Always called once when the series of values is complete. */
    end(): void;
}


abstract class ReceiverProducer<T, U> implements Receiver<T>, Producer<U> {
    public receiver!: Receiver<U>;
    then<R extends Receiver<U>> (r: R): R   { return this.receiver = r;}
    start(): void                           { this.receiver.start(); }
    abstract next(rowState: T): boolean;
    end(): void                             { this.receiver.end(); }
    explain(explanation: string[]): void    { this.receiver?.explain(explanation); }
}


//////// REV PRODUCER:


/** A degenerate RevProducer that only produces a single, empty, RowState with no sources.
 *  Used by queries with no `FROM` clause at all. */
export class NullRevProducer implements Producer<RowState> {
    public receiver!: Receiver<RowState>;

    then<R extends Receiver<RowState>> (rcvr: R): R {
        return this.receiver = rcvr;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async run(ctx: EvalContext): Promise<boolean> {
        this.receiver.start();
        if (!this.receiver.next(new RowState(ctx)))
            return false;
        this.receiver.end();
        return true;
    }

    /** Stops an active `run` call ASAP, causing its promise to reject. */
    interrupt() { }

    explain(explanation: string[]): void {
        this.receiver?.explain(explanation);
    }

    /** Convenience method to generate the explanation as a single multi-line string. */
    get explanation(): string {
        let exp: string[] = [];
        this.explain(exp);
        return exp.join('\n');
    }
}


/** Error thrown by {@link Query.execute} if the query's {@link Query.interrupt interrupt} method
 *  was called during execution. */
export class InterruptedQueryError extends Error {
    constructor() {super("Query interrupted"); this.name = "InterruptedQueryError";}
}


export interface RevProducerConfig {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection          : Collection<any>,
    alias               : string,
    index?              : Index,
    indexedWhereOrSort? : WhereClause[] | DocProperty[],
    reverse?            : boolean,
    filters?            : CompiledExpr[]
};


/** Produces revisions from a Collection using a Dexie query. Can search or scan a single index.
 *  @param collection  The CBL Collection.
 *  @param alias  The alias of the collection.
 *  @param indexedWhereOrSort  List of WhereClauses describing an index to search,
 *                or list of keys of an index to scan in its entirety. */
export class RevProducer extends NullRevProducer {

    constructor(private readonly config: RevProducerConfig) {
        super();
        this.collection = config.collection;
        this.alias = config.alias;
        this.#index = config.index;
        this.#filterDeleted = true;
        if (config.indexedWhereOrSort?.length) {
            assertDefined(config.index, "config.index");
            const keys = config.indexedWhereOrSort.map( w => (w instanceof DocProperty) ? w : w.key);
            if (config.indexedWhereOrSort[0] instanceof DocProperty)
                this.#indexedSort = config.indexedWhereOrSort as DocProperty[];
            else
                this.#indexedWhere = config.indexedWhereOrSort as WhereClause[];

            // If we are using an index other than docID or sequence, it will never contain
            // deleted revisions, so we won't need to filter those out:
            if (keys.some( prop => prop.keypath !== IDKey && prop.keypath !== SeqKey ))
                this.#filterDeleted = false;
        }
        if (this.config.filters?.length === 0)
            this.config.filters = undefined;
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly collection: Collection<any>;
    readonly alias: string;


    async run(ctxOrState: EvalContext | RowState): Promise<boolean> {
        this.#interrupted = false;
        const ctx = (ctxOrState instanceof EvalContext) ? ctxOrState : ctxOrState.ctx;
        const outerState = (ctxOrState instanceof EvalContext) ? undefined : ctxOrState;
        const joiner = (this.receiver instanceof Joiner) ? this.receiver : undefined;

        let query;
        if (outerState)
            query = outerState.use( () => this.makeQuery() );
        else
            query = this.makeQuery();

        this.receiver.start();
        let ok = true;
        if (query !== undefined) {
            const rowState = outerState ?? new RowState(ctx);
            let revs = await query.toArray();
            if (this.#interrupted)
                throw new InterruptedQueryError();
            for (let rev of revs) {
                if (rev.encrypted)      //TODO: Only do this if query uses encrypted properties!
                    await this.collection.decryptRevision(rev);
                rowState.dataSources.set(this.config.alias, rev);
                if (!this.config.filters || this.config.filters.every( f => rowState.eval(f) )) {
                    // Ugly special case: InnerJoiner's 'next' has to be async since it runs
                    // a nested Dexie query.
                    ok = joiner ? await joiner.asyncNext(rowState) : this.receiver.next(rowState);
                    if (!ok)
                        break;
                }
            }
            outerState?.dataSources.delete(this.config.alias);
        }
        if (ok) {
            if (joiner)
                await joiner.asyncEnd(ctx);
            else
                this.receiver.end();
        }
        return true;
    }


    /** Stops an active `run` call ASAP, causing its promise to reject. */
    override interrupt() {
        this.#interrupted = true;
        if (this.receiver instanceof Joiner)
            this.receiver.interrupt();
    }


    /** Subroutine of `run` that creates the Dexie query. */
    protected makeQuery(): DexieQuery | undefined {
        const table = this.collection.dexieTable;
        let query: DexieQuery | undefined;
        if (!this.#index) {
            // No indexes; we're scanning the whole table:
            query = table.toCollection();
        } else if (this.#indexedWhere) {
            // Searching an index:
            const dxWhere = table.where(this.#index.name);
            if (this.#index.on.length === 1) {
                // Single index:
                query = this.#indexedWhere[0].applyTo(dxWhere);
                if (query === undefined) return undefined;
            } else {
                // Compound index; the ranges given to dxWhere must be tuples matching the index's
                // properties. https://dexie.org/docs/Compound-Index
                const mins: Value[] = [], maxs: Value[] = [];
                for (const clause of this.#indexedWhere) {
                    check(clause instanceof ScalarWhereClause,
                          "compound index can't handle arrays");
                    mins.push(clause.minValue ?? dexie.Dexie.minKey);
                    maxs.push(clause.maxValue ?? (dexie.Dexie.maxKey as Value));
                }
                while (mins.length < this.#index.on.length) {
                    mins.push(dexie.Dexie.minKey);
                    maxs.push(dexie.Dexie.maxKey as Value);
                }
                const lastClause = this.#indexedWhere.at(-1) as ScalarWhereClause;
                query = dxWhere.between(mins, maxs, lastClause.includeMin, lastClause.includeMax);
            }
        } else {
            // Scanning an entire index:
            query = table.orderBy(this.#index.name);
        }
        if (this.config.reverse)
            query = query.reverse();
        if (this.#filterDeleted)
            query = query.filter( rev => ((rev.flags ?? 0) & RevFlagDeleted) === 0 );
        return query;
    }


    explain(explanation: string[]) {
        if (this.#indexedWhere) {
            explanation.push(`Search index "${this.#index!.name}" of collection ${this.collection.name} where (`);
            for (let where of this.#indexedWhere)
                explanation.push(`    ${where}`);
            explanation[explanation.length - 1] += " )";
        } else if (this.#indexedSort) {
            explanation.push(`Scan index "${this.#index!.name}" of collection ${this.collection.name}`);
        } else {
            explanation.push(`Scan collection ${this.collection.name}`);
        }
        explanation[explanation.length - 1] += (this.config.reverse ? " in reverse order:" : ":");
        if (this.#filterDeleted)
            explanation.push("    - If doc is not deleted,");
        if (this.config.filters) {
            for (const filter of this.config.filters)
                explanation.push(`    - If ${Decompile(filter)},`);
        }
        super.explain(explanation);
    }

    readonly #index?        : Index;                    // The index being searched, if any
    readonly #indexedWhere? : readonly WhereClause[];   // Index constraint(s)
    readonly #indexedSort?  : readonly DocProperty[];   // Indexed properties to sort by
    readonly #filterDeleted : boolean;                  // True if deleted revs must be detected
    #interrupted = false;                               // I've been interrupted
}


//////// FILTER:


/** Implements the portions of WHERE that don't turn into index ranges.
 *  Filters RowStates according to one or more CompiledExpr predicates. */
export class RevFilterer extends ReceiverProducer<RowState,RowState> {
    constructor(public readonly filters: CompiledExpr[]) { super(); }

    next(rowState: RowState) {
        for (const filter of this.filters)
            if (!rowState.eval(filter))
                return true;
        return this.receiver.next(rowState);
    }

    explain(explanation: string[]) {
        for (const filter of this.filters)
            explanation.push(`    - If ${Decompile(filter)},`);
        super.explain(explanation);
    }
}


//////// JOIN:


/** Implements INNER and LEFT OUTER joins. Runs a nested RevProducer for every row it receives,
 *  and passes the rows from that to its receiver. */
export class Joiner extends ReceiverProducer<RowState,RowState> {
    constructor(readonly producer: RevProducer,
                readonly joinType: JoinType) {super();}

    start() {
        this.#interrupted = false;
        if (this.joinType === 'OUTER')
            this.#usedDocIDs = new Set<DocID>();
        super.start();
    }

    // LeftJoiner's `next` method has to be async since it runs a nested query.
    // But we don't want to make `Receiver.next()` async because it would be terrible for
    // performance. Instead we have a kludge where LeftJoiner has an `asyncNext` method instead,
    // and RevProducer is special-cased to call that when its receiver is a LeftJoiner.
    next(_rowState: RowState): never {assertionFailed("Joiner.next should not be called");}

    async asyncNext(rowState: RowState): Promise<boolean> {
        // Plug my nested RevProducer into my receiver:
        let rowsGenerated = 0;
        this.producer.then( {
            start: () => {
                rowsGenerated = 0;
            },
            next: (input: RowState) => {
                ++rowsGenerated;
                if (this.#usedDocIDs) {
                    const rev = input.dataSources.get(this.producer.alias) as LocalRevision;
                    this.#usedDocIDs?.add(rev.id);
                }
                return this.receiver.next(input);
            },
            end: () => {
                if (rowsGenerated === 0 && this.joinType === 'LEFT OUTER') {
                    // LEFT OUTER join emits an empty row if no rows match:
                    rowState.dataSources.set(this.producer.alias, {});
                    this.receiver.next(rowState);
                }
            },
            explain: (_explanation: string[]) => {}
        });

        return await this.producer.run(rowState);
    }

    interrupt() {
        this.#interrupted = true;
        this.producer.interrupt();
    }

    end(): never {assertionFailed("Joiner.end should not be called");}

    async asyncEnd(ctx: EvalContext) {
        if (this.#usedDocIDs && !this.#interrupted) {
            // A RIGHT OUTER join emits all the right-hand rows that weren't already emitted,
            // with an empty left-hand row:
            const revs = await this.producer.collection.dexieTable
                .where(IDKey)
                .noneOf(Array.of(...this.#usedDocIDs.values()))
                .filter( rev => !((rev.flags ?? 0) & RevFlagDeleted) )
                .toArray();
            if (revs.length > 0) {
                const myAlias = this.producer.alias;
                let leftAliases: string[] = [];
                for (const [alias, _] of ctx.sourceTypes) {
                    if (alias === myAlias)
                        break;
                    else
                        leftAliases.push(alias);
                }
                for (const rev of revs) {
                    if (this.#interrupted)
                        break;
                    const rowState = new RowState(ctx);
                    for (const alias of leftAliases)
                        rowState.dataSources.set(alias, {});
                    rowState.dataSources.set(myAlias, rev);
                    this.receiver.next(rowState);
                }
            }
        }
        this.receiver.end();
    }

    explain(explanation: string[]): void {
        explanation.push(`    - ${this.joinType.toLowerCase()} join with:`);
        let nestedEx: string[] = [];
        this.producer.explain(nestedEx);
        explanation.push(... nestedEx.map(s => "        " + s));
        super.explain(explanation);
    }

    #usedDocIDs?: Set<DocID>;
    #interrupted = false;
}


//////// UNNEST:


/** Implements UNNEST. */
export class Unnester extends ReceiverProducer<RowState,RowState> {
    constructor(readonly onExpr: CompiledExpr,
                readonly alias: string) {super();}

    next(rowState: RowState): boolean {
        let array = rowState.eval(this.onExpr);
        if (Array.isArray(array)) {
            for (const item of array) {
                rowState.dataSources.set(this.alias, item);
                if (!this.receiver.next(rowState))
                    return false;
            }
        }
        return true;
    }

    explain(explanation: string[]): void {
        explanation.push(`    - Scan unnested array ${Decompile(this.onExpr)} as '${this.alias}':`);
        super.explain(explanation);
    }
}


//////// GROUP BY:


/** Implements GROUP BY.
 *  @warning If using this, do not add an Aggregator to the pipeline.
 *  - On start(), it starts its receiver.
 *  - On next(), it evaluates its `groupBy` expression. For each distinct value, it
 *    makes a new Aggregator; then it calls `next` on that Aggregator.
 *  - On end(), it ends each AggregateAdapter (which will pass its aggregated row to the
 *    receiver), then ends its receiver. */
export class Grouper extends ReceiverProducer<RowState,RowState> {
    constructor(private readonly groupBy: CompiledExpr[],
                private readonly having: CompiledExpr | undefined,
                public readonly ctx: EvalContext) {super();}

    start() {
        this.#groups = new JSONMap<Aggregator>();
        super.start();
    }

    next(rowState: RowState) {
        check(this.groupBy.length === 1, "unsupported multiple GROUP BY conditions");   //TODO
        const groupID = rowState.eval(this.groupBy[0]);
        const agg = this.#groups!.upsert(groupID, () => {
            // Create Aggregator for new groupID:
            let a = new Aggregator(this.ctx, true);
            a.receiver = this.receiver;
            a.start();
            return a;
        });
        return agg.next(rowState);
    }

    end() {
        for (const agg of this.#groups!.values())
            agg.end(this.having);
        this.#groups = undefined;
        super.end();
    }

    explain(explanation: string[]) {
        const source = this.groupBy.map(Decompile).join(",  ");
        explanation.push(`Group rows by ${source}, and for each group:`);
        new Aggregator(this.ctx, true).explain(explanation);
        if (this.having)
            explanation.push(`Keep groups having ${Decompile(this.having)}`);
        super.explain(explanation);
    }

    #groups?: JSONMap<Aggregator>;
}


//////// AGGREGATION:


/** Implements aggregation. A required part of any pipeline that uses aggregate functions but
 *  doesn't have a Grouper.
 *  - On start(), copies the context's list of Aggregates and calls the receiver's start().
 *  - On next(), evaluates each Aggregate's argument and adds it to the Aggregate.
 *  - On end(), adds its Aggregates to the last RowState and passes that to its receiver's
 *    next() method, then calls the receiver's end().
 *  However, if the `isGrouped` flag is set, meaning that there is a GroupAdapter upstream,
 *  it will not call the receiver's start() or end(); instead the GroupAdapter does that. */
export class Aggregator extends ReceiverProducer<RowState,RowState> {
    constructor(public readonly ctx: EvalContext,
                public isGrouped = false) {super();}

    clone(): Aggregator {
        let a = new Aggregator(this.ctx, this.isGrouped);
        a.receiver = this.receiver;
        return a;
    }

    start() {
        this.#lastRow = undefined;
        this.#aggregates = this.ctx.copyAggregates()!;
        assert(this.#aggregates !== undefined, "no aggregates");
        if (!this.isGrouped)
            super.start();
    }

    next(rowState: RowState) {
        rowState.use( () => {
            for (let agg of this.#aggregates!)
                agg.accumulate();
        });
        if (this.#lastRow === undefined)
            this.#lastRow = rowState.clone();
        return true;
    }

    end(having?: CompiledExpr) {
        const rowState = this.#lastRow ?? new RowState(this.ctx);
        rowState.aggregates = this.#aggregates;
        this.#lastRow = undefined;
        this.#aggregates = undefined;

        if (!having || rowState.eval(having))
            this.receiver.next(rowState);
        if (!this.isGrouped)
            super.end();
    }

    explain(explanation: string[]) {
        for (const agg of this.ctx.copyAggregates()!)
            explanation.push(`    - Accumulate state for ${Decompile(agg.sourceExpression)}`);
        explanation.push("After aggregating,");
        super.explain(explanation);
    }

    #aggregates?    : N1QL.Aggregate[];
    #lastRow?       : RowState;
}


//////// PROJECTION & ORDER BY:


/** Implements SELECT, i.e. projection: evaluates each the column expression in the context of a
 *  RowState, and passes the results on as a QueryRow. */
export class Projector extends ReceiverProducer<RowState, QueryRow> {
    constructor(readonly columnExprs: readonly CompiledExpr[],
                readonly columnNames: readonly string[]) {super();}

    next(rowState: RowState) {
        return this.receiver.next(this.makeRow(rowState));
    }

    protected makeRow(rowState: RowState) {
        return rowState.use( () => this.columnExprs.map( x => x() ) );
    }

    explain(explanation: string[]) {
        let i = 0;
        explanation.push(`    - Produce row {`);
        for (const alias of this.columnNames) {
            let str = "        ";
            if (!alias.endsWith('.*'))
                str += `${alias}: `;
            str += Decompile(this.columnExprs[i++]);
            if (i < this.columnNames.length) str += ",";
            explanation.push(str);
        }
        explanation[explanation.length - 1] += " }";
        super.explain(explanation);
    }
}


export interface SortExpr {
    expr: CompiledExpr;
    descending?: boolean;
}


/** Subclass of Projector that also implements ORDER BY.
 *  (This could be implemented as a separate unit ahead of the Projector, but since it needs to
 *  collect all the rows in memory, it's more efficient if it does the projection itself,
 *  keeping only the values it needs instead of the entire revisions.) */
export class SorterProjector extends Projector {
    constructor(columnExprs: CompiledExpr[],
                columnNames: readonly string[],
                private readonly sortExprs: SortExpr[])
    {
        // Append my sort expressions to the column exprs,
        // so each row will have its sort keys appended, for efficient sorting:
        columnExprs = Array.of(...columnExprs);
        for (const sort of sortExprs)
            columnExprs.push(sort.expr);
        super(columnExprs, columnNames);
    }

    override start() {
        this.#rows = [];
        super.start();
    }

    next(rowState: RowState) {
        this.#rows!.push(this.makeRow(rowState));
        return true;
    }

    override end() {
        // Sort the array by comparing the sort keys added to each row:
        const sortExprs = this.sortExprs;
        const nSorts = sortExprs.length;
        let rows = this.#rows!;
        rows.sort( (row1, row2) => {
            for (let i = -nSorts; i < 0; ++i) {
                let cmp = N1QL.compare(row1.at(i), row2.at(i));
                if (cmp !== 0)
                    return (sortExprs[nSorts + i].descending) ? -cmp : cmp;
            }
            return 0;
        });

        for (let row of rows) {
            // Remove the temporary sort-key columns:
            row.length -= sortExprs.length;
            // Then finally pass each row to my receiver:
            if (!this.receiver.next(row))
                return;
        }
        super.end();
    }

    explain(explanation: string[]) {
        const sorts = this.sortExprs.map( sort => {
            let str = Decompile(sort.expr);
            if (sort.descending) str += " descending";
            return str;
        });
        explanation.push(`With docs sorted by ${sorts.join(", ")},`);
        super.explain(explanation);
    }

    #rows?: QueryRow[];
}


//////// DISTINCT:


/** Implements DISTINCT. */
export class Distinctifier extends ReceiverProducer<QueryRow, QueryRow> {

    start() {
        this.#rows = new JSONMap<null>();
        super.start();
    }

    next(row: QueryRow) {
        if (this.#rows!.insert(row as JSONArray, null))
            return this.receiver.next(row);
        else
            return true;
    }

    end() {
        this.#rows = undefined;
        super.end();
    }

    explain(explanation: string[]) {
        explanation.push("Remove identical rows");
        super.explain(explanation);
    }

    #rows? : JSONMap<null>;
}


//////// OFFSET & LIMIT:


/** Implements OFFSET and LIMIT. */
export class Limiter<T> extends ReceiverProducer<T,T> {
    constructor(public readonly offsetExpr?: CompiledExpr,
                public readonly limitExpr?: CompiledExpr) { super(); }

    get offset(): number {
        if (!this.offsetExpr) return 0;
        return checkNumber(this.offsetExpr(), "query OFFSET");
    }

    get limit(): number {
        if (!this.limitExpr) return Infinity;
        return checkNumber(this.limitExpr(), "query LIMIT");
    }

    start() {
        this.#skip = this.offset;
        this.#remaining = this.limit;
        super.start();
    }

    next(row: T) {
        if (this.#skip > 0) {
            --this.#skip;
            return true;
        } else if (this.#remaining > 0) {
            --this.#remaining;
            return this.receiver.next(row) && this.#remaining > 0;
        } else {
            return false;
        }
    }

    explain(explanation: string[]) {
        if (this.offsetExpr)
            explanation.push(`Skip first ${Decompile(this.offsetExpr)} rows`);
        if (this.limitExpr)
            explanation.push(`Limit to ${Decompile(this.limitExpr)} rows`);
        super.explain(explanation);
    }

    #skip       = 0;
    #remaining  = 0;
}


//////// ROW COLLECTORS:


/** Converts a query row from an array to an object, using `aliases` as the matching keys.
 *  An alias ending in ".*" denotes a column whose object value should be merged into the
 *  result object. */
export class RowObjectifier extends ReceiverProducer<QueryRow, JSONObject> {
    constructor(readonly aliases: readonly string[]) {super();}
    next(row: QueryRow) {
        let dict: JSONObject = {};
        let i = 0;
        for (const alias of this.aliases) {
            const col = row[i++];
            if (col !== undefined) {
                if (alias.endsWith('.*') && isDictionary(col))
                    dict = {...dict, ...col};       // Merge keys into output dict
                else
                    dict[alias] = col;
            }
        }
        return this.receiver.next(dict);
    }
}


/** End of a pipeline; just collects rows in an array. */
export class RowCollector<T> implements Receiver<T> {
    start()                 {this.rows = [];}
    next(row: T)            {this.rows.push(row); return true;}
    end()                   { }
    explain(_exp: string[]) { }

    rows: T[] = [];
}


/** End of a pipeline; just calls a callback for each row. */
export class RowPasser<T> implements Receiver<T> {
    constructor(public callback? : (row: T)=>boolean) { }
    start()                 {this.ok = true;}
    next(row: T)            {return this.ok = this.ok && this.callback!(row);}
    end()                   { }
    explain(_exp: string[]) { }

    ok = true;
}

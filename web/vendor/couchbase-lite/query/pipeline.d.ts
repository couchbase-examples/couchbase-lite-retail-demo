import { EvalContext, RowState, Value, CompiledExpr } from './eval';
import { DexieQuery, WhereClause } from './whereClause';
import { Collection, JSONObject } from '../couchbase-lite';
import { DocProperty } from '../database/docProperty';
import { JoinType } from './schema';
import { Index } from '../database/collection';
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
    then<T extends Receiver<Output>>(r: T): T;
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
declare abstract class ReceiverProducer<T, U> implements Receiver<T>, Producer<U> {
    receiver: Receiver<U>;
    then<R extends Receiver<U>>(r: R): R;
    start(): void;
    abstract next(rowState: T): boolean;
    end(): void;
    explain(explanation: string[]): void;
}
/** A degenerate RevProducer that only produces a single, empty, RowState with no sources.
 *  Used by queries with no `FROM` clause at all. */
export declare class NullRevProducer implements Producer<RowState> {
    receiver: Receiver<RowState>;
    then<R extends Receiver<RowState>>(rcvr: R): R;
    run(ctx: EvalContext): Promise<boolean>;
    /** Stops an active `run` call ASAP, causing its promise to reject. */
    interrupt(): void;
    explain(explanation: string[]): void;
    /** Convenience method to generate the explanation as a single multi-line string. */
    get explanation(): string;
}
/** Error thrown by {@link Query.execute} if the query's {@link Query.interrupt interrupt} method
 *  was called during execution. */
export declare class InterruptedQueryError extends Error {
    constructor();
}
export interface RevProducerConfig {
    collection: Collection<any>;
    alias: string;
    index?: Index;
    indexedWhereOrSort?: WhereClause[] | DocProperty[];
    reverse?: boolean;
    filters?: CompiledExpr[];
}
/** Produces revisions from a Collection using a Dexie query. Can search or scan a single index.
 *  @param collection  The CBL Collection.
 *  @param alias  The alias of the collection.
 *  @param indexedWhereOrSort  List of WhereClauses describing an index to search,
 *                or list of keys of an index to scan in its entirety. */
export declare class RevProducer extends NullRevProducer {
    #private;
    private readonly config;
    constructor(config: RevProducerConfig);
    readonly collection: Collection<any>;
    readonly alias: string;
    run(ctxOrState: EvalContext | RowState): Promise<boolean>;
    /** Stops an active `run` call ASAP, causing its promise to reject. */
    interrupt(): void;
    /** Subroutine of `run` that creates the Dexie query. */
    protected makeQuery(): DexieQuery | undefined;
    explain(explanation: string[]): void;
}
/** Implements the portions of WHERE that don't turn into index ranges.
 *  Filters RowStates according to one or more CompiledExpr predicates. */
export declare class RevFilterer extends ReceiverProducer<RowState, RowState> {
    readonly filters: CompiledExpr[];
    constructor(filters: CompiledExpr[]);
    next(rowState: RowState): boolean;
    explain(explanation: string[]): void;
}
/** Implements INNER and LEFT OUTER joins. Runs a nested RevProducer for every row it receives,
 *  and passes the rows from that to its receiver. */
export declare class Joiner extends ReceiverProducer<RowState, RowState> {
    #private;
    readonly producer: RevProducer;
    readonly joinType: JoinType;
    constructor(producer: RevProducer, joinType: JoinType);
    start(): void;
    next(_rowState: RowState): never;
    asyncNext(rowState: RowState): Promise<boolean>;
    interrupt(): void;
    end(): never;
    asyncEnd(ctx: EvalContext): Promise<void>;
    explain(explanation: string[]): void;
}
/** Implements UNNEST. */
export declare class Unnester extends ReceiverProducer<RowState, RowState> {
    readonly onExpr: CompiledExpr;
    readonly alias: string;
    constructor(onExpr: CompiledExpr, alias: string);
    next(rowState: RowState): boolean;
    explain(explanation: string[]): void;
}
/** Implements GROUP BY.
 *  @warning If using this, do not add an Aggregator to the pipeline.
 *  - On start(), it starts its receiver.
 *  - On next(), it evaluates its `groupBy` expression. For each distinct value, it
 *    makes a new Aggregator; then it calls `next` on that Aggregator.
 *  - On end(), it ends each AggregateAdapter (which will pass its aggregated row to the
 *    receiver), then ends its receiver. */
export declare class Grouper extends ReceiverProducer<RowState, RowState> {
    #private;
    private readonly groupBy;
    private readonly having;
    readonly ctx: EvalContext;
    constructor(groupBy: CompiledExpr[], having: CompiledExpr | undefined, ctx: EvalContext);
    start(): void;
    next(rowState: RowState): boolean;
    end(): void;
    explain(explanation: string[]): void;
}
/** Implements aggregation. A required part of any pipeline that uses aggregate functions but
 *  doesn't have a Grouper.
 *  - On start(), copies the context's list of Aggregates and calls the receiver's start().
 *  - On next(), evaluates each Aggregate's argument and adds it to the Aggregate.
 *  - On end(), adds its Aggregates to the last RowState and passes that to its receiver's
 *    next() method, then calls the receiver's end().
 *  However, if the `isGrouped` flag is set, meaning that there is a GroupAdapter upstream,
 *  it will not call the receiver's start() or end(); instead the GroupAdapter does that. */
export declare class Aggregator extends ReceiverProducer<RowState, RowState> {
    #private;
    readonly ctx: EvalContext;
    isGrouped: boolean;
    constructor(ctx: EvalContext, isGrouped?: boolean);
    clone(): Aggregator;
    start(): void;
    next(rowState: RowState): boolean;
    end(having?: CompiledExpr): void;
    explain(explanation: string[]): void;
}
/** Implements SELECT, i.e. projection: evaluates each the column expression in the context of a
 *  RowState, and passes the results on as a QueryRow. */
export declare class Projector extends ReceiverProducer<RowState, QueryRow> {
    readonly columnExprs: readonly CompiledExpr[];
    readonly columnNames: readonly string[];
    constructor(columnExprs: readonly CompiledExpr[], columnNames: readonly string[]);
    next(rowState: RowState): boolean;
    protected makeRow(rowState: RowState): Value[];
    explain(explanation: string[]): void;
}
export interface SortExpr {
    expr: CompiledExpr;
    descending?: boolean;
}
/** Subclass of Projector that also implements ORDER BY.
 *  (This could be implemented as a separate unit ahead of the Projector, but since it needs to
 *  collect all the rows in memory, it's more efficient if it does the projection itself,
 *  keeping only the values it needs instead of the entire revisions.) */
export declare class SorterProjector extends Projector {
    #private;
    private readonly sortExprs;
    constructor(columnExprs: CompiledExpr[], columnNames: readonly string[], sortExprs: SortExpr[]);
    start(): void;
    next(rowState: RowState): boolean;
    end(): void;
    explain(explanation: string[]): void;
}
/** Implements DISTINCT. */
export declare class Distinctifier extends ReceiverProducer<QueryRow, QueryRow> {
    #private;
    start(): void;
    next(row: QueryRow): boolean;
    end(): void;
    explain(explanation: string[]): void;
}
/** Implements OFFSET and LIMIT. */
export declare class Limiter<T> extends ReceiverProducer<T, T> {
    #private;
    readonly offsetExpr?: CompiledExpr | undefined;
    readonly limitExpr?: CompiledExpr | undefined;
    constructor(offsetExpr?: CompiledExpr | undefined, limitExpr?: CompiledExpr | undefined);
    get offset(): number;
    get limit(): number;
    start(): void;
    next(row: T): boolean;
    explain(explanation: string[]): void;
}
/** Converts a query row from an array to an object, using `aliases` as the matching keys.
 *  An alias ending in ".*" denotes a column whose object value should be merged into the
 *  result object. */
export declare class RowObjectifier extends ReceiverProducer<QueryRow, JSONObject> {
    readonly aliases: readonly string[];
    constructor(aliases: readonly string[]);
    next(row: QueryRow): boolean;
}
/** End of a pipeline; just collects rows in an array. */
export declare class RowCollector<T> implements Receiver<T> {
    start(): void;
    next(row: T): boolean;
    end(): void;
    explain(_exp: string[]): void;
    rows: T[];
}
/** End of a pipeline; just calls a callback for each row. */
export declare class RowPasser<T> implements Receiver<T> {
    callback?: ((row: T) => boolean) | undefined;
    constructor(callback?: ((row: T) => boolean) | undefined);
    start(): void;
    next(row: T): boolean;
    end(): void;
    explain(_exp: string[]): void;
    ok: boolean;
}
export {};

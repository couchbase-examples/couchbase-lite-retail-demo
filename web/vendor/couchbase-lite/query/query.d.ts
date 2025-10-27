import { Collection, ListenerToken, Database } from '../couchbase-lite';
import { NoSchema, SchemaLike } from '../database/database';
import { JSONObject, JSONValue } from '../util/json_types';
import { UserFunction, UserFunctionOptions } from './compile';
import type * as logtape from "@logtape/logtape";
export { RegisterUserFunction, type UserFunction, type UserFunctionOptions } from './compile';
export { N1QLParseError } from './N1QLParser';
export { InterruptedQueryError } from './pipeline';
export type JSONObjectLike<D> = {
    [K in keyof D]: JSONValue;
};
export type QueryResult<T extends QueryResult<T> = JSONObject> = {
    [K in keyof T]: JSONObjectLike<T[K]>;
} | JSONObject;
export type QueryChangeCallback<T extends QueryResult<T> = JSONObject> = (result: QueryResult<T>[]) => void;
/** A compiled N1QL query. Created by {@link Database.createQuery}.
 *  @property database  The Database being queried.
 *  @template Schema  The database schema type, inherited from its Database. */
export declare class Query<Schema extends SchemaLike<Schema> = NoSchema> {
    #private;
    readonly database: Database<Schema>;
    /** @internal */
    constructor(database: Database<Schema>, query: string | JSONObject);
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
    get parameters(): Record<string, JSONValue>;
    set parameters(p: Record<string, JSONValue>);
    /** The names of all query parameters. */
    get parameterNames(): Set<string>;
    /** The names of the result columns, i.e. the keys in a row object. */
    readonly columnNames: readonly string[];
    /** @internal */
    readonly logger: logtape.Logger;
    /** A string that describes in human-readable form the steps the query will perform
     *  when it runs. (Format subject to change without notice.) */
    get explanation(): string;
    /** Runs the query, returning an array of rows.
     *  @throws InterruptedQueryError if {@link interrupt} was called during execution.
     *  @template T  The type of the returned rows; defaults to JSONObject.
     *              This is not type-checked, so it's up to you to make it accurate. */
    execute<T extends QueryResult<T> = JSONObject>(): Promise<T[]>;
    /** Runs the query, calling the callback for each row.
     *  @returns  True if the query completed, false if it was interrupted.
     *  @template T  The type of the returned rows; defaults to JSONObject.
     *              This is not type-checked, so it's up to you to make it accurate. */
    execute<T extends QueryResult<T> = JSONObject>(callback: (doc: T) => void): Promise<boolean>;
    /** Stops an active {@link execute} call ASAP. Does nothing if the query is not running. */
    interrupt(): void;
    /** Registers a function that will be called when the query's results change, as a result of
     *  changes to documents or to a parameter value.
     *  @param callback  The function to call. Its parameter is the new query result array.
     *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
     *            remove the listener. */
    addChangeListener<T extends QueryResult<T> = JSONObject>(callback: QueryChangeCallback<T>): ListenerToken;
    /** Registers a custom N1QL function.
     *
     *  Registration is global: it will be available in all queries on all Databases.
     *  @param name  Function's name. Case-insensitive.
     *  @param implementation  The function itself. See the type {@link UserFunction} for details.
     *  @param options  Other options such as min/max arg counts. */
    registerUserFunction(name: string, implementation: UserFunction, options?: UserFunctionOptions): void;
    /** All Collections used by this query. @internal */
    collections(): Set<Collection>;
    private checkParameterName;
    private run;
    /** Creates a pipeline `RevProducer` for the main FROM source or a JOIN.
     *  @param source  The source.
     *  @param whereExprs  The remaining unused expressions from the WHERE clause.
     *                     Expressions used by this RevProducer will be **removed** from the array.
     *  @param sortExprs  The remaining unused sorts from the ORDER BY clause.
     *                    Items used by this RevProducer will be **removed** from the array.
     *  @param allowedSources  Prior sources that will already have values at runtime, and so
     *                         can be used by this RevProducer. */
    private makeRevProducer;
    private asWhereClause;
    private anyAsWhereClause;
    private exprUsesAllowedSources;
    private expToKeyPath;
    private defaultResultName;
    /** Finds which sources each result is dependent on. */
    private findResultSources;
    private getResultSources;
}

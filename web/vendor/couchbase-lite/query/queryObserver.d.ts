import { ListenerToken, JSONObject } from '../couchbase-lite';
import { Query, QueryChangeCallback, QueryResult } from './query';
import { SchemaLike } from '../database/database';
/** Manages Query change listeners. @internal */
export declare class QueryObserver<Schema extends SchemaLike<Schema>> {
    #private;
    readonly query: Query<Schema>;
    constructor(query: Query<Schema>);
    get hasListeners(): boolean;
    addChangeListener<T extends QueryResult<T> = JSONObject>(callback: QueryChangeCallback<T>): ListenerToken;
    private startListening;
    private stopListening;
    private collectionChanged;
    /** Schedules re-running the query to see if it changed. */
    trigger(): void;
    private executeQuery;
    private callListeners;
}

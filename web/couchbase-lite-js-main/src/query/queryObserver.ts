//
// query/queryObserver.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { type Collection, ListenerToken, type JSONObject } from "@/couchbase-lite";
import type { Query, QueryChangeCallback, QueryResult } from "./query";
import { EqualValues } from "@/database/types";
import type * as logtape from "@logtape/logtape";
import { InterruptedQueryError } from "./pipeline";
import type { SchemaLike } from "@/database/database";


// Threshold for rapidity of database changes. If it's been this long since the last change,
// we re-query after the short delay. Otherwise we use the long delay. This allows for very
// low latency if changes are not too rapid, while also not flooding the app with notifications
// if changes are rapid.
const kRapidChanges = 250; // milliseconds

const kShortDelay =   0;
const kLongDelay  = 500;


/** Manages Query change listeners. @internal */
export class QueryObserver<Schema extends SchemaLike<Schema>> {

    constructor(public readonly query: Query<Schema>) {
        this.#logger = query.logger;
    }


    get hasListeners(): boolean {return this.#changeListeners.size > 0;}


    addChangeListener<T extends QueryResult<T> = JSONObject>(callback: QueryChangeCallback<T>): ListenerToken {
        if (!this.hasListeners)
            this.startListening();
        this.#changeListeners.add(callback);

        return new ListenerToken( () => {
            this.#changeListeners?.delete(callback);
            if (!this.hasListeners)
                this.stopListening();
        });
    }


    private startListening() {
        this.#logger.info `Query observer starting`;
        for (const c of this.query.collections()) {
            const token = c.addChangeListener( _change => this.collectionChanged(c) );
            this.#collListenerTokens.push(token);
        }
        this.executeQuery();
    }


    private stopListening() {
        this.#logger.info `Query observer stopping`;
        this.#collListenerTokens.forEach( token => token.remove() );
        this.#collListenerTokens = [];

        if (this.#changeTimeout !== undefined) {
            clearTimeout(this.#changeTimeout);
            this.#changeTimeout = undefined;
        }
        if (this.#executing)
            this.query.interrupt();
        this.#lastResult = undefined;
        this.#executeAgain = false;
    }


    private collectionChanged(collection: Collection) {
        this.#logger.info `Query observer notified collection ${collection.name} changed`;
        this.trigger();
    }


    /** Schedules re-running the query to see if it changed. */
    trigger() {
        if (this.hasListeners && !this.#changeTimeout) {
            const now = Date.now();
            const delay = (now - this.#lastChangeTime < kRapidChanges) ? kLongDelay : kShortDelay;
            this.#lastChangeTime = now;

            this.#changeTimeout = setTimeout( () => {
                this.#changeTimeout = undefined;
                if (this.hasListeners)
                    this.executeQuery();
            }, delay);
        }
    }


    private executeQuery() {
        if (this.#executing) {
            this.#executeAgain = true;
            this.#logger.debug `Query observer will re-execute query when done`;
            return;
        }
        this.#executing = true;
        this.#executeAgain = false;
        this.#logger.info `Query observer executing query...`;

        this.query.execute().then( result => {
            this.#executing = false;
            if (this.hasListeners) {
                if (this.#lastResult === undefined) {
                    // Got initial baseline result:
                    this.#logger.debug `...Query observer got initial result`;
                    this.#lastResult = result;
                } else if (!EqualValues(result, this.#lastResult)) {
                    // Result changed!
                    this.#lastResult = result;
                    this.callListeners(result);
                } else {
                    this.#logger.debug `...Query observer saw no change in results`;
                }
                if (this.#executeAgain)
                    this.executeQuery();
            }
        }).catch( error => {
            this.#executing = false;
            if (error instanceof InterruptedQueryError)
                this.#logger.debug `...Query observer: query interrupted`;
            else
                this.#logger.error `Query observer: query failed with error ${error}`;
            if (this.#executeAgain && this.hasListeners)
                this.executeQuery();
        });
    }


    private callListeners(result: QueryResult[]) {
        this.#logger.info `Query observer notifying ${this.#changeListeners.size} listeners!`;
        for (const listener of this.#changeListeners) {
            try {
                listener(result);
            } catch (x) {
                this.#logger.error(`Exception in QueryChangeCallback: ${x}`);
            }
        }
    }


    #changeListeners        = new Set<QueryChangeCallback>();   // Query listeners
    #collListenerTokens     : ListenerToken[] = [];             // My collection listeners
    #lastChangeTime         = 0;                                // Time DB last changed
    #changeTimeout?         : number | NodeJS.Timeout;          // Timer after coll changes
    #lastResult?            : QueryResult[];                    // Last known query result
    #executing              = false;                            // True while executing query
    #executeAgain           = false;                            // If true, need to execute again
    readonly #logger        : logtape.Logger;
}

//
// endpoint.ts
//
// Copyright 2024-Present Couchbase; Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

// github.com/couchbase/couchbase-lite-core/blob/master/modules/docs/pages/replication-protocol.adoc

import type { Checkpointer } from "./checkpointer";
import type { CollectionID, Replicator } from "./replicator";
import type * as blip from "@/blip/blip";


/** Common configuration parameters for Pusher and Puller.
 *  @interface
 *  @property continuous   If true, stay connected indefinitely [default false] */
export interface EndpointConfig {
    continuous?: boolean
}


export interface WorkerParams {
    replicator      : Replicator,
    socket          : blip.Socket,
    collectionID    : CollectionID,
    collectionIndex : number,
}


export interface EndpointParams extends WorkerParams {
    checkpointer    : Checkpointer
}


/** Abstract base class of Pusher and Puller. */
export abstract class Endpoint {
    protected constructor(params: EndpointParams, config: EndpointConfig) {
        this.collectionID = params.collectionID;
        this.collectionIndex = params.collectionIndex;
        this.replicator = params.replicator;
        this.socket = params.socket;
        this.checkpointer = params.checkpointer;
        this.#continuous = config.continuous ?? false;
    }

    readonly collectionID: CollectionID;
    readonly collectionIndex: number;

    protected readonly replicator: Replicator;
    protected readonly socket: blip.Socket;
    protected readonly checkpointer: Checkpointer;

    get isCaughtUp() : boolean  {return this.#curCaughtUp;}
    get idle() : boolean        {return this.#curIdle;}
    get done() : boolean        {return this.#curIdle && !this.#continuous;}
    get progress() : number     {return this.#curProgress;}

    // Subclass should increment this to reflect number of revs pushed/pulled.
    protected _progress = 0;

    // Subclass should set this to true when it's caught up with the server
    protected caughtUp = false;

    // Should return true if not currently doing any work.
    protected abstract checkIdle(): boolean;

    // Subclass must call this after changing _progress or caughtUp, or when the result of
    // checkIdle may have changed.
    protected statusChanged() {
        const nowIdle = this.checkIdle();
        if (nowIdle !== this.#curIdle || this._progress !== this.#curProgress || this.#curCaughtUp !== this.caughtUp) {
            this.#curIdle = nowIdle;
            this.#curProgress = this._progress;
            this.#curCaughtUp = this.caughtUp;
            this.replicator.statusChanged_();
        }
    }

    readonly #continuous: boolean;
    #curIdle = false;
    #curProgress = 0;
    #curCaughtUp = false;
}

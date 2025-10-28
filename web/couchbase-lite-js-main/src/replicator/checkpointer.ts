//
// checkpointer.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

// github.com/couchbase/couchbase-lite-core/blob/master/modules/docs/pages/replication-protocol.adoc

import type { CollectionID, Replicator } from "./replicator";
import { Checkpoint, type LocalSequence, type RemoteSequence, type RevID } from "./types";
import type * as blip from "@/blip/blip";
import type { JSONObject } from "@/util/json_types";
import { assert } from "@/util/assert";
import type * as logtape from "@logtape/logtape";
import type { WorkerParams } from "./endpoint";


const kSaveDelay = 2000;


/** Common configuration parameters for Pusher and Puller.  @internal */
export interface CheckpointerConfig {
    clientID: string,               // Unique database ID for saving on server
    initialCheckpoint?: Checkpoint; // Saved checkpoint from last replication, if any
}

/** @internal */
export interface CheckpointerDelegate {
    saveCheckpoint: (collection: CollectionID, checkpoint: Checkpoint) => Promise<void>,   // Saves updated checkpoint
}


/** Manages a collection's replication checkpoint for both its pusher and puller.  @internal */
export class Checkpointer {

    constructor(params: WorkerParams,
                private readonly config: CheckpointerConfig,
                private readonly delegate: CheckpointerDelegate,
                remoteCheckpoint: JSONObject)
    {
        this.replicator = params.replicator;
        this.collectionID = params.collectionID;
        this.collectionIndex = params.collectionIndex;
        this.#socket = params.socket;
        this.#logger = this.replicator.logger.with({
            collection: this.collectionID, type: 'checkpointer'});
        this.#checkpoint = config.initialCheckpoint ?? new Checkpoint();

        this.#checkpointRevID = (remoteCheckpoint.rev ?? "") as RevID;
        const cp = Checkpoint.fromObject(remoteCheckpoint);

        if (this.#checkpoint.empty) {
            if (this.#checkpointRevID)
                this.#logger.info `No local checkpoint but server has revid ${this.#checkpointRevID}`;
        } else if (cp && this.#checkpoint.equals(cp)) {
            this.#logger.info `Server has matching ${cp}`;
        } else {
            this.#logger.error `mismatch: I have ${this.#checkpoint}, server has ${cp}`;
            this.#checkpoint = new Checkpoint();
        }
    }

    stop() {
        this.stopTimer();
        this.#socket = undefined;
        this.#needsSave = false;
        this.#saveOperation = undefined;
    }

    get idle() {return !this.#timer && !this.#saveOperation;}

    get localSequence()  : LocalSequence | undefined {return this.#checkpoint.local;}
    get remoteSequence() : RemoteSequence | undefined {return this.#checkpoint.remote;}

    set localSequence(s: LocalSequence | undefined) {
        assert(this.#socket !== undefined);
        if (s !== this.#checkpoint.local) {
            this.#checkpoint.local = s;
            this.saveSoon();
        }
    }

    set remoteSequence(s: RemoteSequence | undefined) {
        if (!this.#socket)
            return;    // (ignore this call if it's made after stop() is called.)
        if (s !== this.#checkpoint.remote) {
            this.#checkpoint.remote = s;
            this.saveSoon();
        }
    }

    private saveSoon() {
        this.#needsSave = true;
        if (this.#timer === undefined) {
            const timerFired = () => {
                this.#timer = undefined;
                void this.saveNow();
            };
            this.#timer = setTimeout(timerFired, kSaveDelay);
        }
    }

    private stopTimer() {
        if (this.#timer) {
            clearTimeout(this.#timer);
            this.#timer = undefined;
        }
    }

    async saveNow() : Promise<void> {
        // Sanity check:
        if (!this.#socket || !this.#needsSave)
            return;

        this.#logger.debug `saveNow (${this.#checkpoint})`;
        this.stopTimer();

        // If a previous save operation is still running, wait for it to finish:
        if (this.#saveOperation)
            await this.#saveOperation;

        this.#needsSave = false;
        const checkpointToSave = JSON.stringify(this.#checkpoint);
        const props: blip.Properties = {
            Profile:    "setCheckpoint",
            collection: this.collectionIndex,
            client:     this.config.clientID
        };
        if (this.#checkpointRevID)
            props.rev = this.#checkpointRevID;

        this.#logger.debug `sending setCheckpoint ${checkpointToSave} ...`;
        this.#saveOperation = this.#socket.send(props, checkpointToSave, "nothrow");
        const reply = await this.#saveOperation;
        this.#saveOperation = undefined;
        this.#logger.debug `Saved checkpoint ${checkpointToSave} to server ...`;

        this.#checkpointRevID = reply.properties.rev as RevID;

        // Now that the checkpoint is saved remotely, tell the delegate to save it locally:
        await this.delegate.saveCheckpoint(this.collectionID, this.#checkpoint);
        this.#logger.info `Saved checkpoint ${checkpointToSave}`;
        this.replicator.statusChanged_();
    }

    toString(): string { return `Checkpointer[${this.collectionID}]`; }

    readonly collectionID: CollectionID;
    readonly collectionIndex: number;
    private readonly replicator: Replicator;

    #logger             : logtape.Logger;
    #socket?            : blip.Socket;          // The BLIP connection
    #checkpoint         : Checkpoint;           // Current checkpoint object
    #checkpointRevID?   : RevID;                // Server-side revid of checkpoint
    #timer?             : number | NodeJS.Timeout; // Timer ID from `setTimeout`; for saving
    #saveOperation?     : Promise<blip.Message>;// Outgoing `setCheckpoint` request
    #needsSave          = false;                // True when state needs saving
}

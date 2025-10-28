//
// pusher.ts
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

import {Endpoint, type EndpointConfig, type EndpointParams} from "./endpoint";
import type { LocalSequence, LocalRevision, RevisionInfo } from "./types";
import type * as blip from "@/blip/blip";
import type { JSONArray } from "@/util/json_types";
import { WithShadowAttachments } from "@/blob/sync_blobs";
import type * as logtape from "@logtape/logtape";
import { assert } from "@/util/assert";


const kDefaultBatchSize = 200;


/** Configuration parameters for pushing changes to the remote collection.
 *  @property continuous    If true, stay connected indefinitely.
 *  @property filter        Callback that can skip revisions one at a time. */
export interface PusherConfig extends EndpointConfig {
    filter?     : (rev: RevisionInfo) => boolean;
    batchSize?  : number;       // Number of changes to get from local db at once [default 200]
}

export interface PusherDelegate {
    /** Fetches revisions, ordered by sequence */
    getChanges(since: LocalSequence | undefined, limit: number): Promise<LocalRevision[]>;

    getBlob(digest: string): Promise<Uint8Array | undefined>;

    /** Notification that a revision has been successfully pushed */
    pushedRev?(rev: RevisionInfo): void;
}


export class Pusher extends Endpoint {

    constructor(params: EndpointParams,
                private readonly config: PusherConfig,
                private readonly delegate: PusherDelegate)
    {
        super(params, config);

        this.#logger = this.replicator.logger.with({collection: this.collectionID, dir: 'push'});
        this.#lastSeqRead = this.checkpointer.localSequence;
        this.#seqTracker = new LocalSeqTracker(this.#lastSeqRead);

        void this.sendMoreChanges();
    }

    override checkIdle() : boolean {
        assert(this.#pendingChangesReplies >= 0 && this.#pendingRevsToSend >= 0);
        return this.caughtUp
            && this.#pendingChangesReplies === 0 && this.#pendingRevsToSend === 0;
    }

    private async getMoreChanges() : Promise<ChangeSet> {
        // Read a batch of changes from the database:
        const limit = this.config.batchSize ?? kDefaultBatchSize;
        const since = this.#lastSeqRead;
        let changeSet: ChangeSet;
        do {
            this.#logger.debug `Getting changes since seq ${since}`;
            const changes = await this.delegate.getChanges(this.#lastSeqRead, limit);
            changeSet = {
                changes: changes,
                since: since,
                atEnd: changes.length < limit };
            if (changes.length > 0)
                this.#lastSeqRead = changes[changes.length - 1].seq;
            if (this.config.filter) {
                // Apply filter:
                changeSet.changes = changes.filter( rev => this.config.filter!(rev) );
            }
            // If filter removed all revs, repeat to get more:
        } while (changeSet.changes.length === 0 && !changeSet.atEnd);
        return changeSet;
    }

    private async sendMoreChanges() {
        let pendingSaves: Promise<void>[] | undefined;
        while (true) {
            const changeSet = await this.getMoreChanges();
            let lastSeq = this.#seqTracker.max;
            const n = changeSet.changes.length;
            if (n === 0) {
                if (this.caughtUp)
                    return;
                this.#logger.info `Done pushing existing revs, at sequence ${lastSeq}`;
                this.caughtUp = true;
                this.statusChanged();
                // Wait for the previous round of revs to finish sending:
                if (pendingSaves)
                    await Promise.all(pendingSaves);
                void this.checkpointer.saveNow();
                if (this.config.continuous)
                    continue;
                else
                    return;
            }

            const body = changeSet.changes.map( change => {
                const a: JSONArray = [change.id, change.rev, change.serverRev ?? ""];
                if (change.deleted)
                    a.push(true);
                this.#seqTracker.addSequence(change.seq);
                lastSeq = change.seq;
                return a;
            });

            this.#logger.debug `Proposing ${n} revs from seq ${changeSet.changes[0].seq} -- ${lastSeq}`;
            ++this.#pendingChangesReplies;
            const reply = await this.socket.send({
                Profile:    "proposeChanges",
                collection: this.collectionIndex
            }, body, "nothrow");
            --this.#pendingChangesReplies;

            // Wait for the previous round of revs to finish sending:
            if (pendingSaves)
                await Promise.all(pendingSaves);

            if (reply.isError) {
                this.replicator.fatalError(reply.error!);
                return;
            } else {
                pendingSaves = new Array<Promise<void>>();
                const wanted = reply.bodyJSON as JSONArray;
                let i = 0;
                for (const rev of changeSet.changes) {
                    const status = (i < wanted.length) ? wanted[i] : 0;
                    switch (status) {
                        case 0:
                            pendingSaves.push(this.sendRev(rev));
                            break;
                        case 304:
                            this.#seqTracker.finishedSequence(rev.seq);
                            break;
                        case 409:
                        default:
                            this.#logger.error `Server rejected rev ${rev.id} ${rev.rev} with status ${JSON.stringify(status)}`;
                            this.#seqTracker.finishedSequence(rev.seq);
                            break;
                    }
                    ++i;
                }
                this.#logger.debug `Server wants ${pendingSaves.length} of ${n} revs`;
                this.checkpointer.localSequence = this.#seqTracker.checkpointedSequence;
                this.statusChanged();
            }
        }
    }


    private async sendRev(rev: LocalRevision) {
        const props: blip.Properties = {
            Profile:    "rev",
            collection: this.collectionIndex,
            id:         rev.id,
            rev:        rev.rev
        };
        if (rev.serverRev && rev.serverRev !== rev.rev)
            props.history = rev.serverRev;
        const body = JSON.stringify(WithShadowAttachments(rev.body, rev.rev));

        ++this.#pendingRevsToSend;
        const reply = await this.socket.send(props, body, "nothrow");
        --this.#pendingRevsToSend;

        if (reply.isError) {
            this.replicator.fatalError(reply.error!);
            return;
        }

        this.#seqTracker.finishedSequence(rev.seq);
        this.checkpointer.localSequence = this.#seqTracker.checkpointedSequence;
        this._progress++;
        if (this.delegate.pushedRev)
            this.delegate.pushedRev(rev);
        this.statusChanged();
    }


    // Server is asking for a blob's contents. This happens while I'm uploading a doc, and the
    // server doesn't have a blob matching a digest.
    async onGetAttachment(msg: blip.Message) {
        const digest = msg.property("digest");
        this.#logger.debug `Sending blob ${digest}`;
        const contents = await this.delegate.getBlob(digest);
        if (contents)
            this.socket.sendReplyTo(msg, {}, contents);
        else
            this.socket.sendErrorReplyTo(msg, "Unknown blob", 404);
    }


    toString(): string { return `Pusher[${this.collectionID}]`; }


    #logger                 : logtape.Logger;
    #seqTracker!            : LocalSeqTracker;
    #lastSeqRead?           : LocalSequence;
    #pendingChangesReplies  = 0;
    #pendingRevsToSend      = 0;
}


interface ChangeSet {
    changes: Array<LocalRevision>;
    since?: LocalSequence;
    atEnd?: boolean;
}



/** Keeps track of which remote sequences are pending or completed, and what sequence to use as
 *  the checkpoint. */
export class LocalSeqTracker {
    /// Constructor takes the latest checkpointed sequence.
    constructor(since: LocalSequence | undefined) {
        this.#latest  = since ?? (0 as LocalSequence);
    }

    /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
    addSequence(seq: LocalSequence) {
        if (seq <= this.#latest)
            throw Error(`LocalSeqTracker.addSequence: sequence ${seq} out of order`);
        this.#requested.set(seq, this.#latest);
        this.#latest = seq;
    }

    /// Records that a pending sequence is now complete.
    finishedSequence(seq: LocalSequence) {
        if (!this.#requested.delete(seq))
            throw Error(`LocalSeqTracker.finishedSequence: ${seq} was not pending`);
    }

    get max() : LocalSequence {return this.#latest;}

    get checkpointedSequence() : LocalSequence {
        const first = this.#requested.values().next();
        return first.done ? this.#latest : first.value;
    }


    #requested  = new Map<LocalSequence,LocalSequence>();
    #latest     : LocalSequence;
}

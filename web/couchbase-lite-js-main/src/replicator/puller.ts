//
// puller.ts
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
import type { RemoteRevisionInfo, RemoteSequence, RemoteRevision } from "./types";
import {RemoteSeqTracker} from "./remoteSeqTracker";
import { isJSONObject, type JSONObject } from "@/util/json_types";
import * as blip from "@/blip/blip";
import type { CBLDictionary} from "@/database/types";
import { isValidDocID, isValidRevID } from "@/database/types";
import type * as logtape from "@logtape/logtape";
import type { BlobLoader } from "@/blob/blob";
import { AttachmentDigests, ImportAttachments } from "@/blob/sync_blobs";
import { assert } from "@/util/assert";
import type { Collection, DocID, RevID } from "@/couchbase-lite";


const kDefaultSaveBatchSize = 200;


/** Callback that resolves a conflict between a local and remote document revision.
 *  @param collection  The owning Collection.
 *  @param docID  The ID of the document.
 *  @param local  The current local document body, or null if it's been deleted (a tombstone.)
 *  @param remote  The current remove document body, or null if it's been deleted (a tombstone.)
 *  @returns  The resolved body to save, or null for a deletion. */
export type PullConflictResolver = (
    collection: Collection,
    docID: DocID,
    local: CBLDictionary | null,
    remote: CBLDictionary | null) => Promise<CBLDictionary | null>;


/** Configuration parameters for pulling changes from a remote collection.
 *  @property continuous    If true, stay connected indefinitely.
 *  @property channels      Optional set of Sync Gateway channels, for server-side filtering.
 *  @property activeOnly    If true, don't get deleted docs.
 *  @property filter        Callback that can skip individual revisions.
 *  @property conflictResolver  Callback that resolves conflicts between local and server docs. */
export interface PullerConfig extends EndpointConfig {
    channels?       : string[],
    activeOnly?     : boolean,
    filter?         : (rev: RemoteRevisionInfo) => boolean,
    conflictResolver?: PullConflictResolver,
    wantBatchSize?  : number,   // Number of revisions to pass to `wantRevs` [default up to server]
    saveBatchSize?  : number,   // Number of revisions to pass to `saveRevs` [default 200]
}

export interface PullerDelegate {
    /** Rejects existing revisions by setting their `skip` property to `true`.
     *  For other revisions, it should set `knownRevs` to the current revID(s) it has. */
    wantRevs?(rev: RemoteRevisionInfo[], caughtUp: boolean): Promise<void>

    /** Saves downloaded revisions to the database. */
    saveRevs(revs: RemoteRevision[]) : Promise<boolean>

    /** Checks whether each of the digests matches a blob in the local database.
     *  If so, returns `undefined`. Otherwise returns an array of the unknown digests. */
    missingBlobs(digests: Set<string>): Promise<string[] | undefined>;

    /** Adds a blob. Implementor must verify that the contents match the digest. */
    addBlob(digest: string, contents: Uint8Array): Promise<void>;

    blobLoader: BlobLoader;
}


interface RemoteRevisionWithMsg extends RemoteRevision {
    readonly remoteSequence: RemoteSequence;
    readonly msg: blip.Message;
}

type MessageOrRev = blip.Message | RemoteRevisionWithMsg;


/** Pulls documents from a remote collection using the Couchbase Mobile replication protocol.
    This class has no knowledge of a local database. */
export class Puller extends Endpoint {

    constructor(params: EndpointParams,
                private readonly config: PullerConfig,
                private readonly delegate: PullerDelegate)
    {
        super(params, config);

        this.#logger = this.replicator.logger.with({collection: this.collectionID, dir: 'pull'});
        this.#seqTracker = new RemoteSeqTracker(this.checkpointer.remoteSequence);

        this.#pendingRevMessages = 0;
        this.#pendingInserts = 0;

        // Now get things started by sending the `subChanges` request:
        const subRequest: blip.Properties = {
            Profile:    "subChanges",
            collection: this.collectionIndex
        };
        if (this.checkpointer.remoteSequence !== undefined)
            subRequest.since = JSON.stringify(this.checkpointer.remoteSequence);
        if (config.continuous)
            subRequest.continuous = "true";
        if (this.config.channels) {
            subRequest.filter = "sync_gateway/bychannel";
            subRequest.channels = this.config.channels.join(",");
        }
        if (this.config.activeOnly)
            subRequest.activeOnly = "true";
        if (this.config.wantBatchSize)
            subRequest.batch = this.config.wantBatchSize;
        this.#logger.debug `Sending ${JSON.stringify(subRequest)}`;

        void this.socket.send(subRequest);
    }


    override checkIdle() : boolean {
        assert(this.#pendingRevMessages >= 0 && this.#pendingInserts >= 0);
        return this.caughtUp
            && this.#pendingRevMessages === 0 && this.#pendingInserts === 0
            && this.#changesQueue.length === 0;
    }


    //-------- HANDLING CHANGES MESSAGES:

    // Number of revs to insert into db at once
    get batchSize(): number {return this.config.saveBatchSize ?? kDefaultSaveBatchSize; }


    // Handler for incoming `changes` messages:
    onChanges(msg: blip.Message) {
        if (this.canProcessChangesMessage()) {
            void this.processChangesMessage(msg);
        } else {
            this.#logger.debug `Puller queuing changes message #${msg.number}`;
            this.#changesQueue.push(msg);
        }
    }

    private canProcessChangesMessage(): boolean {
        return (this.#insertQueue?.length ?? 0) + this.#pendingRevMessages < this.batchSize + 100;
    }

    private maybeProcessChangesMessage() {
        if (this.#changesQueue.length > 0 && this.canProcessChangesMessage()) {
            const [msg] = this.#changesQueue.splice(0, 1);
            void this.processChangesMessage(msg);
        }
    }

    private async processChangesMessage(msg: blip.Message) {
        const changes = msg.bodyJSON as Array<Array<unknown>>;
        if (changes === null || changes.length === 0) {
            // Empty list of changes means we've got all the changes:
            this.#logger.debug `Got 'changes'#${msg.number}: Puller has caught up`;
            this.caughtUp = true;
            void this.maybeInsertRevs();
            if (msg.wantsReply)
                this.socket.sendReplyTo(msg, {});

        } else {
            this.#logger.debug `Got 'changes'#${msg.number}: ${changes.length} revs from seq ${changes[0][0]}`;
            const revs = changes.map( change => new RemoteRevisionInfoImpl(
                change[1] as DocID,
                change[2] as RevID,
                (change.length >= 4 && !!change[3]) ? true : undefined,  // .deleted
                (change.length >= 5 ? change[4] as number : null),       // .bodySize
                change[0] as RemoteSequence));

            let any = true;
            if (this.config.filter) {
                any = false;
                for (const rev of revs) {
                    if (this.config.filter(rev))
                        any = true;
                    else
                        rev.skip = true;
                }
            }

            if (any && this.delegate.wantRevs) {
                try {
                    await this.delegate.wantRevs(revs, this.caughtUp);
                } catch (x) {
                    this.#logger.error `wantRevs threw ${x}`;
                    this.replicator.fatalError(x as Error);
                }
            }

            const noKnownRevs = Array<RevID>();
            const answers = revs.map( rev => {
                if (!rev.skip) {
                    ++this.#pendingRevMessages;     // Decremented by onRev()
                    this.#seqTracker.addSequence(rev.remoteSequence);
                    return rev.knownRevs || noKnownRevs;
                } else {
                    this.#seqTracker.skipSequence(rev.remoteSequence);
                    return 0;
                }
            });
            this.#logger.debug `Puller replying to changes from ${changes[0][0]}`;
            this.socket.sendReplyTo(msg, {}, answers);
            this.checkpointer.remoteSequence = this.#seqTracker.getCheckpoint();
        }
        this.statusChanged();
        this.maybeProcessChangesMessage();
    }


    //-------- HANDLING REVISIONS:


    // Handler for incoming `rev` messages.
    onRev(msg: blip.Message) {
        --this.#pendingRevMessages;
        ++this.#pendingInserts;             // Decremented by finishedRev()
        this.#insertQueue.push(msg);
        void this.maybeInsertRevs();
    }


    // Inserts all the `rev` messages in `insertable` by passing them to the `saveRevs` callback.
    private async maybeInsertRevs() {
        if (this.#inserting) return;

        const batchSize = this.batchSize;

        while (this.#insertQueue.length > 0 &&
                (this.#insertQueue.length >= batchSize
                 || (this.caughtUp && this.#pendingRevMessages === 0))) {
            this.#inserting = true;
            try {
                let messages: MessageOrRev[];
                if (this.#insertQueue.length <= batchSize) {
                    messages = this.#insertQueue;
                    this.#insertQueue = [];
                } else {
                    messages = this.#insertQueue.splice(0, batchSize);
                }
                this.#logger.debug `Inserting ${messages.length} of ${messages.length + this.#insertQueue.length} revs`;

                this.maybeProcessChangesMessage();  // Start downloading more

                // Decode each BLIP message to a RemoteRevisionWithMsg:
                const revs: RemoteRevisionWithMsg[] = [];
                for (const msg of messages) {
                    if (msg instanceof blip.Message) {
                        const rev = this.decodeRevMsg(msg);
                        let blobDigests = AttachmentDigests(rev.body);
                        if (blobDigests) {
                            // This rev has blobs we need to download first; don't add it yet
                            void this.processRevWithBlobs(rev, blobDigests);
                        } else {
                            revs.push(rev);
                        }
                    } else {
                        // 'msg' is actually a RemoteRevisionWithMsg we got the blobs for:
                        revs.push(msg);
                    }
                }

                // Call the caller's `saveRevs` handler:
                let ok = false;
                try {
                    ok = await this.delegate.saveRevs(revs);
                    if (!ok)
                        this.#logger.error `Failed to save revs`;
                } catch (x) {
                    this.#logger.error `Failed to save revs: caught ${x}`;
                    this.replicator.fatalError(x as Error);
                    return;
                }

                // Done! Update the sequence tracker, and send responses to `rev` messages:
                revs.forEach( rev => this.finishedRev(rev, ok) );
                this.checkpointer.remoteSequence = this.#seqTracker.getCheckpoint();
                if (ok) {
                    this._progress += revs.length;
                    this.statusChanged();
                }
            } finally {
                this.#inserting = false;
                this.#logger.debug `End insertRevs`;
            }
        }
        this.maybeProcessChangesMessage();
    }


    // Returns a RemoteRevision object created from a `rev` message.
    private decodeRevMsg(msg: blip.Message) : RemoteRevisionWithMsg {
        const body = msg.bodyJSON as JSONObject;
        if (!isJSONObject(body))
            throw new blip.BLIPError("invalid revision body", 400);

        const id = (body._id || msg.property("id"));
        const rev = body._rev || msg.property("rev");
        if (!isValidDocID(id) || !isValidRevID(rev))
            throw new blip.BLIPError("invalid id or rev property", 400);

        const deleted = (!!body._deleted || (msg.property("deleted") !== "")) ? 1 : undefined;
        const history = msg.property("history").split(/\s*,\s*/) as RevID[];
        const remoteSequence = JSON.parse(msg.property("sequence")) as RemoteSequence;

        delete body._id;
        delete body._rev;
        delete body._deleted;

        return {id, rev, deleted, body, history, remoteSequence, msg};
    }


    // Given a rev that contains blobs, first check with the delegate whether the blob digests
    // are known. If not, send a 'getAttachment' request to the server to download the blob.
    // Finally push the rev back into #insertable so it'll get inserted.
    private async processRevWithBlobs(rev: RemoteRevisionWithMsg, digests: Set<string>) {
        try {
            let missingBlobs = await this.delegate.missingBlobs(digests);
            if (missingBlobs && missingBlobs.length > 0) {
                this.#logger.info `Downloading ${missingBlobs.length} blob(s) of doc ${rev.id}`;
                const promises = missingBlobs.map( async digest => {
                    return this.socket.send({
                        Profile:    "getAttachment",
                        collection: this.collectionIndex,
                        docID:      rev.id,
                        digest:     digest,
                    }).then( async reply => {
                        this.#logger.info `Saving ${reply.bodyData.length}-byte blob of doc "${rev.id}"`;
                        return this.delegate.addBlob(digest, reply.bodyData);
                    });
                });
                await Promise.all(promises);
            }
            // Convert SG-style _attachments to CBL-style blobs:
            ImportAttachments(rev.body, this.delegate.blobLoader);

            // It's now OK to insert this revision, so put it back in the queue:
            this.#insertQueue.push(rev);
            void this.maybeInsertRevs();

        } catch (x) {
            this.#logger.error `Unable to download blobs of doc ${rev.id}: ${(x as Error).message}`;
            this.finishedRev(rev, false);
        }
    }


    // Called when a revision has been saved or rejected.
    finishedRev(rev: RemoteRevisionWithMsg, ok: boolean) {
        const msg = rev.msg;
        if (ok) {
            this.#seqTracker.finishedSequence(rev.remoteSequence);
            if (msg.wantsReply)
                this.socket.sendReplyTo(msg, {});
        } else {
            if (msg.wantsReply)
                this.socket.sendErrorReplyTo(msg, "Failed to insert revision", 502);
        }
        if (--this.#pendingInserts === 0)
            this.statusChanged();
    }


    toString(): string { return `Puller[${this.collectionID}]`; }

    #logger             : logtape.Logger;           // Logger, duh
    #seqTracker!        : RemoteSeqTracker;         // Manages the checkpoint
    #changesQueue       : blip.Message[] = [];      // Unhandled 'changes' messages
    #pendingRevMessages = 0;                        // Number of `rev` msgs I'm waiting for
    #pendingInserts     = 0;                        // Number of revs I'm waiting to insert
    #insertQueue        = new Array<MessageOrRev>;  // Revs waiting to be added to db
    #inserting          = false;                    // True while revs are being added to db
}


class RemoteRevisionInfoImpl implements RemoteRevisionInfo {
    constructor(public readonly id: DocID,
                public readonly rev: RevID,
                public readonly deleted: true | undefined,
                public readonly bodySize: number | null,
                public remoteSequence: RemoteSequence) { }
    public knownRevs?: RevID[];
    public skip?: boolean;
}

//
// replicator.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { type Database, ReadOnly } from "./database";
import * as repl from "@/replicator/replicator";
import { assert } from "@/util/assert";
import * as blob from "@/blob/blob";
import type * as logtape from "@logtape/logtape";
import type { CBLDictionary, DocID } from "./types";
import type { Collection } from "./collection";
import { type LocalRevision, RevFlagDeleted } from "./internals";
import type { Checkpoint } from "@/replicator/types";
import type { ListenerToken } from "@/couchbase-lite";

export { type Credentials, type CheckpointerDelegate, type PusherConfig, type PullerConfig, type PullConflictResolver, type RemoteRevisionInfo, type Status } from "@/replicator/replicator";


/** Configuration for {@link Replicator}.
 *  @interface
 *  @property database  The Database to sync.
 *  @property url  Server URL to connect to, with scheme "wss:" or "ws:", and database name
 *                 as first path component.
 *  @property collections  Keys are names of collections to sync;
 *                         values are per-collection configuration. */
export interface ReplicatorConfig {
    database    : Database,
    url         : string,
    credentials?: repl.Credentials,
    collections : Record<string, ReplicatorCollectionConfig>,
}


/** Per-collection Replicator configuration. At least one of `push` and `pull` must be defined. */
export interface ReplicatorCollectionConfig {
    push?       : repl.PusherConfig,
    pull?       : repl.PullerConfig,
}


/** Information about a document that's been pushed or pulled by a replicator.
 *  @see {@link Replicator.onDocuments} */
export interface DocumentEnded {
    docID   : DocID,
    deleted?: boolean,
    error?  : Error,
}


/** Syncs one or more {@link Collection}s with their remote counterparts. */
export class Replicator implements repl.CheckpointerDelegate {

    constructor(private config: ReplicatorConfig) {
        this.database = config.database;
        this.logger = repl.SyncLogger.with({url: config.url});
        const ids = Object.keys(this.config.collections);
        assert(ids.length > 0, "At least one collection must be replicated");
        for (const id of ids)
            void(this.database.getCollection(id));  // just verify it exists
    }

    /** The local database being replicated. */
    readonly database: Database;

    /** Callback that notifies when {@link status} changes. */
    onStatusChange? : (status: repl.Status) => void;

    /** Callback that notifies when documents have been pushed or pulled. */
    onDocuments? : (collection: Collection, direction: 'push' | 'pull', documents: DocumentEnded[]) => void;


    /** Current replication status & progress. */
    get status(): repl.Status {return this.#replicator?.status ?? this.#lastStatus;}


    /** Runs the replicator.
     *
     * This is an async operation. The returned Promise resolves when the replication completes.
     * A continuous replication usually _never_ completes, unless it encounters a fatal error or
     * you stop it, so you may not want to `await` it. */
    async run() {
        assert(!this.#replicator, "Replicator is already running");

        // Construct actual replicator config:
        let replCfg: repl.ReplicatorConfig = {
            url: this.config.url,
            credentials: this.config.credentials,
            collections: {},
        };
        for (let id of Object.keys(this.config.collections)) {
            const collCfg = this.config.collections[id];
            const collection = this.database.getCollection(id);
            const clientID = await collection.getClientID();
            const initialCheckpoint = await collection.getCheckpoint(this.config.url);
            repl.SyncLogger.debug(`Initial checkpoint of ${id} is ${initialCheckpoint}`);

            let replCollCfg: repl.CollectionConfig = {
                checkpoint: {clientID, initialCheckpoint, delegate: this}
            };
            if (collCfg.pull) {
                const startedEmpty = await collection.count('includeDeleted') === 0;
                const delegate = new PullerDelegateImpl(this, collection, collCfg.pull, startedEmpty);
                replCollCfg.pull = {...collCfg.pull, delegate};
                if (startedEmpty)
                    replCollCfg.pull.activeOnly = true;
            }
            if (collCfg.push) {
                const delegate = new PusherDelegateImpl(this, collection, collCfg.push);
                replCollCfg.push = {...collCfg.push, delegate};
            }
            replCfg.collections[id as repl.CollectionID] = replCollCfg;
        }

        // Now run the Replicator:
        this.#replicator = new repl.Replicator(replCfg);
        this.#replicator.onStatusChange = this.onStatusChange;
        try {
            await this.#replicator.run();
        } finally {
            this.#lastStatus = this.#replicator.status;
            this.#replicator = undefined;
        }

        this.logger.info `FINISHED! ${JSON.stringify(this.status)}`;
    }


    /** Stops the replicator. The current {@link run} operation's Promise will resolve with
     *  an error as soon as possible.
     *
     *  Does nothing if `run` is not active. */
    stop() {
        this.#replicator?.stop();
    }


    /** Checkpointer delegate implementation. @internal */
    async saveCheckpoint(id: repl.CollectionID, checkpoint: Checkpoint): Promise<void> {
        await this.database.getCollection(id).setCheckpoint(this.config.url, checkpoint);
    }


    readonly logger : logtape.Logger;

    #replicator?    : repl.Replicator;              // Actual replicator, while it's running
    #lastStatus     : repl.Status = {};             // Final status of the Replicator
}


class DelegateImpl {
    constructor(readonly replicator: Replicator, readonly collection: Collection, dir: string) {
        this.logger = replicator.logger.with({collection: collection.name, dir: dir});
    }

    protected readonly logger: logtape.Logger;
}


//-------- PUSHER DELEGATE:


class PusherDelegateImpl extends DelegateImpl implements repl.PusherDelegate {

    constructor(replicator: Replicator, collection: Collection,
                readonly config: repl.PusherConfig)
    {
        super(replicator, collection, 'push');
    }


    async getChanges(since: repl.LocalSequence | undefined,
                     limit: number): Promise<repl.LocalRevision[]>
    {
        const collection = this.collection;
        const changes = await collection.getDocsSinceSequence(since, limit);
        if (changes.length > 0 || !this.config.continuous)
            return changes;

        // Pusher is in continuous mode and there are no more changes.
        // The first time this happens, return the empty list as a signal that it's caught up:
        if (!this.#caughtUp) {
            this.#caughtUp = true;
            return changes;
        }

        // After that, use a 'collectionChanged' event listener to wait for changes to return:
        assert(!this.#asyncGetChanges);
        this.#asyncGetChanges = Promise.withResolvers<repl.LocalRevision[]>();
        let listener: ListenerToken;
        const onChanges = () => {
            listener.remove(); // one-shot
            const resolve = this.#asyncGetChanges?.resolve;
            if (resolve) {
                this.logger.info `Notifying Pusher of changes to collection ${collection.name}`;
                this.#asyncGetChanges = undefined;
                resolve(collection.getDocsSinceSequence(since, limit));
            }
        };
        listener = collection.addChangeListener(onChanges);
        this.logger.info `Pusher is watching for changes to collection ${collection.name}`;
        return this.#asyncGetChanges.promise;
    }


    async getBlob(digest: string): Promise<Uint8Array | undefined> {
        return await this.collection.database.blobStore.getBlob(digest);
    }


    #caughtUp           = false;
    #asyncGetChanges?   : PromiseWithResolvers<repl.LocalRevision[]>;
}


//-------- PULLER DELEGATE:


class PullerDelegateImpl extends DelegateImpl implements repl.PullerDelegate {

    constructor(replicator: Replicator, collection: Collection,
                readonly config: repl.PullerConfig,
                public startedEmpty: boolean)
    {
        super(replicator, collection, 'pull');
        this.blobLoader = this.collection.database.blobLoader;
    }

    readonly blobLoader: blob.BlobLoader;


    async wantRevs?(revs: repl.RemoteRevisionInfo[], caughtUp: boolean): Promise<void> {
        if (caughtUp)
            this.startedEmpty = false;
        else if (this.startedEmpty)
            return;

        await this.collection.inTransaction(ReadOnly, async (coll) => {
            for (const rev of revs) {
                if (!rev.skip) {
                    const knownRevs = await coll.getAncestorRevs(rev.id, rev.rev);
                    if (knownRevs)
                        rev.knownRevs = knownRevs;
                    else
                        rev.skip = true;
                }
            }
        });
    }


    async saveRevs(revs: repl.RemoteRevision[]): Promise<boolean> {
        const collection = this.collection;
        this.logger.debug `Collection ${collection.name} saving ${revs.length} documents...`;
        const now = Date.now();
        const {lastSequence, conflicts} = await collection.putRemoteRevisions(revs, this.startedEmpty);
        this.logger.info `Collection ${collection.name} saved ${revs.length} documents, ${conflicts?.size ?? 0} conflicts, as sequences thru ${lastSequence}, in ${Date.now() - now}ms`;

        if (this.replicator.onDocuments) {
            if (conflicts)
                revs = revs.filter( rev => !conflicts.has(rev.id) );
            const docs = revs.map( rev => ({docID: rev.id, deleted: !!rev.deleted}) );
            this.replicator.onDocuments(collection, 'pull', docs);
        }

        if (conflicts)
            void this.resolveConflicts(conflicts);
        return true;
    }


    async missingBlobs(digests: Set<string>): Promise<string[] | undefined> {
        let missing: string[] | undefined;
        for (const digest of digests) {
            if (!await this.collection.database.blobStore.hasBlob(digest)) {
                if (!missing) missing = [];
                missing.push(digest);
            }
        }
        return missing;
    }


    async addBlob(digest: string, contents: Uint8Array): Promise<void> {
        const gotDigest = blob.NewBlob.computeDigest(contents);
        if (digest !== gotDigest)
            throw Error(`Requested blob digest '${digest}' but the data's digest is '${gotDigest}'`);
        await this.collection.database.blobStore.saveBlob(contents, digest);
    }


    private async resolveConflicts(conflictIDs: Set<DocID>) {
        const collection = this.collection;
        const resolver = this.config.conflictResolver;
        for (const docID of conflictIDs) {
            if (!resolver) {
                this.logger.warn `Unresolved replication conflict in ${collection.name} doc ${docID}`;
                continue;
            }
            try {
                let rev: LocalRevision | undefined;
                let resolved: CBLDictionary | null = null;
                do {
                    rev = await collection.getRevision(docID, true);
                    const remote = rev?.conflict;
                    if (rev === undefined || remote === undefined)
                        break;
                    const local = ((rev.flags ?? 0) & RevFlagDeleted) ? null : rev?.body;
                    resolved = await resolver(collection, docID, local, remote);
                } while (!await collection.resolveConflict(docID, rev.rev, resolved));
                if (this.replicator.onDocuments) {
                    const doc = {docID: docID, deleted: (resolved === null)};
                    this.replicator.onDocuments(collection, 'pull', [doc]);
                }
            } catch (x) {
                this.logger.error `Exception resolving conflict in in ${collection.name} doc ${docID}: ${x}`;
            }
        }
    }
}

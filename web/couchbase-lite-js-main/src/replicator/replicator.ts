//
// replicator/replicator.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

// github.com/couchbase/couchbase-lite-core/blob/master/modules/docs/pages/replication-protocol.adoc

import * as blip from "@/blip/blip";
import { MainLogger } from "@/util/logging";
import { assert, assertDefined, check } from "@/util/assert";
import type { JSONArray, JSONObject } from "@/util/json_types";
import { Checkpointer, type CheckpointerConfig, type CheckpointerDelegate } from "./checkpointer";
import type { Endpoint, EndpointParams, WorkerParams } from "./endpoint";
import { Puller, type PullerConfig, type PullerDelegate } from "./puller";
import { Pusher, type PusherConfig, type PusherDelegate } from "./pusher";
import type * as logtape from "@logtape/logtape";
import { basicAuthHeader } from "@/util/base64";

export { type CheckpointerConfig, type CheckpointerDelegate } from "./checkpointer";
export { type PullConflictResolver, type PullerConfig, type PullerDelegate } from "./puller";
export { type PusherConfig, type PusherDelegate } from "./pusher";
export { type LocalRevision, type LocalSequence, type RemoteRevision, type RemoteRevisionInfo } from "./types";


const kReplicatorSubProtocol = "CBMobile_3";    // BLIP subprotocol identifying CB replicator
const kStatusInterval = 500;                    // How often to send status (ms)


export const SyncLogger = MainLogger.getChild("Sync");


export type CollectionID = string & {__brand: 'CollectionID'};


/** Configuration parameters. */
export interface ReplicatorConfig {
    url         : string,                                   // Server URL to connect to
    credentials?: Credentials,                              // Authentication credentials
    collections : Record<CollectionID,CollectionConfig>,    // Per-collection config
}

/** Authentication credentials for the replicator. */
export interface Credentials {
    username: string,
    password: string
}

/** Configuration for replicating a collection. */
export interface CollectionConfig {
    checkpoint  : CheckpointerConfig & {delegate: CheckpointerDelegate},
    push?       : PusherConfig       & {delegate: PusherDelegate},
    pull?       : PullerConfig       & {delegate: PullerDelegate},
}


/** Replication status and progress.
 *  @property status  The current state of the replicator.
 *  @property pushedRevisions  The number of documents uploaded to the server so far.
 *  @property pulledRevisions  The number of documents downloaded from the server so far. */
export interface Status {
    status?: "connecting" | "busy" | "idle" | "stopped",
    pushedRevisions?: number,
    pulledRevisions?: number
}


/** Couchbase Mobile replicator protocol implementation.
 *  This class is database-agnostic: it relies on delegate interfaces to read and write revisions.
 *  {@link database.Replicator} is a wrapper that supports this package's simple database API. */
export class Replicator {

    constructor(private readonly config: ReplicatorConfig) {
        this.logger = SyncLogger.with({url: config.url});
        this.#collectionIDs = Object.keys(config.collections) as CollectionID[];
        assert(this.#collectionIDs.length > 0, "must replicate at least one Collection");
        for (const id of this.#collectionIDs) {
            const cfg = config.collections[id];
            assert(cfg.push || cfg.pull, `collection '${id}' must be either pushed or pulled`);
        }
    }

    readonly logger : logtape.Logger;


    /** Starts the replicator. Completes when the replicator finishes (never if continuous.) */
    async run() : Promise<void> {
        check(!this.running, "Replicator is already running");

        let syncURL = urlAppending(this.config.url, "_blipsync");
        check(syncURL.protocol === "wss:" || syncURL.protocol === "ws:",
              "Replicator URL must have scheme wss: or ws:");

        let options: blip.NonBrowserOptions | undefined;
        if (this.config.credentials) {
            if (typeof window !== 'undefined')
                await this.authenticate(this.config.credentials);               // in browser
            else
                options = {credentials: this.config.credentials};               // in node.js
        }

        return new Promise((resolveFn, rejectFn) => {
            this.#resolveFn = resolveFn;
            this.#rejectFn = rejectFn;
            this.#expectingClose = false;
            this.#lastStatusTime = 0;

            // Create the BLIP socket:
            this.logger.info `Connecting to <${this.config.url}>...`;
            this.#socket = new blip.Socket(syncURL, kReplicatorSubProtocol, options);
            this.#socket.addEventListener("open", () => {
                this.logger.info `Connected!`;
                this.maybeNotifyStatus();
            });
            this.#socket.addEventListener("close", (error?: Error) => {
                if (error) {
                    this.logger.info `Connection closed with error: ${error}`;
                    this.fatalError(error);
                } else if (this.#expectingClose) {
                    this.logger.info `Connection closed`;
                    this.finish();
                } else {
                    this.logger.info `Connection closed unexpectedly`;
                    this.finish(Error("BLIP connection closed unexpectedly"));
                }
            });
            this.maybeNotifyStatus();
            void this.start();
        });
    }


    private async authenticate(auth: Credentials) {
        /* The browser WebSocket API has no way to authenticate. As a workaround, we first POST
           to Sync Gateway / App Services' session endpoint to establish a login session.
           The response will set a session cookie for SG's origin.
           Then, when the browser sends the WebSocket handshake request it will send that session
           cookie.

           For this to work, SG's CORS settings need to be configured at a minimum like this,
           where `$ORIGIN` is the root of the website that's running CBL-JS:
                "origin": [$ORIGIN],
                "login_origin": [$ORIGIN],
                "headers": ["Authorization"]
            You can add additional origins or headers, but the website's origin has to be specified
            explicitly and the "Authorization" header has to be allowed. */

        let url = urlAppending(this.config.url, "_session");
        if (url.protocol === "wss:") {
            url.protocol = "https:";
        } else {
            url.protocol = "http:";
            if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1")
                this.logger.warn `Sending credentials INSECURELY over a non-TLS connection!`;
        }
        this.logger.info `Authenticating to ${url.toString()} as user ${auth.username}`;

        try {
            this.#abortAuth = new AbortController();
            this.maybeNotifyStatus();   // status changes to Connecting

            const r = await fetch(url, {
                method:      'POST',
                headers:     {'Authorization': basicAuthHeader(auth.username, auth.password)},
                credentials: "include",
                mode:        "cors",
                signal:      this.#abortAuth.signal
            });
            if (r.status >= 300) {
                this.logger.error `Authentication failed: ${r.status} ${r.statusText}`;
                if (r.status === 401)
                    throw Error(`Authentication failed; username or password not valid.`);
                else
                    throw Error(`Authentication failed. [${r.status} ${r.statusText}]`);
            }
        } catch (x) {
            if (x instanceof Error && x.name === "AbortError") {
                this.logger.error `Authentication request was canceled`;
                throw Error(`Authentication request was canceled`);
            } else {
                this.logger.error `Authentication failed; fetch threw ${x}`;
                throw Error(`Authentication failed; this may be due to an invalid URL, a network problem, or the server's CORS settings. [${x}]`);
            }
        } finally {
            this.#abortAuth = undefined;
        }
        this.logger.info `Successfully authenticated`;
    }


    private async start() {
        // Send the "getCollections" message to receive collection checkpoints:
        assertDefined(this.#socket);
        const checkpointIDs = this.#collectionIDs.map(
            id => this.config.collections[id].checkpoint.clientID);
        const reply = await this.#socket.send("getCollections", {
            collections: this.#collectionIDs,
            // eslint-disable-next-line camelcase
            checkpoint_ids: checkpointIDs
        });

        // Create the Checkpointers, Pushers, Pullers:
        let index = 0;
        for (const remoteCheckpoint of reply.bodyJSON as JSONArray) {
            const id = this.#collectionIDs[index];
            if (remoteCheckpoint === null) {
                this.fatalError(Error(`Collection '${id}' does not exist on the server`));
                return;
            }

            const params: WorkerParams = {
                replicator:      this,
                socket:          this.#socket,
                collectionID:    id,
                collectionIndex: index,
            };

            // Checkpointer:
            const cfg = this.config.collections[id];
            const checkpointer = new Checkpointer(params,
                                                  cfg.checkpoint,
                                                  cfg.checkpoint.delegate,
                                                  remoteCheckpoint as JSONObject);
            this.#checkpointers.push(checkpointer);

            // Pusher and/or Puller:
            const endpointParams: EndpointParams = {...params, checkpointer: checkpointer};
            if (cfg.push) {
                const pusher = new Pusher(endpointParams, cfg.push, cfg.push.delegate);
                this.#pushers.set(index, pusher);
                this.#allEndpoints.push(pusher);
            }
            if (cfg.pull) {
                const puller = new Puller(endpointParams, cfg.pull, cfg.pull.delegate);
                this.#pullers.set(index, puller);
                this.#allEndpoints.push(puller);
            }
            ++index;
        }

        // Register request handlers on behalf of the workers, which will forward to them:
        if (this.#pushers.size > 0) {
            this.#socket.incoming.addEventListener("getAttachment", msg => {
                void this.#pushers.get(msg.numericProperty('collection'))!.onGetAttachment(msg);
            });
        }
        if (this.#pullers.size > 0) {
            this.#socket.incoming.addEventListener("changes", msg => {
                void this.#pullers.get(msg.numericProperty('collection'))!.onChanges(msg);
            });
            this.#socket.incoming.addEventListener("rev", msg => {
                this.#pullers.get(msg.numericProperty('collection'))!.onRev(msg);
            });
        }
    }


    /** Stops the replicator, if it's running. */
    stop() {
        if (this.running) {
            this.logger.info `Replicator.stop called!`;
            this.#abortAuth?.abort();
            this.finish();
        }
    }


    get status() : Status {
        if (this.#abortAuth !== undefined) {
            return {status: 'connecting'};
        }

        let s: Status = {status: 'busy'};
        if (this.#allEndpoints.length > 0) {
            s.status = 'idle';
            for (const endpt of this.#allEndpoints) {
                if (endpt instanceof Pusher)
                    s.pushedRevisions = (s.pushedRevisions ?? 0) + endpt.progress;
                else
                    s.pulledRevisions = (s.pulledRevisions ?? 0) + endpt.progress;
                if (!endpt.idle)
                    s.status = 'busy';
            }
        }

        switch (this.#socket?.readyState as (number | undefined)) {
            case WebSocket.CONNECTING:
                s.status = 'connecting';
                break;
            case WebSocket.CLOSED:
            case undefined:
                s.status = 'stopped';
                break;
        }
        return s;
    }


    onStatusChange? : (status: Status) => void;


    get running() : boolean {return this.#resolveFn !== undefined || this.#abortAuth !== undefined;}


    statusChanged_() {
        if (this.#allEndpoints.every( e => e.done ) && this.#checkpointers.every( c => c.idle ) )
            this.finish();

        this.maybeNotifyStatus();
    }


    maybeNotifyStatus() {
        if (this.onStatusChange && this.running) {
            const now = Date.now();
            if (now > this.#lastStatusTime + kStatusInterval) {
                this.#lastStatusTime = now;
                this.onStatusChange(this.status);
            } else if (!this.#statusTimer) {
                this.#statusTimer = setTimeout( () => {
                    this.#statusTimer = undefined;
                    this.maybeNotifyStatus();
                }, kStatusInterval);
            }
        }
    }


    notifyStatusAtEnd() {
        if (this.#statusTimer) {
            this.#lastStatusTime = 0;
            this.maybeNotifyStatus();
        }
    }


    // Completes a run by cleaning up state and resolving or rejecting `run`s Promise.
    protected finish(error?: Error) {
        this.logger.info `Finished`;
        for (const cp of this.#checkpointers)
            cp.stop();
        this.#expectingClose = true;
        this.#socket?.close();
        this.#socket = undefined;

        this.notifyStatusAtEnd();

        // Resolve/reject the `run` method's Promise:
        if (error) {
            if (this.#rejectFn) this.#rejectFn(error);
        } else {
            if (this.#resolveFn) this.#resolveFn();
        }
        this.#resolveFn = undefined;
        this.#rejectFn = undefined;
    }


    fatalError(error: Error) {
        this.logger.error `Sync fatal error: ${error}`;
        this.finish(error);
    }


    #collectionIDs  : CollectionID[];           // Indexes of this array are collection indexes
    #resolveFn?     : () => void;               // Resolves `run()` Promise
    #rejectFn?      : (e:Error) => void;        // Rejects `run()` Promise
    #abortAuth?     : AbortController;          // Allows auth fetch to be canceled
    #socket?        : blip.Socket;              // BLIP socket
    #expectingClose = false;                    // True once a BLIP close is OK
    #checkpointers  : Checkpointer[] = [];      // Checkpointers, by collection index
    #allEndpoints   : Endpoint[] = [];          // All the pushers & pullers (indexes arbitrary)
    #pushers        = new Map<number,Pusher>(); // Pushers, keyed by collection index
    #pullers        = new Map<number,Puller>(); // Pullers, keyed by collection index
    #lastStatusTime = 0;                        // Time I last notified status
    #statusTimer?   : unknown;                  // Timer for notifying status
}


function urlAppending(urlStr: string, name: string): URL {
    let url = new URL(urlStr);
    if (!url.pathname.endsWith('/'))
        url.pathname += '/';
    url.pathname += name;
    return url;
}

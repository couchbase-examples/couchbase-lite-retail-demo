import { Endpoint, EndpointConfig, EndpointParams } from './endpoint';
import { LocalSequence, PushRevision, ReplicationFilter } from './types';
import type * as blip from "@/blip/blip";
export interface PusherConfig extends EndpointConfig {
    filter?: ReplicationFilter;
    batchSize?: number;
}
export interface PusherDelegate {
    /** Fetches up to `limit` revisions starting after sequence `seq`, ordered by sequence */
    getChanges(since: LocalSequence | undefined, limit: number): Promise<ChangeSet>;
    getBlob(digest: string): Promise<Uint8Array | undefined>;
    /** Notification that a revision has been pushed, or failed to be pushed. */
    pushedRev?(rev: PushRevision, error?: Error): void;
}
export interface ChangeSet {
    changes: Array<PushRevision>;
    since?: LocalSequence;
    lastSequence?: LocalSequence;
}
export declare class Pusher extends Endpoint {
    #private;
    private readonly config;
    private readonly delegate;
    constructor(params: EndpointParams, config: PusherConfig, delegate: PusherDelegate);
    checkIdle(): boolean;
    private getMoreChanges;
    /** This is an async task that runs until the replication completes. */
    private sendMoreChanges;
    /** Sends a 'rev' message with a single document revision. */
    private sendRev;
    onGetAttachment(msg: blip.Message): Promise<void>;
    toString(): string;
}
/** Keeps track of which remote sequences are pending or completed, and what sequence to use as
 *  the checkpoint. */
export declare class LocalSeqTracker {
    #private;
    constructor(since: LocalSequence | undefined);
    addSequence(seq: LocalSequence): void;
    finishedSequence(seq: LocalSequence): void;
    get max(): LocalSequence;
    get checkpointedSequence(): LocalSequence;
}

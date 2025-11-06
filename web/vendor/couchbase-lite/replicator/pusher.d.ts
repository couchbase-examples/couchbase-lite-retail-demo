import { Endpoint, EndpointConfig, EndpointParams } from './endpoint';
import { LocalSequence, PushRevision, RevisionInfo } from './types';
import type * as blip from "@/blip/blip";
/** Configuration parameters for pushing changes to the remote collection.
 *  @property continuous    If true, stay connected indefinitely.
 *  @property filter        Callback that can skip revisions one at a time. */
export interface PusherConfig extends EndpointConfig {
    filter?: (rev: RevisionInfo) => boolean;
    batchSize?: number;
}
export interface PusherDelegate {
    /** Fetches revisions, ordered by sequence */
    getChanges(since: LocalSequence | undefined, limit: number): Promise<PushRevision[]>;
    getBlob(digest: string): Promise<Uint8Array | undefined>;
    /** Notification that a revision has been pushed, or failed to be pushed. */
    pushedRev?(rev: PushRevision, error?: Error): void;
}
export declare class Pusher extends Endpoint {
    #private;
    private readonly config;
    private readonly delegate;
    constructor(params: EndpointParams, config: PusherConfig, delegate: PusherDelegate);
    checkIdle(): boolean;
    private getMoreChanges;
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

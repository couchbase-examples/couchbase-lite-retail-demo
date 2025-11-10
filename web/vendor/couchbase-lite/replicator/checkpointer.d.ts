import { CollectionID } from './replicator';
import { Checkpoint, LocalSequence, RemoteSequence } from './types';
import { JSONObject } from '../util/json_types';
import { WorkerParams } from './endpoint';
/** Common configuration parameters for Pusher and Puller.  @internal */
export interface CheckpointerConfig {
    clientID: string;
    initialCheckpoint?: Checkpoint;
    reset?: boolean;
}
/** @internal */
export interface CheckpointerDelegate {
    saveCheckpoint: (collection: CollectionID, clientID: string, checkpoint: Checkpoint) => Promise<void>;
}
/** Manages a collection's replication checkpoint for both its pusher and puller.  @internal */
export declare class Checkpointer {
    #private;
    private readonly config;
    private readonly delegate;
    constructor(params: WorkerParams, config: CheckpointerConfig, delegate: CheckpointerDelegate, remoteCheckpoint: JSONObject);
    stop(): void;
    get idle(): boolean;
    get localSequence(): LocalSequence | undefined;
    get remoteSequence(): RemoteSequence | undefined;
    set localSequence(s: LocalSequence | undefined);
    set remoteSequence(s: RemoteSequence | undefined);
    /** If there are unsaved changes, begins saving them immediately. */
    saveASAP(): void;
    /** Mark that I have unsaved changes, and schedule a save after kSaveDelay. */
    private saveSoon;
    private stopTimer;
    saveNow(): Promise<void>;
    toString(): string;
    readonly collectionID: CollectionID;
    readonly collectionIndex: number;
    private readonly replicator;
}

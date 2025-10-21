import { Checkpointer } from './checkpointer';
import { CollectionID, Replicator } from './replicator';
import type * as blip from "@/blip/blip";
/** Common configuration parameters for Pusher and Puller.
 *  @interface
 *  @property continuous   If true, stay connected indefinitely [default false] */
export interface EndpointConfig {
    continuous?: boolean;
}
export interface WorkerParams {
    replicator: Replicator;
    socket: blip.Socket;
    collectionID: CollectionID;
    collectionIndex: number;
}
export interface EndpointParams extends WorkerParams {
    checkpointer: Checkpointer;
}
/** Abstract base class of Pusher and Puller. */
export declare abstract class Endpoint {
    #private;
    protected constructor(params: EndpointParams, config: EndpointConfig);
    readonly collectionID: CollectionID;
    readonly collectionIndex: number;
    protected readonly replicator: Replicator;
    protected readonly socket: blip.Socket;
    protected readonly checkpointer: Checkpointer;
    get isCaughtUp(): boolean;
    get idle(): boolean;
    get done(): boolean;
    get progress(): number;
    protected _progress: number;
    protected caughtUp: boolean;
    protected abstract checkIdle(): boolean;
    protected statusChanged(): void;
}

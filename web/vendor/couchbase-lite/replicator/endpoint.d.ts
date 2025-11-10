import { Checkpointer } from './checkpointer';
import { CollectionID, Replicator } from './replicator';
import { DocID } from './types';
import * as blip from "@/blip/blip";
import type * as logtape from "@logtape/logtape";
/** Common configuration parameters for Pusher and Puller.
 *  @interface
 *  @property continuous   If true, stay connected indefinitely [default false]
 *  @property documentIDs  If given, only these documents will be replicated. */
export interface EndpointConfig {
    continuous?: boolean;
    documentIDs?: readonly DocID[];
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
    protected constructor(params: EndpointParams, config: EndpointConfig, logName: string);
    readonly collectionID: CollectionID;
    readonly collectionIndex: number;
    protected readonly replicator: Replicator;
    protected readonly socket: blip.Socket;
    protected readonly checkpointer: Checkpointer;
    protected readonly logger: logtape.Logger;
    get isCaughtUp(): boolean;
    get idle(): boolean;
    get done(): boolean;
    get progress(): number;
    protected get socketOpen(): boolean;
    protected _progress: number;
    protected caughtUp: boolean;
    protected abstract checkIdle(): boolean;
    protected statusChanged(): void;
}

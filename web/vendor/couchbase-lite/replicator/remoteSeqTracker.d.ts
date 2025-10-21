import { RemoteSequence } from './types';
/** Keeps track of which remote sequences are pending or completed, and what sequence to use as
 *  the checkpoint. */
export declare class RemoteSeqTracker {
    #private;
    constructor(since: RemoteSequence | undefined);
    addSequence(seq: RemoteSequence): void;
    skipSequence(seq: RemoteSequence): void;
    finishedSequence(seq: RemoteSequence): void;
    getCheckpoint(): RemoteSequence | undefined;
}

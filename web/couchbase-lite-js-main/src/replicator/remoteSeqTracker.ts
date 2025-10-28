//
// replicator/remoteSeqTracker.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { RemoteSequence } from "./types";


/** Keeps track of which remote sequences are pending or completed, and what sequence to use as
 *  the checkpoint. */
export class RemoteSeqTracker {
    /// Constructor takes the latest checkpointed sequence.
    constructor(since: RemoteSequence | undefined) {
        this.#latest  = since;
    }

    /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
    addSequence(seq: RemoteSequence) {
        if (this.#requested.has(seq))
            throw Error(`RemoteSeqTracker.addSequence: sequence ${JSON.stringify(seq)} already pending`);
        this.#requested.set(seq, this.#latest);
        this.#latest = seq;
    }

    /// Records that a sequence is being skipped;
    /// behavior is equivalent to addSequence followed by finishedSequence.
    skipSequence(seq: RemoteSequence) {
        this.#latest = seq;
    }

    /// Records that a pending sequence is now complete.
    finishedSequence(seq: RemoteSequence) {
        if (!this.#requested.delete(seq))
            throw Error(`RemoteSeqTracker.finishedSequence: ${JSON.stringify(seq)} was not pending`);
    }

    getCheckpoint() : RemoteSequence | undefined {
        const first = this.#requested.values().next();
        return first.done ? this.#latest : first.value;
    }


    #requested  = new Map<RemoteSequence, RemoteSequence | undefined>();
    #latest     : RemoteSequence | undefined;
}

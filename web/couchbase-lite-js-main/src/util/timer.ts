//
// util/timer.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { assert } from "./assert";

/** A utility class that lets async code delay. */
export class Timer {

    /** Convenience function that returns a Promise that resolves after `delay` milliseconds. */
    static async sleep(delay: number) {
        return new Promise<void>( (resolve, _reject) => {
            setTimeout( () => resolve(), delay );
        });
    }


    /** Constructs a Timer.
     *  You may optionally pass a millisecond delay or absolute Date to start it. */
    constructor(t?: number | Date) {
        if (t !== undefined)
            this.start(t);
    }

    /** True if the Timer is running. */
    get running(): boolean {return this.#promise !== undefined;}

    /** Starts the Timer. It must not already be running. */
    start(t: number | Date) {
        assert(!this.running, "Timer is already active");
        const delay = (t instanceof Date) ? (t.getTime() - Date.now()) : t;
        this.#promise = new Promise<void>( (resolve, reject) => {
            this.#reject = reject;
            this.#timeout = setTimeout( () => this.wake(resolve), delay );
        });
    }

    /** Returns a Promise that resolves when the timer fires,
     *  or rejects with a [[TimerCanceledError]] if [[cancel]] is called.  */
    async wait(): Promise<void> {
        assert(this.#promise, "Timer is not active");
        return this.#promise;
    }

    /** Stops the Timer. Any promises will be rejected with a TimerCanceledError.
     *  Does nothing if the Timer is not running. */
    cancel(): void {
        if (this.#timeout) {
            clearTimeout(this.#timeout);
            const reject = this.#reject!;
            this.clear();
            reject(new TimerCanceledError("Canceled Timer"));
        }
    }

    private wake(resolve: ()=>void) {
        this.clear();
        resolve();
    }

    private clear() {
        this.#timeout = undefined;
        this.#promise = undefined;
        this.#reject  = undefined;
    }

    #timeout?   : number | NodeJS.Timeout;
    #promise?   : Promise<void>;
    #reject?    : (reason?: Error) => void;
}

export class TimerCanceledError extends Error { }

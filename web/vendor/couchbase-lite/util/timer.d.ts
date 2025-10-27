/** A utility class that lets async code delay. */
export declare class Timer {
    #private;
    /** Convenience function that returns a Promise that resolves after `delay` milliseconds. */
    static sleep(delay: number): Promise<void>;
    /** Constructs a Timer.
     *  You may optionally pass a millisecond delay or absolute Date to start it. */
    constructor(t?: number | Date);
    /** True if the Timer is running. */
    get running(): boolean;
    /** Starts the Timer. It must not already be running. */
    start(t: number | Date): void;
    /** Returns a Promise that resolves when the timer fires,
     *  or rejects with a [[TimerCanceledError]] if [[cancel]] is called.  */
    wait(): Promise<void>;
    /** Stops the Timer. Any promises will be rejected with a TimerCanceledError.
     *  Does nothing if the Timer is not running. */
    cancel(): void;
    private wake;
    private clear;
}
export declare class TimerCanceledError extends Error {
}

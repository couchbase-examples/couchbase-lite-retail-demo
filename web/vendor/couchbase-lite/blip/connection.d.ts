/** Transport-agnostic BLIP protocol implementation.
 *  @module */
import * as msg from "./message";
import * as logtape from "@logtape/logtape";
export declare const BLIPLogger: logtape.Logger;
export declare const GlobalParams: {
    /** The maximum number of bytes of a message to send in a single frame (WebSocket message.) */
    MaxFrameSize: number;
    /** Maximum size that the WebSocket's `bufferedAmount` can grow to;
     * if it exceeds this, BLIP stops sending frames until it goes down. */
    MaxBufferedAmount: number;
    /** How long (in milliseconds) BLIP waits before trying to send again when the WebSocket's
     *  `bufferedAmount` is too large. */
    BufferDelayMS: number;
    /** Set this to `true` to log to the logger when frames are sent/received. */
    LogFrames: boolean;
    /** Set this to `true` to log to the logger when messages are sent/received. */
    LogMessages: boolean;
};
/** How to handle a response {@link Message} that's an error:
 *  either throw it as a {@link MessageError}, or return it. */
export type ErrorMode = "throw" | "nothrow";
/** Transport-agnostic BLIP protocol manager.
 *  You probably want {@link Socket} instead, unless you're implementing a new non-WebSocket
 *  transport. */
export declare class Connection {
    #private;
    logger: logtape.Logger;
    /** Adds an outgoing {@link message} to the queue to be sent.
        Returns a promise of a reply. The message must not have the {@link NoReply} option. */
    send(message: msg.Message, mode: ErrorMode): Promise<msg.Message>;
    /** Adds an outgoing {@link message} to the queue to be sent.
        The message must have the {@link NoReply} option. */
    sendNoReply(message: msg.Message): void;
    private _send;
    /** Returns the next frame to send, or `null` if there's nothing pending. */
    nextFrameToSend(): Uint8Array | null;
    /** Call this when a frame is received.
    When an incoming {@link Message} is completed it will be returned, else `null`. */
    handleIncomingFrame(frame: Uint8Array): msg.Message | null;
    private handleMessageFrame;
    private handleACKFrame;
    /** True if there are no currently outgoing requests or incoming replies. */
    get safeToClose(): boolean;
    /** Call this when the connection closes.
     *  @param error  An error for rejecting Promises for request Messages that haven't been
     *                transmitted or are awaiting replies. */
    closed(error: Error): void;
}

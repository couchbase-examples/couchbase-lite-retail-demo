import { ErrorMode } from './connection';
import * as msg from "./message";
export { type ErrorMode, GlobalParams } from './connection';
export { Options, type Properties, Message, BLIPError, MessageError, type MessageHandler } from './message';
/** The current state of a Socket's connection. Same as the all-caps constants in `WebSocket`. */
export declare enum ReadyState {
    Connecting = 0,
    Open = 1,
    Closing = 2,
    Closed = 3
}
type Events = {
    open: unknown;
    close: Error | undefined;
    message: msg.Message;
};
type EventType = keyof Events;
type UntypedHandler = (arg: any) => void;
/** Abstract superclass of Socket. Useful for creating mocks. */
export declare abstract class SocketAPI {
    logger: import('@logtape/logtape').Logger;
    /** The WebSocket's readyState */
    abstract get readyState(): 0 | 1 | 2 | 3;
    /** Event target for incoming request messages, keyed by profile. */
    get incoming(): msg.MessageEventsImpl;
    /** Closes the socket. */
    abstract close(code: number, reason: string): void;
    /** Adds a listener callback for the 'open', 'close' or 'message' event. */
    addEventListener<E extends EventType>(event: E, handler: (arg: Events[E]) => void): void;
    /** Removes a listener callback. */
    removeEventListener<E extends EventType>(event: E, listener: (arg: Events[E]) => void): void;
    /** Creates a {@link Message} and queues it to be sent.
     * @param props  The properties: either an object, or a string naming the `Profile` property.
     * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
     * @returns  A promise of a reply message.
     */
    send(props: msg.Properties | string, body?: msg.Body, mode?: ErrorMode): Promise<msg.Message>;
    /** Creates a {@link Message} and queues it to be sent with the {@link NoReply} option.
     * @param props  The properties: either an object, or a string naming the `Profile` property.
     * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
     */
    sendNoReply(props: msg.Properties | string, body?: msg.Body): void;
    /** Replies to a request message. */
    sendReplyTo(message: msg.Message, props: msg.Properties, body?: msg.Body): void;
    /** Replies to a request message with an error. */
    sendErrorReplyTo(message: msg.Message, str: string, code: number, domain?: string): void;
    sendReply(reply: msg.Message): void;
    /** Sends an outgoing request message and returns a Promise of its reply. */
    abstract sendMessage(message: msg.Message, mode: ErrorMode): Promise<msg.Message>;
    /** Sends an outgoing request message that should not be replied to. */
    abstract sendMessageNoReply(message: msg.Message): void;
    protected dispatchEvent<E extends EventType>(event: E, arg: Events[E]): boolean;
    protected events: Map<keyof Events, (UntypedHandler | undefined)[]>;
    protected msgEvents: msg.MessageEventsImpl;
    private dispatching;
}
/** A WebSocket-based BLIP connection. */
export declare class Socket extends SocketAPI {
    #private;
    /** Creates and (asynchronously) opens a BLIP connection via a WebSocket.
     * @param url  The `ws:` or `wss:` URL to connect to.
     * @param protocol  The subprotocol of BLIP, to be appended to the WebSocket protocol requested.
     */
    constructor(url: string, protocol?: string);
    /** Returns the WebSocket's ready-state. */
    get readyState(): ReadyState;
    /** Closes the connection.
     *  @param code  The WebSocket status code. 1000, the default value, means a normal close;
     *               in this case the Socket will wait until all outgoing messages are sent and
     *               incoming messages are received, then close. Other values are considered
     *               abnormal and cause the WebSocket to close _immediately_; any pending message
     *               Promises will immediately fail with an error.
     *  @param reason  An optional message to go with the status code.
     */
    close(code?: number, reason?: string): void;
    /** Queues a {@link Message} object to be sent.
     * @param message  A Message object.
     * @returns  A promise of a reply message, or `null` if the {@link NoReply} option is set.
     */
    sendMessage(message: msg.Message, mode?: ErrorMode): Promise<msg.Message>;
    /** Queues a {@link Message} object to be sent.
     * @param message  A Message object.
     * @returns  A promise of a reply message, or `null` if the {@link NoReply} option is set.
     */
    sendMessageNoReply(message: msg.Message): void;
    private handleWSOpen;
    private closed;
    private handleWSClose;
    private handleWSError;
    private handleWSMessage;
    private dispatchRequest;
    private sendFrames;
    private preSend;
    timeReceiving: number;
    timeWaiting: number;
    timeSending: number;
}
/** A WebSocket connection error. */
export declare class WebSocketError extends Error {
    readonly code: number;
    readonly reason?: string | undefined;
    constructor(code: number, reason?: string | undefined);
}

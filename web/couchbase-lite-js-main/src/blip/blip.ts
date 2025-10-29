//
// blip/blip.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

/** WebSocket-based BLIP protocol implementation.
 *  @module */

import { basicAuthHeader } from "@/util/base64";
import {BLIPLogger, Connection, type ErrorMode, GlobalParams} from "./connection";
import * as msg from "./message";
import {assert} from "@/util/assert";
import IsoWebSocket from "isomorphic-ws";

// Re-exports:
export {type ErrorMode, GlobalParams} from "./connection";
export {Options, type Properties, Message, BLIPError, MessageError, type MessageHandler}
    from "./message";


//////// CONSTANTS AND GLOBAL PARAMETERS:


/** The WebSocket protocol name for BLIP.
 *  Applications often have a sub-protocol string. This is appended, separated by a `+` sign. */
const kBLIPProtocol = "BLIP_3";


/** The current state of a Socket's connection. Same as the all-caps constants in `WebSocket`. */
export enum ReadyState {
    Connecting = 0,
    Open,
    Closing,
    Closed
}


type Events = {
    open:    unknown
    close:   Error | undefined
    message: msg.Message
}
type EventType = keyof Events;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UntypedHandler = (arg: any) => void;


/** Abstract superclass of Socket. Useful for creating mocks. */
export abstract class SocketAPI {

    public logger = BLIPLogger;

    /** The WebSocket's readyState */
    public abstract get readyState() : 0 | 1 | 2 | 3;

    /** Event target for incoming request messages, keyed by profile. */
    get incoming() {return this.msgEvents;}

    /** Closes the socket. */
    public abstract close(code: number, reason: string) : void;

    /** Adds a listener callback for the 'open', 'close' or 'message' event. */
    public addEventListener<E extends EventType>(event: E, handler: (arg: Events[E]) => void) {
        let handlers = this.events.get(event);
        if (handlers) {
            handlers.push(handler);
        } else {
            handlers = Array<UntypedHandler>(handler);
            this.events.set(event, handlers);
        }
    }

    /** Removes a listener callback. */
    public removeEventListener<E extends EventType>(event: E, listener: (arg: Events[E]) => void) {
        const handlers = this.events.get(event);
        if (handlers) {
            const index = handlers.indexOf(listener);
            if (index >= 0) {
                if (this.dispatching) {
                    // If an event is being dispatched we can't disturb the indexes of handlers.
                    handlers[index] = undefined;
                } else {
                    handlers.splice(index, 1);
                }
            }
        }
    }

    /** Creates a {@link Message} and queues it to be sent.
     * @param props  The properties: either an object, or a string naming the `Profile` property.
     * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
     * @returns  A promise of a reply message.
     */
    public async send(props: msg.Properties | string,
                      body: msg.Body = "",
                      mode: ErrorMode = "throw") : Promise<msg.Message>
    {
        return this.sendMessage(new msg.Message(props, body), mode);
    }

    /** Creates a {@link Message} and queues it to be sent with the {@link NoReply} option.
     * @param props  The properties: either an object, or a string naming the `Profile` property.
     * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
     */
    public sendNoReply(props: msg.Properties | string, body: msg.Body = "") : void
    {
        this.sendMessageNoReply(new msg.Message(props, body, msg.Options.NoReply));
    }

    /** Replies to a request message. */
    public sendReplyTo(message: msg.Message, props: msg.Properties, body: msg.Body = "") : void {
        this.sendReply(message.makeReply(props, body));
    }

    /** Replies to a request message with an error. */
    public sendErrorReplyTo(message: msg.Message, str: string, code: number, domain = "BLIP") {
        this.sendReply(message.makeErrorReply(str, code, domain));
    }

    public sendReply(reply: msg.Message) {
        assert(reply.isReply);
        this.sendMessageNoReply(reply);
    }

    /** Sends an outgoing request message and returns a Promise of its reply. */
    abstract sendMessage(message: msg.Message, mode: ErrorMode) : Promise<msg.Message>;

    /** Sends an outgoing request message that should not be replied to. */
    abstract sendMessageNoReply(message: msg.Message) : void;


    protected dispatchEvent<E extends EventType>(event: E, arg: Events[E]) : boolean {
        const handlers = this.events.get(event);
        if (handlers && handlers.length > 0) {
            this.dispatching = true;
            for (const handler of handlers) {
                try {
                    if (handler)
                        handler(arg);
                } catch (x) {
                    this.logger.error(`blip.dispatchEvent({event}) caught {exception}`,
                                      {event: event, exception: x});
                }
            }
            this.dispatching = false;
            return true;
        }
        return false;
    }


    protected events     = new Map<EventType,Array<UntypedHandler | undefined>>();
    protected msgEvents  = new msg.MessageEventsImpl();
    private dispatching = false;
}


/** Options that can be passed to the constructor for use in *non-web-browser* environments
 *  such as node/Bun/Deno. In a browser, these will be ignored. */
export interface NonBrowserOptions {
    credentials?: {username: string, password: string},
}


interface NodeHttpOptions {
    headers?: Record<string,string>,
}


/** A WebSocket-based BLIP connection. */
export class Socket extends SocketAPI {

    /** Creates and (asynchronously) opens a BLIP connection via a WebSocket.
     * @param url  The `ws:` or `wss:` URL to connect to.
     * @param protocol  The subprotocol of BLIP, to be appended to the WebSocket protocol requested.
     * @param options  Additional for use in node/Bun/Deno. Ignored in a browser. */
    constructor(url: URL | string, protocol = "", options?: NonBrowserOptions) {
        super();
        if (protocol !== "")
            protocol = kBLIPProtocol + "+" + protocol;

        this.logger = this.logger.with({url});
        this.#connection!.logger = this.logger;

        let wsOptions : NodeHttpOptions | undefined;
        if (options?.credentials !== undefined) {
            const auth = basicAuthHeader(options.credentials.username, options.credentials.password);
            wsOptions = {headers: {Authorization: auth}};
        }
        this.#ws = new IsoWebSocket(url, protocol, wsOptions);

        this.#ws.binaryType = "arraybuffer";
        this.#ws.onopen     = this.handleWSOpen.bind(this);
        this.#ws.onmessage  = this.handleWSMessage.bind(this);
        this.#ws.onclose    = this.handleWSClose.bind(this);
        this.#ws.onerror    = this.handleWSError.bind(this);
    }


    /** Returns the WebSocket's ready-state. */
    public get readyState() : ReadyState { return this.#ws.readyState; }


    /** Closes the connection.
     *  @param code  The WebSocket status code. 1000, the default value, means a normal close;
     *               in this case the Socket will wait until all outgoing messages are sent and
     *               incoming messages are received, then close. Other values are considered
     *               abnormal and cause the WebSocket to close _immediately_; any pending message
     *               Promises will immediately fail with an error.
     *  @param reason  An optional message to go with the status code.
     */
    public close(code = 1000, reason = "") {
        assert(code >= 1000, "Close code must be >= 1000");
        this.#closeCode = code;
        if (code !== 1000 || this.#connection?.safeToClose) {
            this.#ws.close(code, reason);
        }
    }


    /** Queues a {@link Message} object to be sent.
     * @param message  A Message object.
     * @returns  A promise of a reply message, or `null` if the {@link NoReply} option is set.
     */
    public async sendMessage(message: msg.Message, mode: ErrorMode = "throw") : Promise<msg.Message> {
        const result = this.preSend(message).send(message, mode);
        if (!this.#sendPaused)
            this.sendFrames();
        return result;
    }


    /** Queues a {@link Message} object to be sent.
     * @param message  A Message object.
     * @returns  A promise of a reply message, or `null` if the {@link NoReply} option is set.
     */
    public sendMessageNoReply(message: msg.Message) : void {
        this.preSend(message).sendNoReply(message);
        if (!this.#sendPaused)
            this.sendFrames();
    }


    // Internals:

    private handleWSOpen() {
        this.#open = true;
        this.dispatchEvent("open", undefined);
        this.sendFrames();
    }

    private closed(err: Error, ok: boolean) {
        const conn = this.#connection;
        this.#open = false;
        this.#connection = undefined;
        conn?.closed(err);
        this.dispatchEvent("close", ok ? undefined : err);
    }

    private handleWSClose(event: IsoWebSocket.CloseEvent) {
        if (this.#connection) {
            const err = new WebSocketError(event.code, event.reason);
            const ok = (event.code === 1000 && event.wasClean);
            this.closed(err, ok);
        }
    }

    private handleWSError(event: IsoWebSocket.ErrorEvent) {
        // In a browser there is, unfortunately, no useful information in the ErrorEvent.
        let message = this.#open ? "Socket disconnected" : "WebSocket connection failed";
        if (event.message)
            message += ": " + event.message;
        else
            message += " (no information available)";
        const err = Error(message);
        this.closed(err, false);
    }

    private handleWSMessage(event: IsoWebSocket.MessageEvent) {
        const now = globalThis.performance.now();
        if (this.#lastRcvTime > 0) {
            this.timeWaiting += now - this.#lastRcvTime;
        }

        let frame: Uint8Array;
        if (event.data instanceof Uint8Array) {
            frame = event.data;
        } else if (event.data instanceof ArrayBuffer) {
            frame = new Uint8Array(event.data);
        } else {
            this.logger.warn("Ignoring WebSocket message of wrong type (not Uint8Array or ArrayBuffer)");
            return;
        }
        const message = this.#connection?.handleIncomingFrame(frame);
        if (message) {
            if (GlobalParams.LogMessages)
                this.logger.debug(`>>> Received message ${message}`);
            this.dispatchRequest(message);
        } else {
            // In case we need to send an ACK frame:
            if (!this.#sendPaused)
                this.sendFrames();
        }
        if (this.#closeCode !== 0 && this.#connection?.safeToClose) {
            this.#ws.close(this.#closeCode);
        }

        const now2 = globalThis.performance.now();
        this.timeReceiving += now2 - now;
        this.#lastRcvTime = now2;
    }

    private dispatchRequest(m: msg.Message) {
        if (!this.msgEvents.dispatchMessage(m) && !this.dispatchEvent("message", m)) {
            if (m.wantsReply)
                this.sendErrorReplyTo(m, "no handler", 404);
        }
    }

    // Sends frames until all messages are sent or the WebSocket closes.
    // If the amount of buffered data exceeds the maximum, it will pause and retry.
    private sendFrames() : void {
        const now = globalThis.performance.now();
        this.#sendPaused = false;
        while (this.#ws.readyState === 1) {
            if (this.#ws.bufferedAmount > GlobalParams.MaxBufferedAmount) {
                this.logger.debug("**** PAUSING ****");
                this.#sendPaused = true;
                setTimeout(() => { this.logger.debug("**** RESUMING ****");  this.sendFrames();},
                           GlobalParams.BufferDelayMS);
                return;
            }
            const frame = this.#connection?.nextFrameToSend();
            if (!frame)
                break;
            this.#ws.send(frame);
        }
        if (this.#closeCode !== 0 && this.#connection?.safeToClose) {
            this.#ws.close(this.#closeCode);
        }
        const now2 = globalThis.performance.now();
        this.timeSending += now2 - now;
    }

    private preSend(_message: msg.Message) : Connection {
        assert(this.#closeCode === 0, "Can't send while the connection is closing");
        if (!this.#connection) throw Error("Connection is closed");
        return this.#connection;
    }

    #ws         : IsoWebSocket.WebSocket;
    #connection : Connection | undefined = new Connection();
    #open       = false;
    #sendPaused = false;
    #closeCode  = 0;

    #lastRcvTime = 0;

    timeReceiving = 0;
    timeWaiting = 0;
    timeSending = 0;
}


/** A WebSocket connection error. */
export class WebSocketError extends Error {
    constructor(public readonly code: number, public readonly reason?: string) {
        super(reason ?? WSErrorMessages[code] ?? "WebSocket error");
    }
}


const WSErrorMessages: Record<number,string> = {
    // See <https://datatracker.ietf.org/doc/html/rfc6455#section-7.4.1>
    1000: "Normal closure",
    1001: "Server going away",
    1002: "Protocol error",
    1003: "Unacceptable data type",
    1005: "No status code given",
    1006: "Connection closed unexpectedly by server",
    1007: "Invalid data in a message",
    1008: "Policy violation",
    1009: "Message too large",
    1010: "Missing extension on server",
    1011: "Unexpected condition",
    1015: "TLS handshake failed"
};

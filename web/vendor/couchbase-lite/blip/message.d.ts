import { JSONCollection } from '../util/json_types';
/** Delivery options for a message. */
export declare enum Options {
    None = 0,
    /** This message will be compressed during delivery (using the "deflate" algorithm.)
     *  This reduces network bandwidth at the expense of some extra CPU time. */
    Compressed = 8,
    /** This message is given priority when multiple messages are being sent at the same time. */
    Urgent = 16,
    /** This message does not need a reply and cannot be replied to. */
    NoReply = 32,
    /** @internal */
    All = 56
}
/** @internal Frame flags that are not public. */
export declare enum PrivateFlags {
    TypeMask = 7,
    MoreComing = 64
}
/** @internal The types of messages (lower 3 bits of flags). */
export declare enum Type {
    MSG = 0,
    RPY = 1,
    ERR = 2,
    ACKMSG = 4,
    ACKRPY = 5
}
/** @internal All the frame/message flags. */
export type Flags = Options | PrivateFlags | Type;
/** A message number. Messages in each direction are numbered sequentially starting from 1. */
export type MsgNo = number & {
    __brand: "MsgNo";
};
/** Names of message types, indexed by Type. */
export declare const TypeNames: string[];
/** A Message's properties: a set of key-value pairs, similar to HTTP headers. */
export type Properties = Record<string, string | number>;
/** A Message's body: a string, a byte-array, or a JSON-compatible object or array. */
export type Body = string | Uint8Array | JSONCollection;
/** A BLIP message, either a request or a response. It consists of
 *  - **properties**, a set of key-value pairs.
 *  - a **body**, arbitrary data that can be text or binary.
 *  - **options**, some flags that affect how the message is processed.
 */
export declare class Message {
    /** Constructs an outgoing request message.
        @param properties  An object containing key/value strings, or a string for the `Profile`
                           property.
        @param body  Either a string, a `Uint8Array`, or a JSON-compatible object.
        @param options  Some combination of `Options` flags (`Urgent`, `NoReply`, `Compressed`.) */
    constructor(properties: Properties | string, body?: Body, options?: Options);
    /** Constructs a reply to this Message.
     *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
    makeReply(properties?: Properties, body?: Body, options?: Options): Message;
    /** Constructs an error reply to this Message.
     *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
    makeErrorReply(message: string, code: number, domain?: string): Message;
    /** Constructs an error reply to this Message, from a JS Error object.
     *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
    makeReplyWithError(error: Error): void;
    /** The key/value properties, most importantly `Profile` which is the request type.
        These may be modified until you send the message. */
    properties: Properties;
    /** The value of the `Profile` property, or "" if none. */
    get profile(): string;
    /** Returns a property's value, substituting `defaultValue` if it doesn't exist. */
    property(name: string, defaultValue?: string): string;
    /** Returns the numeric value of a property, or `defaultValue` if it doesn't exist
        or isn't numeric. */
    numericProperty(name: string, defaultValue?: number): number;
    /** True if this message is a request that needs a reply. */
    get wantsReply(): boolean;
    /** True if this message is a reply. */
    get isReply(): boolean;
    /** True if this message is an error reply. */
    get isError(): boolean;
    /** The error from a reply. */
    get error(): MessageError | undefined;
    /** The message body as a string. */
    get bodyString(): string;
    set bodyString(value: string);
    /** The message body as parsed JSON, or `undefined` if it isn't valid JSON. */
    get bodyJSON(): JSONCollection;
    set bodyJSON(value: JSONCollection);
    /** The message body as raw bytes, a `Uint8Array`. */
    get bodyData(): Uint8Array;
    set bodyData(value: Uint8Array);
    /** The message body as pretty-printed JSON, or just as a string if it's not JSON. */
    get prettyString(): string;
    toString(withBody?: boolean): string;
    /** @internal */
    get type(): Type;
    /** @internal */
    get typeName(): string;
    /** @internal */
    get hasNumber(): boolean;
    /** @internal */
    get number(): MsgNo;
    /** @internal */
    get flags(): Flags;
    /** @internal  Encodes an outgoing message to binary form (which still needs to be framed) */
    encodeBinary(): Uint8Array;
    /** @internal  Returns a textual description of a frame's flags, for logging. */
    static describeFrame(number: number | null, flags: Flags): string;
    protected _flags: Flags;
    protected _number: MsgNo;
    protected _bodyData?: Uint8Array;
    protected _bodyString?: string;
    protected _bodyJSON?: JSONCollection;
}
/** @internal A {@link Message} originating from the peer (either a request or a reply.)
 *  Used only internally by BLIP, or by unit tests.
 */
export declare class IncomingMessage extends Message {
    constructor(num: MsgNo, properties: Properties, body: Body, flags: Flags);
    static makeReply(num: MsgNo, properties?: Properties, body?: Body, flags?: Flags): IncomingMessage;
    static makeError(num: MsgNo, message: string, code: number, domain?: string): IncomingMessage;
    static decodedFromBinary(data: Uint8Array, flags: Flags, number: MsgNo): IncomingMessage;
}
/** A JavaScript Error with an associated BLIP error domain and code. */
export declare class BLIPError extends Error {
    constructor(message: string, code: number, domain?: string);
    /** The error domain, a namespace for the code. */
    readonly blipErrorDomain: string;
    /** The error code. */
    readonly blipErrorCode: number;
    matches(code: number, domain?: string): boolean;
    toString(): string;
}
/** The `Error` subclass returned by a failed BLIP reply promise
 *  when the reply is a BLIP error from the peer. */
export declare class MessageError extends BLIPError {
    constructor(msg: Message);
    /** The incoming BLIP error reply. */
    readonly blipMessage: Message;
}
export type MessageHandler = (message: Message) => void;
/** An event target that dispatches incoming request Messages,
  *  keyed by the message's profile string.
  * This interface aligns with the standard DOM EventTarget API. */
export interface MessageEvents {
    addEventListener(profile: string, handler: MessageHandler): void;
    removeEventListener(profile: string, handler: MessageHandler): void;
}
export declare class MessageEventsImpl implements MessageEvents {
    #private;
    addEventListener(profile: string, handler: MessageHandler): void;
    removeEventListener(profile: string, handler: MessageHandler): void;
    dispatchMessage(msg: Message): boolean;
}

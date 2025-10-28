//
// blip/message.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//


/** BLIP message class, and protocol-related constants.
 *  @module */


import type { JSONCollection } from "@/util/json_types";
import { encodeVarUint, readVarUint, totalLength, concatenate} from "./util";
import { assert } from "@/util/assert";


/** Delivery options for a message. */
export enum Options {
    None = 0x00,
    /** This message will be compressed during delivery (using the "deflate" algorithm.)
     *  This reduces network bandwidth at the expense of some extra CPU time. */
    Compressed = 0x08,
    /** This message is given priority when multiple messages are being sent at the same time. */
    Urgent     = 0x10,
    /** This message does not need a reply and cannot be replied to. */
    NoReply    = 0x20,
    /** @internal */
    All        = Compressed | Urgent | NoReply
}

/** @internal Frame flags that are not public. */
export enum PrivateFlags {
    TypeMask   = 0x07,
    MoreComing = 0x40,
}

/** @internal The types of messages (lower 3 bits of flags). */
export enum Type {
    MSG        = 0x00,
    RPY        = 0x01,
    ERR        = 0x02,
    ACKMSG     = 0x04,
    ACKRPY     = 0x05
}

/** @internal All the frame/message flags. */
export type Flags = Options | PrivateFlags | Type;

/** A message number. Messages in each direction are numbered sequentially starting from 1. */
export type MsgNo = number & {__brand: "MsgNo"};

/** Names of message types, indexed by Type. */
export const TypeNames = ["MSG", "RPY", "ERR", "?3?", "ACKMSG", "ACKRPY", "?6?", "?7?"];


/** A Message's properties: a set of key-value pairs, similar to HTTP headers. */
export type Properties = Record<string, string | number>;

/** A Message's body: a string, a byte-array, or a JSON-compatible object or array. */
export type Body = string | Uint8Array | JSONCollection;

const kZeroByte = new Uint8Array(1);

const sTextEncoder = new TextEncoder();
const sTextDecoder = new TextDecoder();


/** A BLIP message, either a request or a response. It consists of
 *  - **properties**, a set of key-value pairs.
 *  - a **body**, arbitrary data that can be text or binary.
 *  - **options**, some flags that affect how the message is processed.
 */
export class Message {

    /** Constructs an outgoing request message.
        @param properties  An object containing key/value strings, or a string for the `Profile`
                           property.
        @param body  Either a string, a `Uint8Array`, or a JSON-compatible object.
        @param options  Some combination of `Options` flags (`Urgent`, `NoReply`, `Compressed`.) */
    constructor(properties: Properties | string,
                body: Body = "",
                options: Options = Options.None)
    {
        this._flags = options & Options.All;

        if (typeof(properties) === "string")
            this.properties = {"Profile": properties};
        else
            this.properties = properties;

        if (typeof(body) === "string")
            this._bodyString = body;
        else if (body instanceof Uint8Array)
            this._bodyData = body;
        else if (body !== undefined && body !== null)
            this.bodyJSON = body; // converts to JSON
        else
            this._bodyString = "";
    }

    /** Constructs a reply to this Message.
     *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
    makeReply(properties: Properties = {},
              body: Body = "",
              options: Options = Options.None)
        : Message {
        assert(this.type === Type.MSG, "cannot reply to a reply");
        assert(this.wantsReply, "message was sent NoReply");
        assert(this._number !== undefined, "message has not been sent");
        const reply = new Message(properties, body);
        reply._flags = Type.RPY | (options & (Options.Urgent | Options.Compressed));
        reply._number = this._number;
        return reply;
    }

    /** Constructs an error reply to this Message.
     *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
    makeErrorReply(message: string, code: number, domain = "BLIP") {
        const reply = this.makeReply({"Error-Code": code.toString(), "Error-Domain": domain},
                                     message);
        reply._flags = Type.ERR;
        return reply;
    }

    /** Constructs an error reply to this Message, from a JS Error object.
     *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
    makeReplyWithError(error: Error) {
        let code = 502;
        let domain = "BLIP";
        if (error instanceof BLIPError) {
            code = error.blipErrorCode;
            domain = error.blipErrorDomain;
        }
        this.makeErrorReply(error.message, code, domain);
    }

    /** The key/value properties, most importantly `Profile` which is the request type.
        These may be modified until you send the message. */
    properties: Properties;

    /** The value of the `Profile` property, or "" if none. */
    get profile() : string {
        return this.property("Profile");
    }

    /** Returns a property's value, substituting `defaultValue` if it doesn't exist. */
    property(name: string, defaultValue = ""): string {
        return (this.properties[name] || defaultValue).toString();
    }

    /** Returns the numeric value of a property, or `defaultValue` if it doesn't exist
        or isn't numeric. */
    numericProperty(name: string, defaultValue = 0) : number {
        const val = this.properties[name];
        if (val === undefined)
            return defaultValue;
        const n = Number(val);
        return Number.isNaN(n) ? defaultValue : n;
    }

    /** True if this message is a request that needs a reply. */
    get wantsReply() : boolean  {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        return (this.flags & (PrivateFlags.TypeMask | Options.NoReply)) === Type.MSG;
    }

    /** True if this message is a reply. */
    get isReply() : boolean     {return this.type !== Type.MSG;}

    /** True if this message is an error reply. */
    get isError() : boolean     {return this.type === Type.ERR;}

    /** The error from a reply. */
    get error() : MessageError | undefined {
        return this.isError ? new MessageError(this) : undefined;
    }

    /** The message body as a string. */
    get bodyString() : string {
        if (this._bodyString === undefined)
            this._bodyString = sTextDecoder.decode(this.bodyData);
        return this._bodyString;
    }

    set bodyString(value: string) {
        this._bodyString = value;
        this._bodyData = undefined;
        this._bodyJSON = undefined;
    }

    /** The message body as parsed JSON, or `undefined` if it isn't valid JSON. */
    get bodyJSON() : JSONCollection {
        if (this._bodyJSON === undefined) {
            const str = this.bodyString;
            if (str.length > 0) {
                try {
                    this._bodyJSON = JSON.parse(this.bodyString) as JSONCollection;
                } catch {
                    console.warn("!!! Couldn't parse Message body as JSON: ", this.bodyString);
                }
            }
            if (this._bodyJSON === undefined)
                this._bodyJSON = {};
        }
        return this._bodyJSON;
    }

    set bodyJSON(value: JSONCollection) {
        this._bodyString = JSON.stringify(value);
        this._bodyData = undefined;
        this._bodyJSON = undefined;  // don't set it to `value`, bc `value` can be mutated
    }

    /** The message body as raw bytes, a `Uint8Array`. */
    get bodyData() : Uint8Array {
        if (this._bodyData === undefined)
            this._bodyData = sTextEncoder.encode(this.bodyString);
        return this._bodyData;
    }

    set bodyData(value: Uint8Array) {
        this._bodyData = value;
        this._bodyString = undefined;
        this._bodyJSON = undefined;
    }


    /** The message body as pretty-printed JSON, or just as a string if it's not JSON. */
    get prettyString() : string {
        const j = this.bodyJSON;
        if (j === undefined)
            return this.bodyString;
        return JSON.stringify(j, undefined, 4);
    }

    toString(withBody = false): string {
        let desc = Message.describeFrame(this._number, this._flags);
        desc += " " + JSON.stringify(this.properties);
        if (withBody)
            desc += "«" + this.bodyString + "»";
        return desc;
    }


    // Internals that clients probably aren't interested in:

    /** @internal */
    get type() : Type         {return this._flags & PrivateFlags.TypeMask;}
    /** @internal */
    get typeName() : string   {return TypeNames[this.type];}
    /** @internal */
    get hasNumber() : boolean {return this._number !== undefined;}
    /** @internal */
    get number() : MsgNo  {assert(this.hasNumber); return this._number;}
    /** @internal */
    get flags() : Flags       {return this._flags;}

    /** @internal  Encodes an outgoing message to binary form (which still needs to be framed) */
    encodeBinary() : Uint8Array {
        const pieces: Uint8Array[] = [];
        if (this.properties) {
            for (const key in this.properties) {
                pieces.push(sTextEncoder.encode(key), kZeroByte,
                            sTextEncoder.encode(this.properties[key].toString()), kZeroByte);
            }
            pieces.unshift(encodeVarUint(totalLength(pieces)));
        } else {
            pieces.unshift(kZeroByte);
        }
        pieces.push(this.bodyData);
        return concatenate(pieces);
    }

    /** @internal  Returns a textual description of a frame's flags, for logging. */
    static describeFrame(number: number | null, flags: Flags) : string {
        let desc = TypeNames[flags & PrivateFlags.TypeMask];
        if (number)
            desc += `#${number} `;
        desc += ((flags & Options.Compressed)      ? "z" : "-");
        desc += ((flags & Options.Urgent)          ? "u" : "-");
        desc += ((flags & Options.NoReply)         ? "n" : "-");
        desc += ((flags & PrivateFlags.MoreComing) ? "+" : "-");
        return desc;
    }

    protected _flags        : Flags;
    protected _number!      : MsgNo;
    protected _bodyData?    : Uint8Array;
    protected _bodyString?  : string;
    protected _bodyJSON?    : JSONCollection;
}


/** @internal A {@link Message} originating from the peer (either a request or a reply.)
 *  Used only internally by BLIP, or by unit tests.
 */
export class IncomingMessage extends Message {
    constructor(num: MsgNo,
                properties: Properties,
                body: Body,
                flags: Flags)
    {
        assert(num > 0, "invalid message number");
        super(properties, body);
        this._flags = flags;
        this._number = num;
    }

    static makeReply(num: MsgNo,
                     properties: Properties = {},
                     body: Body = "",
                     flags: Flags = 0)
        : IncomingMessage
    {
        return new IncomingMessage(num, properties, body, Type.RPY | flags);
    }

    static makeError(num: MsgNo, message: string, code: number, domain = "BLIP") {
        return new IncomingMessage(num, {"Error-Code": code.toString(), "Error-Domain": domain},
                                   message, Type.ERR);
    }

    static decodedFromBinary(data: Uint8Array,
                             flags: Flags,
                             number: MsgNo)
        : IncomingMessage
    {
        // Decode the properties:
        let [propsEnd, i] = readVarUint(data, 0);
        propsEnd += i;
        if (propsEnd > data.length)
            throw Error("Message properties length too large");
        const properties: Properties = {};
        while (i < propsEnd) {
            let end = data.indexOf(0, i);
            if (end < 0 || end > propsEnd)
                throw Error("Invalid message properties (no NUL)");
            const key = sTextDecoder.decode(data.slice(i, end));
            i = end + 1;
            end = data.indexOf(0, i);
            if (end < 0 || end > propsEnd)
                throw Error("Invalid message properties (no NUL)");
            const value = sTextDecoder.decode(data.slice(i, end));
            i = end + 1;
            properties[key] = value;
        }

        const body = data.slice(propsEnd);
        return new IncomingMessage(number, properties, body, flags);
    }
}


/** A JavaScript Error with an associated BLIP error domain and code. */
export class BLIPError extends Error {
    constructor(message: string, code: number, domain = "BLIP") {
        super(message);
        this.name = "blip.BLIPError";
        this.blipErrorCode = code;
        this.blipErrorDomain = domain;
    }

    /** The error domain, a namespace for the code. */
    readonly blipErrorDomain: string;

    /** The error code. */
    readonly blipErrorCode: number;

    matches(code: number, domain = "BLIP") : boolean {
        return this.blipErrorCode === code && this.blipErrorDomain === domain;
    }

    override toString() : string {
        return `${super.toString()} (${this.blipErrorDomain} ${this.blipErrorCode})`;
    }
}


/** The `Error` subclass returned by a failed BLIP reply promise
 *  when the reply is a BLIP error from the peer. */
export class MessageError extends BLIPError {
    constructor(msg: Message) {
        super("Peer responded with error: " + msg.bodyString,
              msg.numericProperty("Error-Code"),
              msg.property("Error-Domain", "BLIP"));
        this.name = "blip.MessageError";
        this.blipMessage = msg;
    }

    /** The incoming BLIP error reply. */
    readonly blipMessage: Message;
}


//////// MESSAGE DISPATCH:


export type MessageHandler = (message: Message) => void;


/** An event target that dispatches incoming request Messages,
  *  keyed by the message's profile string.
  * This interface aligns with the standard DOM EventTarget API. */
export interface MessageEvents {
    addEventListener(profile: string, handler: MessageHandler) : void;
    removeEventListener(profile: string, handler: MessageHandler) : void;
}


export class MessageEventsImpl implements MessageEvents {
    addEventListener(profile: string, handler: MessageHandler) {
        if (this.#handlers.get(profile))
            throw Error(`there is already a message handler for ${profile}`);
        this.#handlers.set(profile, handler);
    }

    removeEventListener(profile: string, handler: MessageHandler) {
        if (this.#handlers.get(profile) === handler)
            this.#handlers.delete(profile);
    }

    dispatchMessage(msg: Message) : boolean {
        const handler = this.#handlers.get(msg.profile);
        if (handler) {
            try {
                handler(msg);
            } catch (x) {
                console.error(`dispatchMessage(${msg.profile}) caught ${x}`);
            }
            return true;
        } else {
            return false;
        }
    }

    #handlers   = new Map<string,MessageHandler>();
}

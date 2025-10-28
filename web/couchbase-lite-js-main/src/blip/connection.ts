//
// blip/connection.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */

/** Transport-agnostic BLIP protocol implementation.
 *  @module */

import * as msg from "./message";
import { assert } from "@/util/assert";
import { readVarUint, writeVarUint, concatenate} from "./util";
import { crc32Init, crc32Update, crc32Final } from "@foxglove/crc";
import { LogCategory } from "../util/logging";
import Pako from "pako";// must use 1.x not 2.x: https://github.com/nodeca/pako/issues/235
import * as logtape from "@logtape/logtape";


//////// CONSTANTS AND GLOBAL PARAMETERS:


export const BLIPLogger = logtape.getLogger([LogCategory, "blip"]);


/** The maximum number of metadata bytes in a frame (msg# + flags + checksum) */
const MaxFrameMetadataSize = 10 + 1 + 4;

/** After receiving this many bytes of an incoming message, send an ACK frame */
const IncomingAckThreshold = 50 * 1024;

/** After sending this many bytes without receiving an ACK, pause sending. */
const MaxUnackedBytes = 128000;


export const GlobalParams = {
    /** The maximum number of bytes of a message to send in a single frame (WebSocket message.) */
    MaxFrameSize: 16384,

    /** Maximum size that the WebSocket's `bufferedAmount` can grow to;
     * if it exceeds this, BLIP stops sending frames until it goes down. */
    MaxBufferedAmount: 1000 * 1024,  // Maximum buffered outgoing bytes

    /** How long (in milliseconds) BLIP waits before trying to send again when the WebSocket's
     *  `bufferedAmount` is too large. */
    BufferDelayMS: 100,         // Delay (ms) that I wait for the buffer to empty

    /** Set this to `true` to log to the logger when frames are sent/received. */
    LogFrames: false,

    /** Set this to `true` to log to the logger when messages are sent/received. */
    LogMessages: false,
};

//////// CRC32 & ZIP:


/** The "00 00 FF FF" trailer that's omitted from compressed frames. */
const kDeflateTrailer = new Uint8Array(4);
kDeflateTrailer[2] = kDeflateTrailer[3] = 0xFF;


/** A running CRC32 checksum. */
class Checksum {
    add(data: Uint8Array) : number {
        this.#crc = crc32Update(this.#crc, data);
        return this.value;
    }

    get value() : number {
        return crc32Final(this.#crc);
    }

    #crc = crc32Init();
}


/** Simple wrapper around Inflate, to decompress data. */
class Decompressor {
    constructor() {
        this.#inflate = new Pako.Inflate({raw: true, windowBits: 15});
        this.#inflate.onEnd = (error: number) => {
            if (error !== 0)
                throw Error(`Inflate error ${error}`);
        };
    }

    decompress(data: Uint8Array, onData: (output: Uint8Array)=>void) {
        this.#inflate.onData = onData;
        this.#inflate.push(data);
        this.#inflate.push(kDeflateTrailer, 2);  // use SyncFlush
    }

    #inflate : Pako.Inflate;
}


//////// OUTGOING MESSAGES:


/** How to handle a response {@link Message} that's an error:
 *  either throw it as a {@link MessageError}, or return it. */
export type ErrorMode = "throw" | "nothrow";


/** Just holds the `resolve` and `reject` functions for a Promise<Message>. */
class PromiseKeeper {
    constructor(public resolve: (reply: msg.Message) => void,
                public reject:  (error: Error) => void,
                public mode: ErrorMode = "throw") { }
}


abstract class FrameSender {
    constructor(flags: msg.Flags, promiseKeeper: PromiseKeeper | null) {
        this.flags = flags;
        this.promiseKeeper = promiseKeeper;
        if (flags & msg.Options.Compressed)
            throw Error("Sending compressed messages is unimplemented!"); //TODO
    }

    logger = BLIPLogger;

    abstract nextFrame(checksum: Checksum) : Uint8Array;

    get type() : msg.Type {return this.flags & msg.PrivateFlags.TypeMask;}

    abstract get needsACK() : boolean;
    abstract get finished() : boolean;

    flags         : msg.Flags;
    msgNo!        : msg.MsgNo;
    promiseKeeper : PromiseKeeper | null;
}


/** Internal class that constructs frames from an outgoing {@link Message}. */
class MessageSender extends FrameSender {

    /** Constructor takes a Message object to send. */
    constructor(message: msg.Message, promiseKeeper: PromiseKeeper | null) {
        super(message.flags | msg.PrivateFlags.MoreComing, promiseKeeper);
        if (message.isReply) {
            assert(message.hasNumber, "Outgoing reply must have a number");
            this.msgNo = message.number;
        } else {
            assert(!message.hasNumber, "Outgoing request must not have a number yet");
        }

        this.#data = message.encodeBinary();
        this.#bytesSent = 0;

        if (GlobalParams.LogMessages)
            this.#propertiesStr = JSON.stringify(message.properties);
    }

    /** Returns the next frame to send, as a {@link Uint8Array}. */
    nextFrame(checksum: Checksum) : Uint8Array {
        // Compute the number of bytes of payload to send, and allocate the frame:
        const bytesLeft = this.#data.length - this.#bytesSent;
        assert(bytesLeft > 0);
        const payLen = Math.min(bytesLeft, GlobalParams.MaxFrameSize - MaxFrameMetadataSize);
        const frameSize = payLen + MaxFrameMetadataSize;
        const frameBuf = new ArrayBuffer(frameSize);
        const frame = new Uint8Array(frameBuf);

        // Write frame header:
        let i = writeVarUint(frame, 0, this.msgNo);
        if (payLen === bytesLeft)
            this.flags &= ~msg.PrivateFlags.MoreComing;
        i = writeVarUint(frame, i, this.flags);

        if (GlobalParams.LogFrames || GlobalParams.LogMessages) {
            const desc = msg.Message.describeFrame(this.msgNo, this.flags);
            if (GlobalParams.LogMessages && this.#bytesSent === 0) {
                this.logger.debug(`<<< Sending ${desc} ${this.#propertiesStr}`);
            }
            if (GlobalParams.LogFrames) {
                this.logger.debug(`<   Sending frame  ${desc} + ${payLen} bytes @ ${this.#bytesSent}`);
            }
        }

        // Write payload of frame, i.e. bytes from the message:
        const payload = this.#data.slice(this.#bytesSent, this.#bytesSent + payLen);
        frame.set(payload, i);
        this.#bytesSent += payLen;
        this.#unackedBytes += payLen;
        i += payLen;

        // Update and append the checksum:
        const currentChecksum = checksum.add(payload);
        (new DataView(frame.buffer, frame.byteOffset)).setUint32(i, currentChecksum);
        i += 4;

        // Return the actual frame:
        return frame.subarray(0, i);
    }


    receivedACK(byteCount: number) {
        this.#unackedBytes = Math.max(0, this.#bytesSent - byteCount);
    }


    /** Becomes true when the message has been completely sent. */
    get needsACK() : boolean {
        return this.#unackedBytes > MaxUnackedBytes;
    }


    /** Becomes true when the message has been completely sent. */
    get finished() : boolean {
        return this.#bytesSent >= this.#data.length;
    }


    readonly #data  : Uint8Array;
    #bytesSent      = 0;
    #unackedBytes   = 0;
    #propertiesStr! : string;
}


/** Sends an ACK frame. */
class AckSender extends FrameSender {
    constructor(isReply: boolean, msgNo: msg.MsgNo, byteCount: number, logger: logtape.Logger)
    {
        const type = isReply ? msg.Type.ACKRPY : msg.Type.ACKMSG;
        super(type | msg.Options.Urgent | msg.Options.NoReply, null);
        this.msgNo = msgNo;
        this.#byteCount = byteCount;
        this.logger = logger;
    }

    nextFrame(_checksum: Checksum) : Uint8Array {
        if (GlobalParams.LogFrames) {
            const desc = msg.Message.describeFrame(this.msgNo, this.flags);
            this.logger.debug(`<   Sending frame  ${desc} @ ${this.#byteCount}`);
        }
        const buf = new ArrayBuffer(10);
        const frame = new Uint8Array(buf);
        let i = writeVarUint(frame, 0, this.msgNo);
        i = writeVarUint(frame, i, this.flags);
        i = writeVarUint(frame, i, this.#byteCount);
        return frame.subarray(0, i);
    }

    get needsACK() : boolean {return false;}
    get finished() : boolean {return true;}

    #byteCount: number;
}


//////// INCOMING MESSAGES:


/** Internal class that assembles an incoming {@link Message} out of frames. */
class MessageReceiver {

    constructor(msgNo: msg.MsgNo, promiseKeeper: PromiseKeeper | null) {
        this.#msgNo = msgNo;
        this.promiseKeeper = promiseKeeper;
    }

    promiseKeeper: PromiseKeeper | null;


    /** Reads the next frame of the message.
     *  Returns a {@link Message} object when it's complete, else null. */
    addFrame(frame: Uint8Array,
             flags: msg.Flags,
             decompressor: Decompressor,
             checksum: Checksum)
        : msg.IncomingMessage | null
    {
        this.#rawBytesReceived += frame.length;
        this.#unackedBytes += frame.length;

        if (this.#datas === undefined) {
            // First frame:
            this.#flags = flags & ~msg.PrivateFlags.MoreComing;
            this.#datas = [];
        } else {
            // Subsequent frames:
            if ((flags & ~msg.PrivateFlags.MoreComing) !== this.#flags)
                throw Error("Invalid frame: mismatched flags");
        }
        const moreComing = (flags & msg.PrivateFlags.MoreComing) !== 0;

        // Append the frame's body data to the message body, updating my running checksum:
        const body = frame.subarray(0, frame.length - 4);
        let currentChecksum : number | null = null;
        if (flags & msg.Options.Compressed) {
            decompressor.decompress(body, (output) => {
                this.#datas.push(output);
                currentChecksum = checksum.add(output);
            });
            if (currentChecksum === null) {
                throw Error("Inflate didn't produce any data"); // onData wasn't called
            }
        } else {
            this.#datas.push(body);
            currentChecksum = checksum.add(body);
        }

        // Verify with the checksum at the end of the frame:
        const view = new DataView(frame.buffer, frame.byteOffset);
        const frameChecksum = view.getUint32(frame.length - 4);
        if (frameChecksum !== currentChecksum) {
            throw Error("Invalid checksum: expected " + currentChecksum.toString(16) +
                        ", got " + frameChecksum.toString(16));
        }

        if (moreComing) {
            return null;
        } else {
            // Finish:
            const data = concatenate(this.#datas);
            this.#datas = [];
            return msg.IncomingMessage.decodedFromBinary(data, this.#flags, this.#msgNo);
        }
    }

    get bytesToAck() {
        if (this.#unackedBytes >= IncomingAckThreshold) {
            this.#unackedBytes = 0;
            return this.#rawBytesReceived;
        } else {
            return 0;
        }
    }

    readonly #msgNo   : msg.MsgNo;
    #flags!           : msg.Flags;
    #datas!           : Uint8Array[];
    #rawBytesReceived = 0;
    #unackedBytes     = 0;
}


//////// BLIP CONNECTION:


/** Transport-agnostic BLIP protocol manager.
 *  You probably want {@link Socket} instead, unless you're implementing a new non-WebSocket
 *  transport. */
export class Connection {

    logger = BLIPLogger;

    /** Adds an outgoing {@link message} to the queue to be sent.
        Returns a promise of a reply. The message must not have the {@link NoReply} option. */
    async send(message: msg.Message, mode: ErrorMode) : Promise<msg.Message> {
        assert(this.#open, "The connection is closed");
        assert(message.wantsReply, "send() with NoReply message");
        return new Promise( (resolve, reject) => {
            this._send(message, new PromiseKeeper(resolve, reject, mode));
        });
    }


    /** Adds an outgoing {@link message} to the queue to be sent.
        The message must have the {@link NoReply} option. */
    sendNoReply(message: msg.Message) : void {
        assert(this.#open, "The connection is closed");
        assert(!message.wantsReply, "sendNoReply() with message that wants a reply");
        this._send(message, null);
    }


    private _send(message: msg.Message,  promiseKeeper: PromiseKeeper | null) : void {
        const sender = new MessageSender(message, promiseKeeper);
        sender.logger = this.logger;
        this.#outbox.push(sender);  // TODO: Implement Urgent scheduling
    }


    /** Returns the next frame to send, or `null` if there's nothing pending. */
    nextFrameToSend() : Uint8Array | null {
        const sender = this.#outbox.shift();
        if (sender === undefined)
            return null;

        if (!sender.msgNo) {
            // Assign message a number when its first frame is sent:
            const n = ++this.#lastOutgoingNumber as msg.MsgNo;
            sender.msgNo = n;
            // If it will get a reply, register a MessageReceiver for it:
            if ((sender.flags & (msg.PrivateFlags.TypeMask | msg.Options.NoReply)) === msg.Type.MSG)
                this.#replies.set(n, new MessageReceiver(n, sender.promiseKeeper));
        }
        // Create the next frame:
        const frame = sender.nextFrame(this.#outChecksum);
        if (!sender.finished) {
            if (sender.needsACK) {
                if (GlobalParams.LogFrames)
                    this.logger.debug(`Moved ${msg.TypeNames[sender.type]} ${sender.msgNo} to icebox`);
                this.#icebox.push(sender);
            } else
                this.#outbox.push(sender);
        }
        return frame;
    }


    /** Call this when a frame is received.
    When an incoming {@link Message} is completed it will be returned, else `null`. */
    handleIncomingFrame(frame: Uint8Array) : msg.Message | null {
        // Read the frame header:
        let n : number;
        let flags : msg.Flags;
        let i = 0;
        [n, i] = readVarUint(frame, i);
        [flags, i] = readVarUint(frame, i);
        const msgNo = n as msg.MsgNo;
        frame = frame.subarray(i);
        if (GlobalParams.LogFrames)
            this.logger.debug(`  > Received frame ${msg.Message.describeFrame(msgNo, flags)}` +
                        ` + ${frame.length - 4} bytes`);

        if (flags > 0x7F)
            throw Error(`Invalid flags ${flags.toString(16)}`);

        const type = flags & msg.PrivateFlags.TypeMask;
        switch (type) {
            case msg.Type.MSG: case msg.Type.RPY: case msg.Type.ERR:
                return this.handleMessageFrame(flags, msgNo, frame);
            case msg.Type.ACKMSG: case msg.Type.ACKRPY:
                this.handleACKFrame(type, msgNo, frame);
                return null;
            default:
                throw Error(`Received unknown frame type '${msg.TypeNames[type]}'`);
        }
    }


    private handleMessageFrame(flags: msg.Flags, msgNo: msg.MsgNo, frame: Uint8Array)
        : msg.Message | null {
        if (frame.length < 4)
            throw Error("Frame missing checksum");

        // Look up the MessageReceiver:
        const type = flags & msg.PrivateFlags.TypeMask;
        const isReply = (type !== msg.Type.MSG);
        const map = isReply ? this.#replies : this.#messages;
        let rcvr = map.get(msgNo);

        if (rcvr) {
            // Add a frame to an existing MessageReceiver for a MSG or RPY:
            const message = rcvr.addFrame(frame, flags, this.#decompressor, this.#inChecksum);
            if (message) {
                map.delete(msgNo); // complete!
                if (GlobalParams.LogMessages) {
                    this.logger.debug(`>>> Received reply ${message}`);
                }
                const pk = rcvr.promiseKeeper;
                if (pk) {
                    // This is a reply, so resolve the promise:
                    if (message.isError && pk.mode === "throw")
                        pk.reject(message.error!);
                    else
                        pk.resolve(message);
                    return null;
                }
            }
            const toAck = rcvr.bytesToAck;
            if (toAck > 0) {
                this.#outbox.push(new AckSender(isReply, msgNo, toAck, this.logger));
            }
            return message;

        } else if (isReply) {
            // Invalid RPY number:
            throw Error(`Invalid #${msgNo} in RPY frame doesn't match any pending reply`);

        } else {
            // No receiver; this is a new incoming MSG, make a new one:
            if (msgNo !== this.#lastIncomingNumber + 1)
                throw Error(`Invalid #${msgNo} in incoming MSG frame; ` +
                            `max is #${this.#lastIncomingNumber + 1}`);
            rcvr = new MessageReceiver(msgNo, null);
            const message = rcvr.addFrame(frame, flags, this.#decompressor, this.#inChecksum);
            this.#lastIncomingNumber = msgNo;
            if (!message) {
                map.set(msgNo, rcvr); // not complete
            }
            return message;
        }
    }


    private handleACKFrame(ackType: msg.Type, msgNo: number, frame: Uint8Array) {
        // Find the MessageSender:
        const msgType = (ackType === msg.Type.ACKMSG ? msg.Type.MSG : msg.Type.RPY);
        let frozen = false;
        let sender = this.#outbox.find(s => (s.msgNo === msgNo && s.type === msgType));
        if (!sender) {
            frozen = true;
            sender = this.#icebox.find(s => (s.msgNo === msgNo && s.type === msgType));
            if (!sender) {
                // This isn't an error; it could be an ACK for a message I recently finished.
                if (GlobalParams.LogFrames)
                    this.logger.debug(`Incoming ${msg.TypeNames[ackType]} ${msgNo} doesn't match` +
                                  " anything I'm sending");
                return;
            }
        }

        // Read the byte count from the frame:
        let [byteCount, i] = readVarUint(frame, 0);
        if (i !== frame.length)
            throw Error("Invalid contents in ACK frame");

        // Process the ACK:
        (sender as MessageSender).receivedACK(byteCount);
        if (frozen && !sender.needsACK) {
            if (GlobalParams.LogFrames)
                this.logger.debug(`Defrosting ${msg.TypeNames[sender.type]} ${sender.msgNo}`);
            i = this.#icebox.indexOf(sender);
            assert(i >= 0);
            this.#icebox.splice(i, 1);
            this.#outbox.push(sender);
        }
    }


    /** True if there are no currently outgoing requests or incoming replies. */
    get safeToClose() : boolean {
        return this.#outbox.length === 0 && this.#replies.size === 0;
    }


    /** Call this when the connection closes.
     *  @param error  An error for rejecting Promises for request Messages that haven't been
     *                transmitted or are awaiting replies. */
    closed(error: Error) {
        if (!this.#open)
            return;
        this.#open = false;

        for (const sender of this.#outbox) {
            sender.promiseKeeper?.reject(error);
        }
        for (const receiver of this.#replies.values()) {
            receiver.promiseKeeper?.reject(error);
        }
    }

    #open               = true;

    // Outgoing:
    #lastOutgoingNumber = 0 as msg.MsgNo;
    #outbox             : FrameSender[] = [];
    #icebox             : FrameSender[] = [];
    #outChecksum        = new Checksum();

    // Incoming:
    #lastIncomingNumber = 0 as msg.MsgNo;
    #messages           = new Map<msg.MsgNo,MessageReceiver>();
    #replies            = new Map<msg.MsgNo,MessageReceiver>();
    #decompressor       = new Decompressor();
    #inChecksum         = new Checksum();
}

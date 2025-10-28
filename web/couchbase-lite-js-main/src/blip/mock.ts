//
// blip/mock.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

/** Mock implementation of BLIP socket, for testing.
 *  @module */


import {SocketAPI, ReadyState, type ErrorMode} from "./blip";
import * as msg from "./message";
import { assert, assertionFailed } from "@/util/assert";


/** Number of milliseconds it takes to "connect". */
const ConnectLatency = 100;

/** Number of milliseconds it takes to "close". */
const CloseLatency = 10;

/** Number of milliseconds it takes for a message's reply to arrive. */
const MessageLatency = 10;


/** A mock implementation of blip.Socket. */
export class MockSocket extends SocketAPI {

    constructor(public url: string, public protocol = "") {
        super();
        MockSocket.Latest = this;
        setTimeout(() => {
            if (this.readyState === ReadyState.Connecting) {
                if (this._mockConnectError) {
                    this.readyState = ReadyState.Closed;
                    this.dispatchEvent("close", this._mockConnectError);
                } else {
                    this.readyState = ReadyState.Open;
                    this.dispatchEvent("open", undefined);
                }
            }
        }, ConnectLatency);
    }

    static Latest?: MockSocket;

    readyState = ReadyState.Connecting;

    close(code = 1000, reason = "") : void {
        assert(this.readyState !== ReadyState.Closed, "Connection is already closed");
        if (this.readyState === ReadyState.Closing)
            return;
        this.readyState = ReadyState.Closing;
        this._closeCode = code;
        this._closeReason = reason;

        setTimeout(() => {
            if (this.readyState !== ReadyState.Closed) {
                this.readyState = ReadyState.Closed;
                this.dispatchEvent("close", this._mockCloseError);
            }
        }, CloseLatency);
    }

    // eslint-disable-next-line @typescript-eslint/promise-function-async
    sendMessage(message: msg.Message, mode: ErrorMode = "throw") : Promise<msg.Message> {
        const [n, reply] = this._sendMessage(message);
        if (!reply) {
            assertionFailed(`Outgoing message #${n} was expected to be NoReply: ${message}`);
        }
        //console.log(`SEND: ${message}`);
        const theReply = reply; // for some reason TS needs this

        return new Promise( (resolve, reject) => {
            setTimeout( () => {
                if (theReply.isError && mode !== "nothrow") {
                    reject(new msg.MessageError(theReply));
                } else {
                    resolve(theReply);
                }
            }, MessageLatency);
        });
    }

    sendMessageNoReply(message: msg.Message) : void {
        const [n, reply] = this._sendMessage(message);
        if (reply)
            assertionFailed(`Outgoing message #${n} sent NoReply: ${message}` +
                 ` but should have expected reply ${reply}`);
        //console.log(`SEND: ${message}`);
    }

    private _sendMessage(message: msg.Message) : [msg.MsgNo, msg.Message | null] {
        this._messagesSent.push(message);
        const n = this._messagesSent.length;
        if (n - 1 >= this._mockReplies.length)
            assertionFailed(`Unexpected outgoing message #${n}: ${message}`);
        const reply = this._mockReplies[n - 1];
        if (reply && reply.number !== n)
            assertionFailed(`Reply for message #${n} has wrong number: ${reply}`);
        return [n as msg.MsgNo, reply];
    }

    override sendReply(reply: msg.Message) {
        assert(reply.isReply);
        this._repliesSent.push(reply);
    }


    /** Set this to make the connection fail with an error. */
    _mockConnectError?: Error = undefined;

    /** Set this to make closing the socket fail with an error. */
    _mockCloseError?: Error = undefined;

    /** Prepopulate this with replies to the messages the app will send.
     * The first item will be the reply to the first sent message, etc.
     * Add `null` entries as placeholders for messages that will be sent NoReply. */
    _mockReplies: Array<msg.IncomingMessage | null> = [];


    /** All messages sent will be pushed to this array. */
    _messagesSent: Array<msg.Message> = [];

    /** All replies sent will be pushed to this array. */
    _repliesSent: Array<msg.Message> = [];

    /** This will be set to the value of `code` passed to `close()`. */
    _closeCode?: number;

    /** This will be set to the value of `reason` passed to `close()`. */
    _closeReason?: string;
}

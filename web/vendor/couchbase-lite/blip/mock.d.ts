import { SocketAPI, ReadyState, ErrorMode } from './blip';
import * as msg from "./message";
/** A mock implementation of blip.Socket. */
export declare class MockSocket extends SocketAPI {
    url: string;
    protocol: string;
    constructor(url: string, protocol?: string);
    static Latest?: MockSocket;
    readyState: ReadyState;
    close(code?: number, reason?: string): void;
    sendMessage(message: msg.Message, mode?: ErrorMode): Promise<msg.Message>;
    sendMessageNoReply(message: msg.Message): void;
    private _sendMessage;
    sendReply(reply: msg.Message): void;
    /** Set this to make the connection fail with an error. */
    _mockConnectError?: Error;
    /** Set this to make closing the socket fail with an error. */
    _mockCloseError?: Error;
    /** Prepopulate this with replies to the messages the app will send.
     * The first item will be the reply to the first sent message, etc.
     * Add `null` entries as placeholders for messages that will be sent NoReply. */
    _mockReplies: Array<msg.IncomingMessage | null>;
    /** All messages sent will be pushed to this array. */
    _messagesSent: Array<msg.Message>;
    /** All replies sent will be pushed to this array. */
    _repliesSent: Array<msg.Message>;
    /** This will be set to the value of `code` passed to `close()`. */
    _closeCode?: number;
    /** This will be set to the value of `reason` passed to `close()`. */
    _closeReason?: string;
}

//
// blip/message.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import * as msg from "./message";
import type { MsgNo } from "./message";
import { expect, test, vi } from "vitest";

// Suppresses console messages while running a function.
function withoutConsoleWarnings(fn: () => void) {
    vi.spyOn(console, "log").mockImplementation(vi.fn());
    vi.spyOn(console, "debug").mockImplementation(vi.fn());
    vi.spyOn(console, "warn").mockImplementation(vi.fn());
    vi.spyOn(console, "error").mockImplementation(vi.fn());
    try {
        fn();
    } finally {
        vi.spyOn(console, "log").mockRestore();
        vi.spyOn(console, "debug").mockRestore();
        vi.spyOn(console, "warn").mockRestore();
        vi.spyOn(console, "error").mockRestore();
    }
}


test("attributes", () => {
    const m = new msg.Message({});
    expect(m.wantsReply).toBe(true);
    expect(m.isReply).toBe(false);
    expect(m.isError).toBe(false);
    expect(m.type).toBe(msg.Type.MSG);
    expect(m.typeName).toBe("MSG");
    expect(m.flags).toBe(msg.Type.MSG);
    expect(m.hasNumber).toBe(false);
});

test("attributes NoReply", () => {
    const m = new msg.Message({}, "", msg.Options.NoReply);
    expect(m.wantsReply).toBe(false);
    expect(m.isReply).toBe(false);
    expect(m.isError).toBe(false);
    expect(m.type).toBe(msg.Type.MSG);
    expect(m.typeName).toBe("MSG");
    expect(m.flags).toBe(msg.Type.MSG | msg.Options.NoReply);
    expect(m.hasNumber).toBe(false);
});

test("attributes Urgent", () => {
    const m = new msg.Message({}, "", msg.Options.Urgent);
    expect(m.wantsReply).toBe(true);
    expect(m.isReply).toBe(false);
    expect(m.isError).toBe(false);
    expect(m.type).toBe(msg.Type.MSG);
    expect(m.typeName).toBe("MSG");
    expect(m.flags).toBe(msg.Type.MSG | msg.Options.Urgent);
    expect(m.hasNumber).toBe(false);
});

test("attributes of reply", () => {
    const m0 = new msg.IncomingMessage(17 as MsgNo, {}, "", msg.Options.Urgent);
    const m = m0.makeReply();
    expect(m.wantsReply).toBe(false);
    expect(m.isReply).toBe(true);
    expect(m.isError).toBe(false);
    expect(m.type).toBe(msg.Type.RPY);
    expect(m.typeName).toBe("RPY");
    expect(m.flags).toBe(msg.Type.RPY);
    expect(m.hasNumber).toBe(true);
    expect(m.number).toBe(17);
});

test("attributes of error reply", () => {
    const m0 = new msg.IncomingMessage(17 as MsgNo, {}, "", msg.Options.Urgent);
    const m = m0.makeErrorReply("Whoops", 500, "Tests");
    expect(m.wantsReply).toBe(false);
    expect(m.isReply).toBe(true);
    expect(m.isError).toBe(true);
    expect(m.type).toBe(msg.Type.ERR);
    expect(m.typeName).toBe("ERR");
    expect(m.flags).toBe(msg.Type.ERR);
    expect(m.hasNumber).toBe(true);
    expect(m.number).toBe(17);
    expect(m.numericProperty("Error-Code")).toBe(500);
    expect(m.property("Error-Domain")).toBe("Tests");
    expect(m.bodyString).toBe("Whoops");

    const err = new msg.MessageError(m);
    expect(err.message).toContain("Whoops");
    expect(err.name).toBe("blip.MessageError");
    expect(err.blipErrorDomain).toBe("Tests");
    expect(err.blipErrorCode).toBe(500);
    expect(err.blipMessage).toBe(m);
});


test("properties", () => {
    const m = new msg.Message({key: "value", "number": "-1234"});

    expect(m.properties).toStrictEqual({key: "value", "number": "-1234"});
    expect(m.property("key")).toBe("value");
    expect(m.property("bogus")).toBe("");
    expect(m.numericProperty("number")).toBe(-1234);
    expect(m.numericProperty("number", 5678)).toBe(-1234);
    expect(m.numericProperty("key")).toBe(0);
    expect(m.numericProperty("key", 5678)).toBe(5678);
    expect(m.profile).toBe("");
});

test("profile", () => {
    const m = new msg.Message({Profile: "ruin"});
    expect(m.profile).toBe("ruin");
});


test("body string", () => {
    const m = new msg.Message({}, "foobar");
    expect(m.bodyString).toBe("foobar");
    expect(m.bodyData).toStrictEqual(new Uint8Array([102, 111, 111, 98, 97, 114]));
    withoutConsoleWarnings( () => {
        expect(m.bodyJSON).toStrictEqual({});
    });
});

test("body data", () => {
    const bytes = new Uint8Array([102, 111, 111, 98, 97, 114]);
    const m = new msg.Message({}, bytes);
    expect(m.bodyString).toBe("foobar");
    expect(m.bodyData).toStrictEqual(bytes);
    withoutConsoleWarnings( () => {
        expect(m.bodyJSON).toStrictEqual({});
    });
});

test("body JSON", () => {
    const jsonObj = {foo: true, bar: "baz", items: [1, null, false, []]};
    const m = new msg.Message({}, jsonObj);
    expect(m.bodyString).toBe("{\"foo\":true,\"bar\":\"baz\",\"items\":[1,null,false,[]]}");
    expect(m.bodyData.length).toBe(50);
    expect(m.bodyJSON).toStrictEqual(jsonObj);
});


test("encoding", () => {
    const properties = {key: "value", "number": "-1234", "": "yes", "empty": ""};
    const jsonObj = {foo: true, bar: "baz"};
    const m0 = new msg.Message(properties, jsonObj);
    const encoded = m0.encodeBinary();

    const m = msg.IncomingMessage.decodedFromBinary(encoded, msg.Type.MSG, 17 as msg.MsgNo);
    expect(m.properties).toStrictEqual(properties);
    expect(m.bodyJSON).toStrictEqual(jsonObj);
    expect(m.flags).toBe(msg.Type.MSG);
    expect(m.number).toBe(17);
});

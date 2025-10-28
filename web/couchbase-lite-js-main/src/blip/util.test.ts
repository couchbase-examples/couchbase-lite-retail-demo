//
// blip/util.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { expect, test } from "vitest";
import * as util from "./util";

test("varint", () => {
    expect(util.encodeVarUint(0)).toStrictEqual(new Uint8Array([0]));
    expect(util.encodeVarUint(123)).toStrictEqual(new Uint8Array([123]));
    expect(util.encodeVarUint(0x80)).toStrictEqual(new Uint8Array([0x80, 0x01]));
    expect(util.encodeVarUint(0x8A)).toStrictEqual(new Uint8Array([0x8A, 0x01]));

    const buf = new Uint8Array(10);
    const roundtrip = (n: number) => {
        const len = util.writeVarUint(buf, 0, n);
        expect(len).toBeLessThanOrEqual(buf.length);
        const [outN, outLen] = util.readVarUint(buf, 0);
        expect(outN).toBe(n);
        expect(outLen).toBe(len);
    };

    for (let n = 0; n <= 0x80000000; n = Math.floor(n * 1.5 + 1))
        roundtrip(n);
    roundtrip(0x7FFFFFFF);
});


test("totalLength", () => {
    const a = new Uint8Array();
    const b = new Uint8Array([1]);
    const c = new Uint8Array([3, 4, 5]);
    expect(util.totalLength([a, b, b, a, c, b])).toBe(6);
});

test("concatenate", () => {
    const a = new Uint8Array();
    const b = new Uint8Array([1]);
    const c = new Uint8Array([3, 4, 5]);
    const result = new Uint8Array([1, 1, 3, 4, 5, 1]);
    expect(util.concatenate([c])).toEqual(c);
    expect(util.concatenate([a, b, b, a, c, b])).toEqual(result);
});

test("hexString", () => {
    const a = new Uint8Array();
    const b = new Uint8Array([0xab, 0xbc, 0x12]);
    const c = new Uint8Array([3, 4, 5]);
    expect(util.hexString(a)).toEqual("");
    expect(util.hexString(b)).toEqual("abbc12");
    expect(util.hexString(c)).toBe("030405");
});

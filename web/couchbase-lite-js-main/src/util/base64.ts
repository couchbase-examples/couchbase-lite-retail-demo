//
// util/base64.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

// TODO: These can be replaced by UInt8Array methods toBase64() and fromBase64() once those
// are widely available:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64

export function encodeBase64(data: Uint8Array): string {
    const binString = Array.from(data, (byte) => {
        return String.fromCodePoint(byte);
    }).join("");
    return btoa(binString);
}

export function decodeBase64(b64: string): Uint8Array | undefined {
    try {
        return Uint8Array.from(atob(b64), (c) => c.codePointAt(0)!);
    } catch (_x) {
        return undefined;
    }
}

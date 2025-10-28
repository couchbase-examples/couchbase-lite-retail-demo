//
// blip/util.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { assert } from "@/util/assert";


//////// VARINTS:


/** Writes a non-negative integer into a byte array as a varint.
 * @param array  The array to write to.
 * @param i  The offset in the array to write at.
 * @param n  The number to write; must be an integer from 0 to 2^31-1.
 *           (JavaScript's bitwise operations don't work correctly on larger numbers.)
 * @return  The offset just past the end of the varint. */
export function writeVarUint(array: Uint8Array, i: number, n: number) : number {
    assert(n >= 0 && n < 0x80000000, "writeVarUint: number out of range");
    while (n >= 0x80) {
        array[i++] = (n & 0xFF) | 0x80;
        n = n >>> 7;
    }
    array[i++] = n;
    return i;
}

/** Returns a Uint8Array containing a varint-encoded number. */
export function encodeVarUint(n: number) : Uint8Array {
    const buf = new Uint8Array(10);
    const len = writeVarUint(buf, 0, n);
    return buf.subarray(0, len);
}


/** Reads an unsigned varint from a byte array.
    @param array  The byte array to read from.
    @param i  The offset in the array to read at.
    @return  The decoded number, and the array offset just past it. */
export function readVarUint(array: Uint8Array, i: number): [number, number] {
    let n = 0;
    let shift = 0;
    const end = Math.min(array.length, i + 5);
    while (i < end) {
        const byte = array[i++];
        if (byte >= 0x80) {
            n |= (byte & 0x7F) << shift;
            shift += 7;
        } else {
            n |= byte << shift;
            return [n, i];
        }
    }
    throw Error("Invalid varint");
}


//////// ARRAYS:


/** Returns the total length of the arrays in an array. */
export function totalLength(datas: Uint8Array[]): number {
    return datas.reduce( (total, item) => total + item.length, 0);
}


/** Concatenates an array of Uint8Arrays into a single Uint8Array. */
export function concatenate(datas: Uint8Array[]) : Uint8Array {
    if (datas.length === 1)
        return datas[0];
    const result = new Uint8Array(totalLength(datas));
    let offset = 0;
    for (const item of datas) {
        result.set(item, offset);
        offset += item.length;
    }
    return result;
}


/** Returns a hex string of a Uint8Array. */
export function hexString(array: Uint8Array) : string {
    return array.reduce((str, b) => str + (b < 16 ? "0" : "") + b.toString(16), "");
}

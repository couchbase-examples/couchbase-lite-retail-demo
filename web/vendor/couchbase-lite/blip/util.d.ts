/** Writes a non-negative integer into a byte array as a varint.
 * @param array  The array to write to.
 * @param i  The offset in the array to write at.
 * @param n  The number to write; must be an integer from 0 to 2^31-1.
 *           (JavaScript's bitwise operations don't work correctly on larger numbers.)
 * @return  The offset just past the end of the varint. */
export declare function writeVarUint(array: Uint8Array, i: number, n: number): number;
/** Returns a Uint8Array containing a varint-encoded number. */
export declare function encodeVarUint(n: number): Uint8Array;
/** Reads an unsigned varint from a byte array.
    @param array  The byte array to read from.
    @param i  The offset in the array to read at.
    @return  The decoded number, and the array offset just past it. */
export declare function readVarUint(array: Uint8Array, i: number): [number, number];
/** Returns the total length of the arrays in an array. */
export declare function totalLength(datas: Uint8Array[]): number;
/** Concatenates an array of Uint8Arrays into a single Uint8Array. */
export declare function concatenate(datas: Uint8Array[]): Uint8Array;
/** Returns a hex string of a Uint8Array. */
export declare function hexString(array: Uint8Array): string;

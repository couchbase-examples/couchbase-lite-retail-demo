// database/cryptoCodec.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { assert } from "@/util/assert";
import { isJSONObject, type JSONObject, type JSONValue } from "@/util/json_types";


const DerivationAlgorithm   = "PBKDF2";
const kDerivationIterations = 5.0e6;
const kDerivationSaltString = "Couchbase Lite for JavaScript";

const EncryptionAlgorithm   = "AES-GCM";
const KeyLength             = 256;


const KeyKey: unique symbol = Symbol();     // unique key inaccessible from outside this module


/** Data encrypted by a CryptoCodec. */
export interface Encrypted {
    readonly data   : Uint8Array,   // Encrypted data
    readonly iv     : Uint8Array,   // Random initialization vector (12 bytes)
}


/** Interface for partial revision encryption. (A small subset of a LocalRevision.) */
export interface PartlyEncrypted {
    body            : JSONObject;   // The unencrypted part
    encrypted?      : Encrypted;    // The encrypted part
}


/** Database encryption errors. */
export class EncryptionError extends Error { }


/** Manages symmetric encryption of document properties and blobs.
 *  It is not possible to extract the key or password from an instance. @internal */
export class CryptoCodec {
    private constructor() { }

    /** Creates a new, unlocked CryptoCodec whose key is derived from the given password. */
    static async create(password: string): Promise<CryptoCodec> {
        const codec = new CryptoCodec();
        await codec.generateKey(password);
        codec.#challenge = await codec.encryptJSON(crypto.randomUUID());
        return codec;
    }


    /** Creates a CryptoCodec for use with existing encrypted data. It starts locked.
     *  @param challenge  Any existing encrypted data, usually the prior codec's `challenge`. */
    static withChallenge(challenge: Encrypted): CryptoCodec {
        const codec = new CryptoCodec();
        codec.#challenge = challenge;
        return codec;
    }


    /** A small encrypted value which can be saved and then later used to reconstitute the
     *  codec by calling `CryptoCodec.withChallenge()`. */
    get challenge(): Encrypted {return this.#challenge;}


    /** True if the password has been given and the codec is ready to encrypt or decrypt. */
    get isUnlocked(): boolean {return this[KeyKey] !== undefined;}


    /** Creates the encryption key, derived from the given password.
     *  If constructed with a challenge, will try to decrypt it with the key; if that fails,
     *  the codec ignores the key and returns false.
     *  If the codec wasn't constructed with a challenge, it creates one now by encrypting some
     *  random data with the key. */
    async unlock(password: string): Promise<boolean> {
        await this.generateKey(password);
        try {
            await this.decryptJSON(this.#challenge);
        } catch (_x) {
            this[KeyKey] = undefined;
            return false;
        }
        return true;
    }


    /** Discards the encryption key. `unlock` must be called to use the codec again. */
    lock() {
        this[KeyKey] = undefined;
    }


    /** Encrypts binary data.
     *  @throws EncryptionError  if locked. */
    async encrypt(clear: BufferSource | Uint8Array): Promise<Encrypted> {
        // Note: added `| Uint8Array` because for some reason Uint8Array does not conform to
        // interface BufferSource anymore in Node/Bun, though it does in the browser.
        const cryptoKey = this.requiredKey("encrypt");
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const data = await crypto.subtle.encrypt({ name: EncryptionAlgorithm, iv }, cryptoKey, clear as BufferSource);
        return {data: new Uint8Array(data), iv};
    }


    /** Decrypts binary data.
     *  @throws EncryptionError  if locked. */
    async decrypt(e: Encrypted): Promise<ArrayBuffer> {
        const cryptoKey = this.requiredKey("decrypt");
        const algorithm = {name: EncryptionAlgorithm, iv: e.iv};
        return await crypto.subtle.decrypt(algorithm, cryptoKey, e.data as BufferSource);
        // Note: Explicit cast to BufferSource above is because for some reason Uint8Array does
        // not conform tointerface BufferSource anymore in Node/Bun, though it does in the browser.
    }


    /** Encrypts a JSON value.
     *  @throws EncryptionError  if locked. */
    async encryptJSON(value: JSONValue): Promise<Encrypted> {
        return await this.encrypt(new TextEncoder().encode(JSON.stringify(value)));
    }


    /** Decrypts a JSON value.
     *  @throws EncryptionError  if locked. */
    async decryptJSON(e: Encrypted): Promise<JSONValue> {
        const clear = await this.decrypt(e);
        return JSON.parse(new TextDecoder().decode(clear)) as JSONValue;
    }


    /** Encrypts the object `body`, except for any properties in `unencryptedProperties`.
     *  @throws EncryptionError  if locked. */
    async partlyEncrypt(body: JSONObject, unencryptedProperties : Set<string> | undefined): Promise<PartlyEncrypted> {
        let cipher: JSONObject = {};
        let unencrypted: JSONObject = {};
        let any = false;
        for (const prop of Object.keys(body)) {
            if (unencryptedProperties?.has(prop))
                unencrypted[prop] = body[prop];
            else {
                cipher[prop] = body[prop];
                any = true;
            }
        }
        const encrypted = any ? await this.encryptJSON(cipher) : undefined;
        return {encrypted, body: unencrypted};
    }


    /** Decrypts any encrypted properties in `rev` and merges them into its `body`.
     *  @throws EncryptionError  if locked. */
    async decryptRevision(rev: PartlyEncrypted): Promise<void> {
        if (!rev.encrypted)
            return;    // nothing to decrypt
        const dec = await this.decryptJSON(rev.encrypted);
        assert(isJSONObject(dec));
        rev.body = {...rev.body, ...dec};
        rev.encrypted = undefined;
    }


    private async generateKey(password: string) {
        const encoder = new TextEncoder();
        // First "import" the password string:
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            DerivationAlgorithm,
            false,
            ["deriveBits", "deriveKey"],
        );
        // Then derive the AES256 key from it using PBKDF:
        this[KeyKey] = await crypto.subtle.deriveKey(
            {
                name: DerivationAlgorithm,
                hash: "SHA-256",
                iterations: kDerivationIterations,
                salt: encoder.encode(kDerivationSaltString),
            },
            keyMaterial,
            { name: EncryptionAlgorithm, length: KeyLength },
            false,                  // key is not extractable
            ["encrypt", "decrypt"], // key is not wrappable
        );
    }


    private requiredKey(what: string): CryptoKey {
        const key = this[KeyKey];
        if (!key)
            throw new EncryptionError(`Cannot ${what} without key`);
        return key;
    }


    private [KeyKey]?   : CryptoKey;
    #challenge!         : Encrypted;
}

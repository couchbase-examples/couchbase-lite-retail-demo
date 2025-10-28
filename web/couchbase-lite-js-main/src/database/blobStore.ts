// database/blobStore.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { type NoSchema, Database, type SchemaLike} from "./database";
import type * as dexie from "dexie";
import { EncryptionError, type CryptoCodec } from "./cryptoCodec";


interface BlobRecord {
    digest      : string,
    contents    : Uint8Array,
    iv?         : Uint8Array,   // If present, `contents` are encrypted
}


/** Manages storage of blobs in a Database.  @internal */
export class BlobStore<Schema extends SchemaLike<Schema> = NoSchema> {

    constructor(readonly database: Database<Schema>, table: dexie.Table, codec: CryptoCodec | undefined) {
        this.#table = table as dexie.Table<BlobRecord, string, BlobRecord>;
        this.#codec = codec;
    }

    /** Returns the number of unique blobs stored in the database. */
    async countBlobs(): Promise<number> {
        return this.#table.count();
    }


    /** Retrieves a blob stored in the Database by [saveBlob], else returns `undefined`.
     *  @throws EncryptionError if the blob exists but can't be decrypted. */
    async getBlobIfExists(digest: string): Promise<Uint8Array | undefined> {
        const record = await this.#table.get(digest);
        if (!record)
            return undefined;
        if (record.iv) {
            if (!this.#codec)
                throw new EncryptionError("Blob is encrypted");
            return new Uint8Array(await this.#codec.decrypt({data: record.contents, iv: record.iv}));
        } else {
            return new Uint8Array(record.contents);
        }
    }


    /** Retrieves a blob stored in the Database by [saveBlob], else throws. @internal
     *  @throws Error if the blob doesn't exist.
     *  @throws EncryptionError if the blob can't be decrypted. */
    async getBlob(digest: string): Promise<Uint8Array> {
        const contents = await this.getBlobIfExists(digest);
        if (contents === undefined)
            throw Error(`Database is missing blob with digest ${digest}`);
        return contents;
    }


    /** Returns true if a blob with the given digest exists. */
    async hasBlob(digest: string): Promise<boolean> {
        return (await this.#table.get(digest)) !== undefined;
        //TODO: Optimize this to avoid loading the contents (if possible)
    }


    async allDigests(): Promise<string[]> {
        return await this.#table.toCollection().primaryKeys();
    }


    /** Stores a blob in the Database.
     *  @warning  Caller is responsible for verifing that the digest is corrrect!
     *  @throws EncryptionError if the blob can't be encrypted because the codec is locked. */
    async saveBlob(contents: Uint8Array, digest: string) {
        let record: BlobRecord;
        if (this.#codec) {
            const encrypted = await Database.waitFor(this.#codec.encrypt(contents));
            record = {digest, contents: encrypted.data, iv: encrypted.iv};
        } else {
            record = {digest, contents};
        }
        if ((await this.database.tryAdd(this.#table, record)) === undefined)
            this.database.logger.info `Saved blob ${digest} (${contents.length} bytes)`;
    }


    /** The "sweep" phase of blob GC: Deletes all blobs except those with the given digests.
     *  @returns  The number of blobs deleted. */
    async deleteBlobsExcept(keepDigests: Set<string>) {
        const n = await this.#table
            .where("digest")
            .noneOf(Array.from(keepDigests))
            .delete();
        this.database.logger.info `Garbage-collected ${n} blobs, keeping ${keepDigests.size}`;
        return n;
    }


    async rekey(newCodec: CryptoCodec | undefined) {
        const digests = await this.allDigests();
        if (digests.length > 0) {
            this.database.logger.info `Encrypting ${digests.length} blobs...`;
            for (const digest of digests) {
                const contents = await this.getBlob(digest);    // decrypts w/old codec, if any
                let record: BlobRecord;
                if (newCodec) {
                    const encrypted = await Database.waitFor(newCodec.encrypt(contents));
                    record = {digest, contents: encrypted.data, iv: encrypted.iv};
                } else {
                    record = {digest, contents};
                }
                await this.#table.put(record);
            }
        }
        this.#codec = newCodec;
    }


    resetEncryption(codec: CryptoCodec | undefined) {
        this.#codec = codec;
    }


    readonly #table : dexie.Table<BlobRecord, string, BlobRecord>;
    #codec?         : CryptoCodec;
}

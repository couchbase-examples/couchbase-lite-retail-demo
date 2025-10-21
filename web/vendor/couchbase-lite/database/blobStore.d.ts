import { NoSchema, Database, SchemaLike } from './database';
import { CryptoCodec } from './cryptoCodec';
import type * as dexie from "dexie";
/** Manages storage of blobs in a Database.  @internal */
export declare class BlobStore<Schema extends SchemaLike<Schema> = NoSchema> {
    #private;
    readonly database: Database<Schema>;
    constructor(database: Database<Schema>, table: dexie.Table, codec: CryptoCodec | undefined);
    /** Returns the number of unique blobs stored in the database. */
    countBlobs(): Promise<number>;
    /** Retrieves a blob stored in the Database by [saveBlob], else returns `undefined`.
     *  @throws EncryptionError if the blob exists but can't be decrypted. */
    getBlobIfExists(digest: string): Promise<Uint8Array | undefined>;
    /** Retrieves a blob stored in the Database by [saveBlob], else throws. @internal
     *  @throws Error if the blob doesn't exist.
     *  @throws EncryptionError if the blob can't be decrypted. */
    getBlob(digest: string): Promise<Uint8Array>;
    /** Returns true if a blob with the given digest exists. */
    hasBlob(digest: string): Promise<boolean>;
    allDigests(): Promise<string[]>;
    /** Stores a blob in the Database.
     *  @warning  Caller is responsible for verifing that the digest is corrrect!
     *  @throws EncryptionError if the blob can't be encrypted because the codec is locked. */
    saveBlob(contents: Uint8Array, digest: string): Promise<void>;
    /** The "sweep" phase of blob GC: Deletes all blobs except those with the given digests.
     *  @returns  The number of blobs deleted. */
    deleteBlobsExcept(keepDigests: Set<string>): Promise<number>;
    rekey(newCodec: CryptoCodec | undefined): Promise<void>;
    resetEncryption(codec: CryptoCodec | undefined): void;
}

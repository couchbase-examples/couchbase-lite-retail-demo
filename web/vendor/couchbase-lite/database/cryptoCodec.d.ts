import { JSONObject, JSONValue } from '../util/json_types';
declare const KeyKey: unique symbol;
/** Data encrypted by a CryptoCodec. */
export interface Encrypted {
    readonly data: Uint8Array;
    readonly iv: Uint8Array;
}
/** Interface for partial revision encryption. (A small subset of a LocalRevision.) */
export interface PartlyEncrypted {
    body: JSONObject;
    encrypted?: Encrypted;
}
/** Database encryption errors. */
export declare class EncryptionError extends Error {
}
/** Manages symmetric encryption of document properties and blobs.
 *  It is not possible to extract the key or password from an instance. @internal */
export declare class CryptoCodec {
    #private;
    private constructor();
    /** Creates a new, unlocked CryptoCodec whose key is derived from the given password. */
    static create(password: string): Promise<CryptoCodec>;
    /** Creates a CryptoCodec for use with existing encrypted data. It starts locked.
     *  @param challenge  Any existing encrypted data, usually the prior codec's `challenge`. */
    static withChallenge(challenge: Encrypted): CryptoCodec;
    /** A small encrypted value which can be saved and then later used to reconstitute the
     *  codec by calling `CryptoCodec.withChallenge()`. */
    get challenge(): Encrypted;
    /** True if the password has been given and the codec is ready to encrypt or decrypt. */
    get isUnlocked(): boolean;
    /** Creates the encryption key, derived from the given password.
     *  If constructed with a challenge, will try to decrypt it with the key; if that fails,
     *  the codec ignores the key and returns false.
     *  If the codec wasn't constructed with a challenge, it creates one now by encrypting some
     *  random data with the key. */
    unlock(password: string): Promise<boolean>;
    /** Discards the encryption key. `unlock` must be called to use the codec again. */
    lock(): void;
    /** Encrypts binary data.
     *  @throws EncryptionError  if locked. */
    encrypt(clear: BufferSource | Uint8Array): Promise<Encrypted>;
    /** Decrypts binary data.
     *  @throws EncryptionError  if locked. */
    decrypt(e: Encrypted): Promise<ArrayBuffer>;
    /** Encrypts a JSON value.
     *  @throws EncryptionError  if locked. */
    encryptJSON(value: JSONValue): Promise<Encrypted>;
    /** Decrypts a JSON value.
     *  @throws EncryptionError  if locked. */
    decryptJSON(e: Encrypted): Promise<JSONValue>;
    /** Encrypts the object `body`, except for any properties in `unencryptedProperties`.
     *  @throws EncryptionError  if locked. */
    partlyEncrypt(body: JSONObject, unencryptedProperties: Set<string> | undefined): Promise<PartlyEncrypted>;
    /** Decrypts any encrypted properties in `rev` and merges them into its `body`.
     *  @throws EncryptionError  if locked. */
    decryptRevision(rev: PartlyEncrypted): Promise<void>;
    private generateKey;
    private requiredKey;
    private [KeyKey]?;
}
export {};

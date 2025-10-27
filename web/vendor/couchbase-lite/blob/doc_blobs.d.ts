import { Blob, BlobLoader, Bloblike, NewBlob } from './blob';
import { CBLDictionary, CBLValue } from '../database/types';
/** Returns true if this value is a blob dictionary, with `@type` and `digest`. @internal */
export declare function isBlobDict(obj: CBLValue | undefined): boolean;
export declare function asBloblike(obj: CBLValue | undefined): Bloblike | null;
/** Looks for blob metadata (dicts containing `"@type":"blob"`) in a document's properties,
 *  and replaces them with {@link ExistingBlob} objects. @internal
 *  @param properties  The top-level document properties.
 *  @param loader  The function that should be called to load a blob's contents.
 */
export declare function ImportBlobs(properties: CBLDictionary, loader: BlobLoader): void;
/** Converts all NewBlob instances into ExistingBlobs. */
export declare function NewToExistingBlobs(properties: CBLDictionary, loader: BlobLoader): void;
/** Returns 0 if the dict contains no blobs,
 *          1 if it contains ExistingBlobs,
 *          2 if it contains NewBlobs. */
export declare function ContainsBlobs(properties: CBLDictionary): 0 | 1 | 2;
/** Looks for a NewBlob with the given digest in a dictionary. */
export declare function FindNewBlobWithDigest(properties: CBLDictionary, digest: string): NewBlob | undefined;
type PathArray = Array<string | number>;
type ForEachBlobCallback = (blob: Blob, path: PathArray) => boolean;
/** Recurses into the doc properties looking for {@link Blob} instances,
 *  and invokes the callback on each one. @internal */
export declare function ForEachBlob(properties: CBLDictionary, callback: ForEachBlobCallback): void;
type ForEachBloblikeCallback = (blob: Bloblike) => void;
/** Recurses into the doc properties looking for blob metadata (dicts containing `"@type":"blob"`),
 *  and invokes the callback on each one. @internal */
export declare function ForEachBloblike(properties: CBLDictionary, callback: ForEachBloblikeCallback): void;
export {};

import { JSONObject } from '../util/json_types';
import { BlobLoader, Bloblike } from './blob';
import { CBLDictionary, CBLValue, RevID } from '../database/types';
/** Fixes up a document body received by the replicator. @internal */
export declare function ImportDocument(properties: JSONObject, loader: BlobLoader): void;
export declare function asAttachment(obj: CBLValue | undefined): Bloblike | undefined;
/** Looks for old-style attachments (objects inside an `_attachments` dict) in a revision body.
 *  @returns a Set of their digests, or `undefined` if none. @internal */
export declare function AttachmentDigests(properties: JSONObject): Set<string> | undefined;
/** Looks for old-style attachments (objects inside an `_attachments` dict) in a document's
 *  properties, and replaces them with {@link ExistingBlob} objects. @internal
 *
 *  Each attachment whose name is of the form `blob_/x/y/z` is _moved_ to the JSON path `/x/y/z`
 *  if it replaces a blob dict there; such attachments were created by Couchbase Lite as shadows
 *  of blobs elsewhere in the document, so Sync Gateway will recognize them.
 *  @param properties  The top-level document properties.
 *  @param loader  The function that should be called to load a blob's contents.
 */
export declare function ImportAttachments(properties: CBLDictionary, loader: BlobLoader): void;
/** Returns a copy of the doc's properties where each blob has a parallel item in `_attachments`,
 *  for Sync Gateway. (If no changes are needed, returns `properties` without copying it.)
 *  @internal */
export declare function WithShadowAttachments(properties: CBLDictionary, revID: RevID): CBLDictionary;
/** Returns true if a MIME type indicates its data will likely benefit from compression.
 *  (These heuristics come from LiteCore and SG replicator code.)  @internal */
export declare function IsLikelyCompressible(content_type: string | undefined): boolean;

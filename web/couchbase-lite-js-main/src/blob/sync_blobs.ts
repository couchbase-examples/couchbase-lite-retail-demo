//
// sync_blobs.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { JSONObject } from "@/util/json_types";
import type { BlobLoader, Bloblike } from "./blob";
import { ExistingBlob, Attachment } from "./blob";
import { isBlobDict, ForEachBlob, ImportBlobs } from "./doc_blobs";
import { getGeneration } from "@/database/internals";
import type { CBLDictionary, CBLValue, RevID } from "@/database/types";
import { isDictionary, isArray, asDictionary, CopyDict } from "@/database/types";


/*
 * Functions for handling old-style attachments received from Sync Gateway,
 * and converting blobs to attachments in JSON documents sent to SG>
 */


/** Fixes up a document body received by the replicator. @internal */
export function ImportDocument(properties: JSONObject, loader: BlobLoader) : void {
    // First remove legacy properties like `_id` and `_rev`:
    for (const key of Object.getOwnPropertyNames(properties)) {
        console.log("ImportDocument: Checking key", key);
        if (key[0] === "_" && key !== "_attachments")
            delete properties[key];
    }
    ImportAttachments(properties, loader);
    ImportBlobs(properties, loader);
}


export function asAttachment(obj: CBLValue | undefined) : Bloblike | undefined {
    if (isDictionary(obj) && typeof obj.digest === "string")
        return obj as unknown as Bloblike;
    else
        return undefined;
}


/** Looks for old-style attachments (objects inside an `_attachments` dict) in a revision body.
 *  @returns a Set of their digests, or `undefined` if none. @internal */
export function AttachmentDigests(properties: JSONObject) : Set<string> | undefined {
    let digests;
    const atts = properties._attachments;
    if (isDictionary(atts)) {
        for (const key of Object.getOwnPropertyNames(atts)) {
            const att = asAttachment(atts[key]);
            if (att) {
                if (!digests)
                    digests = new Set<string>();
                digests.add(att.digest);
            }
        }
    }
    return digests;
}


/** Looks for old-style attachments (objects inside an `_attachments` dict) in a document's
 *  properties, and replaces them with {@link ExistingBlob} objects. @internal
 *
 *  Each attachment whose name is of the form `blob_/x/y/z` is _moved_ to the JSON path `/x/y/z`
 *  if it replaces a blob dict there; such attachments were created by Couchbase Lite as shadows
 *  of blobs elsewhere in the document, so Sync Gateway will recognize them.
 *  @param properties  The top-level document properties.
 *  @param loader  The function that should be called to load a blob's contents.
 */
export function ImportAttachments(properties: CBLDictionary, loader: BlobLoader) : void {
    // (See `encodeStrippingOldMetaProperties()` in LiteCore's LegacyAttachments.cc)
    const atts = properties._attachments;
    if (isDictionary(atts)) {
        for (const key of Object.getOwnPropertyNames(atts)) {
            const att = asAttachment(atts[key]);
            if (att) {
                if (key.startsWith("blob_/")) {
                    const blob = new ExistingBlob(att, loader);
                    if (_installBlobAtPath(blob, key.substring(6).split("/")))

                        delete atts[key];
                    else
                        console.warn(`Document _attachments/${key} doesn't reference a blob`);
                } else {
                    atts[key] = new Attachment(att, loader);
                }
            }
        }
        if (atts.length === 0)
            delete properties._attachments;
    }

    // Stores `blob` at path `path`. Returns false if the path doesn't lead to a blob dict.
    function _installBlobAtPath(blob: ExistingBlob, path: Array<string>) {
        let obj: CBLValue | undefined = properties;
        let remaining = path.length;
        for (const key of path) {
            --remaining;
            let child: CBLValue | undefined;
            if (isDictionary(obj)) {
                child = obj[key];
                if (remaining === 0 && isBlobDict(child)) {
                    obj[key] = blob;
                    return true;
                }
            } else if (isArray(obj)) {
                const index = Number(key);
                child = obj[index];
                if (remaining === 0 && isBlobDict(child)) {
                    obj[index] = blob;
                    return true;
                }
            } else {
                return false;
            }
            obj = child;
        }
        return false;
    }
}


/** Returns a copy of the doc's properties where each blob has a parallel item in `_attachments`,
 *  for Sync Gateway. (If no changes are needed, returns `properties` without copying it.)
 *  @internal */
export function WithShadowAttachments(properties: CBLDictionary, revID: RevID) : CBLDictionary {
    // (See `DBAccess::encodeRevWithLegacyAttachments` in LiteCore's DBAccess.cc.)
    let copied: CBLDictionary | undefined;
    let attachments!: CBLDictionary | undefined;
    let revpos: number | undefined;
    ForEachBlob(properties, (blob, path) => {
        if (path[0] !== "_attachments") {
            const name = "blob_/" + path.join("/");
            if (copied === undefined) {
                // Shallow-copy `properties` and the `_attachments` dict:
                copied = CopyDict(properties, false);
                attachments = asDictionary(copied["_attachments"]);
                attachments = attachments ? CopyDict(attachments) : {};
                copied["_attachments"] = attachments;
            }
            revpos = revpos ?? getGeneration(revID);
            attachments![name] = blob.asAttachmentDict(revpos) as unknown as CBLDictionary;
        }
        return true;
    });
    return copied ?? properties;
}


/** Returns true if a MIME type indicates its data will likely benefit from compression.
 *  (These heuristics come from LiteCore and SG replicator code.)  @internal */
export function IsLikelyCompressible(content_type: string | undefined) {
    if (content_type) {
        for (const str of kCompressedTypeSubstrings) {
            if (content_type.includes(str))
                return false;
        }
        for (const str of kGoodTypeSubstrings) {
            if (content_type.includes(str))
                return true;
        }
        for (const str of kBadTypePrefixes) {
            if (content_type.startsWith(str))
                return false;
        }
        return true;
    }
    // Don't try compressing if we don't know what the content-type is.
    return false;
}


// These substrings in a MIME type mean it's very likely already compressed:
const kCompressedTypeSubstrings = ["zip", "zlib", "pkcs", "mpeg", "mp4", "crypt",".rar", "-rar",
                                   "snappy", "lzma", "compress", "zstd", "diskimage", "archive"];

// These substrings mean it is compressible even if it starts with one of the bad prefixes below:
const kGoodTypeSubstrings = ["json", "html", "xml", "yaml", "yml"];

// These prefixes mean it's not compressible, *unless* it matches the above good-types list
// (e.g SVG (`image/svg+xml`), which is compressible.)
const kBadTypePrefixes = ["image/", "audio/", "video/"];

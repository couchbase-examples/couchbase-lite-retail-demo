//
// doc_blobs.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { Blob, BlobLoader, Bloblike} from "./blob";
import { ExistingBlob, NewBlob } from "./blob";
import type { CBLDictionary, CBLValue} from "@/database/types";
import { isDictionary, isBlob, isArray } from "@/database/types";


/*
 * Functions for reconstituting JSON blobs into Blob objects in document revisions,
 * and for locating Blobs and Bloblike objects in documents.
 */


/** Returns true if this value is a blob dictionary, with `@type` and `digest`. @internal */
export function isBlobDict(obj: CBLValue | undefined) {
    return isDictionary(obj) && obj["@type"] === "blob" && typeof obj.digest === "string";
}

export function asBloblike(obj: CBLValue | undefined) : Bloblike | null {
    if (isBlobDict(obj))
        return obj as unknown as Bloblike;
    else
        return null;
}


//////// DECODING BLOBS:


/** Looks for blob metadata (dicts containing `"@type":"blob"`) in a document's properties,
 *  and replaces them with {@link ExistingBlob} objects. @internal
 *  @param properties  The top-level document properties.
 *  @param loader  The function that should be called to load a blob's contents.
 */
export function ImportBlobs(properties: CBLDictionary, loader: BlobLoader) {
    _installBlobs(properties);

    // Recursively replaces blob dicts with ExistingBlob objects in `obj`.
    // If `obj` is a blob dict, returns it as an `ExistingBlob` object; else `undefined`.
    function _installBlobs(obj: CBLValue) : ExistingBlob | undefined {
        if (isArray(obj)) {
            let i = 0;
            for (const v of obj) {
                const blob = _installBlobs(v);  // recurse
                if (blob)
                    obj[i] = blob;
                ++i;
            }
        } else if (isDictionary(obj)) {
            const bl = asBloblike(obj);
            if (bl)
                return new ExistingBlob(bl, loader);
            for (const key of Object.getOwnPropertyNames(obj)) {
                const blob = _installBlobs(obj[key]);  // recurse
                if (blob)
                    obj[key] = blob;
            }
        }
        return undefined;
    }
}


/** Converts all NewBlob instances into ExistingBlobs. */
export function NewToExistingBlobs(properties: CBLDictionary, loader: BlobLoader) {
    _xformBlobs(properties);

    // Recursively replaces blob dicts with ExistingBlob objects in `obj`.
    function _xformBlobs(obj: CBLValue) : ExistingBlob | undefined {
        if (obj instanceof NewBlob) {
            return new ExistingBlob(obj, loader);
        } else if (isArray(obj)) {
            let i = 0;
            for (const v of obj) {
                const blob = _xformBlobs(v);  // recurse
                if (blob)
                    obj[i] = blob;
                ++i;
            }
        } else if (isDictionary(obj)) {
            for (const key of Object.getOwnPropertyNames(obj)) {
                const blob = _xformBlobs(obj[key]);  // recurse
                if (blob)
                    obj[key] = blob;
            }
        }
        return undefined;
    }
}


//////// SEARCHING FOR BLOBS


/** Returns 0 if the dict contains no blobs,
 *          1 if it contains ExistingBlobs,
 *          2 if it contains NewBlobs. */
export function ContainsBlobs(properties: CBLDictionary): 0 | 1 | 2 {
    let result: 0 | 1 | 2 = 0;
    ForEachBlob(properties, (blob, _path) => {
        if (blob instanceof NewBlob) {
            result = 2;
            return false; // no need to continue
        } else {
            result = 1;
            return true;
        }
    });
    return result;
}



/** Looks for a NewBlob with the given digest in a dictionary. */
export function FindNewBlobWithDigest(properties: CBLDictionary, digest: string)
    : NewBlob | undefined {
    let foundBlob: NewBlob | undefined;
    ForEachBlob(properties, (blob, _path) => {
        if (blob.digest === digest && blob instanceof NewBlob) {
            foundBlob = blob;
            return false;
        } else {
            return true;
        }
    });
    return foundBlob;
}


type PathArray = Array<string | number>;
type ForEachBlobCallback = (blob: Blob, path: PathArray) => boolean;

/** Recurses into the doc properties looking for {@link Blob} instances,
 *  and invokes the callback on each one. @internal */
export function ForEachBlob(properties: CBLDictionary, callback: ForEachBlobCallback) {
    const path: PathArray = [];
    function scan(value: CBLValue) : boolean {
        if (isDictionary(value)) {
            path.push(0);
            for (const key of Object.getOwnPropertyNames(value)) {
                path[path.length - 1] = key;
                if (!scan(value[key]))
                    return false;
            }
            path.pop();
        } else if (isArray(value)) {
            let i = 0;
            path.push(0);
            for (const v of value) {
                path[path.length - 1] = i++;
                if (!scan(v))
                    return false;
            }
            path.pop();
        } else if (isBlob(value)) {
            return callback(value, path);
        }
        return true;
    }
    scan(properties);
}


type ForEachBloblikeCallback = (blob: Bloblike)=>void;

/** Recurses into the doc properties looking for blob metadata (dicts containing `"@type":"blob"`),
 *  and invokes the callback on each one. @internal */
export function ForEachBloblike(properties: CBLDictionary, callback: ForEachBloblikeCallback) {
    scan(properties);

    function scan(value: CBLValue) {
        if (isDictionary(value)) {
            if (isBlobDict(value)) {
                callback(value as unknown as Bloblike);
            } else {
                for (const key of Object.getOwnPropertyNames(value))
                    scan(value[key]);
            }
        } else if (isArray(value)) {
            for (const v of value)
                scan(v);
        }
    }
}

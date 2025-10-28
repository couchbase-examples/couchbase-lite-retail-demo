import {type CBLDictionary, asBlob, asArray, isArray, isBlob, isDictionary, asDictionary,
    CopyValue, CopyDict, type RevID, DocID} from "@/database/types";
import {NewBlob, type BlobLoader} from "./blob";
import { ImportBlobs } from "./doc_blobs";
import { ImportDocument, WithShadowAttachments } from "./sync_blobs";
import { describe, test, expect } from "vitest";
import { meta } from "@/database/document.js";
import type { JSONObject } from "@/util/json_types";
import { Database } from "@/couchbase-lite";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);

const SampleData1       = new Uint8Array([0x62, 0x6c, 0x6f, 0x62]);
const SampleData1Digest = NewBlob.computeDigest(SampleData1);
const SampleData2       = new Uint8Array([0x72, 0x6c, 0x6f, 0x62]);
const SampleData2Digest = NewBlob.computeDigest(SampleData2);
const SampleData3       = new Uint8Array([0x82, 0x6c, 0x6f, 0x62]);
const SampleData3Digest = NewBlob.computeDigest(SampleData3);
const SampleData4       = new Uint8Array([0x92, 0x6c, 0x6f, 0x62]);
const SampleData4Digest = NewBlob.computeDigest(SampleData4);

const DigestToData = {
    [SampleData1Digest]: SampleData1,
    [SampleData2Digest]: SampleData2,
    [SampleData3Digest]: SampleData3,
    [SampleData4Digest]: SampleData4,
};


const Props: CBLDictionary = {
    "str": "foobar",
    "num": 1.125,
    "boo": true,
    "nul": null,
    "arr": ["a", "b"],
    "obj": {"a": 1, "b": 2}
};

const PropsWithBlobs: CBLDictionary = {
    "boo": true,
    "nul": null,
    "blb": {"@type":"blob", "digest": SampleData1Digest},
    "arr": ["a", "b", {"@type":"blob", "digest": SampleData2Digest}],
    "obj": {"a": 1, "b": 2, "z": {"@type":"blob", "digest": SampleData3Digest}}
};

const PropsWithAttachments = CopyValue(PropsWithBlobs) as CBLDictionary;
PropsWithAttachments._attachments = {
    "blob_/blb": {"digest": SampleData1Digest, revpos: 1, stub: true},
    "blob_/arr/2": {"digest": SampleData2Digest, revpos: 2, stub: true},
    "blob_/obj/z": {"digest": SampleData3Digest, revpos: 3, stub: true},
    "actualAttachment": {digest: SampleData4Digest, revpos: 4, stub: true}
};

describe("Documents with blobs", () => {

    test("new document without blobs", async () => {
        const db = await Database.open({name: "test", version: 1, collections: {}});
        const d = db.defaultCollection.createDocument(DocID("doc1"), CopyDict(Props));
        // no blobs to import:
        ImportBlobs(d, (_d, _t) => {throw Error("should not be called");});
        expect(d).toStrictEqual(Props);

        // try copying it:
        const dd = meta(d).clone();
        expect(meta(dd).id).toBe("doc1");
        expect(dd).toStrictEqual(Props);
        expect(meta(dd).revisionID).toBeUndefined();
    });


    test("import rev with blobs", async () => {
        const d = CopyDict(PropsWithAttachments) as JSONObject;
        expect(d).toStrictEqual(PropsWithAttachments);

        let loaderCalls = 0;
        const loader: BlobLoader = async (digest, _content_type) => {
            ++loaderCalls;
            const data = DigestToData[digest];
            expect(data).not.toBeUndefined();
            return Promise.resolve(data);
        };

        // Remove underscored properties and convert attachment/blob dicts to Blob objects:
        ImportDocument(d, loader);

        // Inspect the blobs:
        expect(isBlob(d.blb)).toBe(true);
        const arr = d.arr;
        expect(isArray(arr) && isBlob(arr[2])).toBe(true);
        const obj = d.obj;
        expect(isDictionary(obj) && isBlob(obj.z)).toBe(true);

        let b = asBlob(asArray(arr)![2])!;
        expect(b.digest).toBe(SampleData2Digest);
        expect(await b.getContents()).toBe(SampleData2);
        expect(loaderCalls).toBe(1);

        b = asBlob(asDictionary(obj)?.z)!;
        expect(b.digest).toBe(SampleData3Digest);
        expect(await b.getContents()).toBe(SampleData3);
        expect(loaderCalls).toBe(2);

        // Check the leftover attachment in `_attachments`:
        const atts = asDictionary(d._attachments)!;
        expect(atts).not.toBeUndefined();
        expect(Object.getOwnPropertyNames(atts)).toStrictEqual(["actualAttachment"]);
        b = asBlob(atts.actualAttachment)!;
        expect(b.digest).toBe(SampleData4Digest);
        expect(await b.getContents()).toBe(SampleData4);
        expect(loaderCalls).toBe(3);

        // Now prepare the doc for uploading:
        const exported = WithShadowAttachments(d, "1-1111" as RevID);
        const stringy = JSON.stringify(exported, null, 4);
        const parsed = JSON.parse(stringy) as CBLDictionary;
        // Verify that it round-trips to the same JSON we imported way back above:
        expect(parsed).toStrictEqual(PropsWithAttachments);
    });


    test("add blobs to document", async () => {
        const db = await Database.open({name: "test", version: 1, collections: {}});
        const d = db.defaultCollection.createDocument(DocID("doc1"), CopyDict(Props));

        // no blobs to import:
        ImportBlobs(d, (_d, _t) => {throw Error("should not be called");});
        expect(d).toStrictEqual(Props);

        const obj = asDictionary(d.obj)!;
        obj["nuu"] = new NewBlob(SampleData2, "application/seekrit");

        const exported = WithShadowAttachments(d, "5-5555" as RevID);
        const stringy = JSON.stringify(exported, null, 4);
        const parsed = JSON.parse(stringy) as CBLDictionary;

        // Create an object that's what we expect the exported document to look like:
        const expectedProps = CopyDict(Props);
        asDictionary(expectedProps.obj)!["nuu"] = {
            "@type": "blob", digest: SampleData2Digest, content_type: "application/seekrit", length: 4
        };
        expectedProps._attachments = {"blob_/obj/nuu": {
            digest: SampleData2Digest, content_type: "application/seekrit", length: 4,
            stub: true, revpos: 5       // <- note the new revpos!
        }};

        expect(parsed).toStrictEqual(expectedProps);
    });

});

//
// database/blob.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { ExistingBlob, NewBlob } from "@/blob/blob";
import { assert } from "@/util/assert";
import { LogCategory } from "@/util/logging";
import { DefaultCollectionName } from "./collection";
import { Database } from "./database";
import type { CBLDocument } from "./document";
import { CopyDict, DocID, isBlob, type CBLDictionary } from "./types";

import { IDBKeyRange, indexedDB } from "fake-indexeddb";
import * as logtape from "@logtape/logtape";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";


Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


beforeAll( async () => {
    await logtape.configure({
        sinks: {
            console: logtape.getConsoleSink({formatter: logtape.ansiColorFormatter}),
        },
        loggers: [
            {
                category: LogCategory,
                lowestLevel: "info",
                sinks: ["console"],
            },
            {
                category: ["logtape", "meta"],
                lowestLevel: "warning",
                sinks: ["console"],
            }
        ],
    });
});

afterAll( async () => {
    await logtape.reset();
});


let db!: Database;


beforeEach( async () => {
    db = await Database.open({
        name: "test",
        version: 1,
        collections: {[DefaultCollectionName]: {indexes: ["name"]}}
    });
});

afterEach( async () => {
    await db.closeAndDelete();
});


const Props: CBLDictionary = {
    "str": "foobar",
    "num": 1.125,
    "boo": true,
    "nul": null,
    "arr": ["a", "b"],
    "obj": {"a": 1, "b": 2}
};


function expectDefined<T>(t: T | undefined): asserts t is T {
    expect(t).toBeDefined();
}


describe("Blobs in Database", () => {

    test("save blobs to database", async () => {
        await testBlobs();
    });

    test("save blobs to encrypted database", async () => {
        await db.changeEncryptionKey("password");
        await testBlobs();
    });

});


async function testBlobs() {
    const testLogger = logtape.getLogger([LogCategory, "test"]);
    const coll = db.defaultCollection;
    const docID = DocID("doc1");
    const blob1Contents = new TextEncoder().encode("This is a test of blobs.");
    const blob2Contents = new TextEncoder().encode("Top secret data here!");

    const checkDoc = async (doc: CBLDocument) => {
        const gotBlob1 = doc.blob1;
        expect(gotBlob1).toBeInstanceOf(ExistingBlob);
        assert(isBlob(gotBlob1));
        expect(gotBlob1.content_type).toBe("text/plain;encoding=utf-8");
        expect(await gotBlob1.getContents()).toEqual(blob1Contents);

        const obj = doc.obj as CBLDictionary;
        const gotBlob2 = obj.blob2 as ExistingBlob;
        expect(gotBlob2).toBeInstanceOf(ExistingBlob);
        assert(isBlob(gotBlob2));
        expect(gotBlob2.content_type).toBe("application/secret");
        expect(await gotBlob2.getContents()).toEqual(blob2Contents);
    };

    {
        testLogger.info("---- Creating document");
        const doc = coll.createDocument(docID, CopyDict(Props));
        doc.blob1 = new NewBlob(blob1Contents, "text/plain;encoding=utf-8");
        const obj = doc.obj as CBLDictionary;
        obj.blob2 = new NewBlob(blob2Contents, "application/secret");
        await coll.save(doc);
        await checkDoc(doc);
    }

    testLogger.info("---- Getting document");
    const gotDoc = await coll.getDocument(docID);
    expectDefined(gotDoc);
    await checkDoc(gotDoc);

    testLogger.info("---- Counting blobs");
    expect(await db.countBlobs()).toBe(2);

    testLogger.info("---- Garbage-collecting blobs");
    expect(await db.performMaintenance('compact')).toBe(0);
    expect(await db.countBlobs()).toBe(2);

    testLogger.info("---- Deleting doc, then GC again");
    await coll.delete(gotDoc);
    expect(await db.performMaintenance('compact')).toBe(2);
    expect(await db.countBlobs()).toBe(0);
}

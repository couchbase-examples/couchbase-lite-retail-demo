// collection.tests.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { indexedDB, IDBKeyRange } from "fake-indexeddb";
import type { Collection, CollectionChange, ConflictHandlerResult, DocumentChange} from "./collection.js";
import { ConflictError, type ConflictHandler, DefaultCollectionName, MultipleConflictsError } from "./collection.js";
import { Database, ReadOnly, ReadWrite } from "./database.js";
import type { CBLDictionary} from "./types.js";
import { DocID } from "./types.js";
import * as logtape from "@logtape/logtape";
import { meta } from "./document.js";
import { canonicalJSONDict } from "./internals.js";
import { ExistingBlob, LogCategory } from "@/couchbase-lite.js";
import { test, describe, expect, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { Timer } from "@/util/timer.js";
import { assert } from "@/util/assert.js";

Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


/** The simple database schema. */
interface MySchema {
    [DefaultCollectionName]: {
        name?: string,
        shoeSize?: number,
        hairColor?: string,
    },
}


let db!: Database<MySchema>;
let coll!: Collection<MySchema[typeof DefaultCollectionName]>;

beforeAll( async () => {
    await logtape.configure({
        sinks: {
            console: logtape.getConsoleSink({formatter: logtape.ansiColorFormatter}),
        },
        loggers: [
            {
                category: LogCategory,
                lowestLevel: "debug",
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


beforeEach( async () => {
    db = await Database.open<MySchema>({
        name: "test",
        version: 1,
        collections: {[DefaultCollectionName]: {indexes: ["name"]}}
    });
    coll = db.defaultCollection;
});

afterEach( async () => {
    await db?.closeAndDelete();
});


function expectDefined<T>(t: T | undefined): asserts t is T {
    expect(t).toBeDefined();
}


describe("Internals", () => {
    test("canonical JSON", () => {
        const body: CBLDictionary = {
            foo: "foo",
            array: [1, 2, {"B": "B", "a": "a"}, 4, 5],
            Blob: new ExistingBlob({digest: "abcd", content_type: "text/plain"}, undefined),
            '@type': "test"
        };
        expect(JSON.stringify(body)).toMatchInlineSnapshot(`"{"foo":"foo","array":[1,2,{"B":"B","a":"a"},4,5],"Blob":{"@type":"blob","content_type":"text/plain","digest":"abcd"},"@type":"test"}"`);
        const canonical = canonicalJSONDict(body);
        expect(canonical).toEqual(body);
        expect(JSON.stringify(canonical)).toMatchInlineSnapshot(`"{"@type":"test","Blob":{"@type":"blob","content_type":"text/plain","digest":"abcd"},"array":[1,2,{"B":"B","a":"a"},4,5],"foo":"foo"}"`);
    });
});


describe("Database", () => {

    test("sanity check", () => {
        expect(db.name).toEqual("test");

        expect(db.collectionNames).toEqual([DefaultCollectionName]);
        expect(coll.name).toBe(DefaultCollectionName);
        expect(db.collections[DefaultCollectionName]).toBe(coll);
        expect(db.collections._default).toBe(coll);
        expect(db.getCollection(DefaultCollectionName)).toBe(coll);
        expect(coll.config).toEqual({indexes: ["name"]});
        expect( () => {db.getCollection("bogus");} ).toThrow("Database test has no collection named 'bogus'");
    });


    test("transaction sanity check", async () => {
        let calls = 0;
        // eslint-disable-next-line @typescript-eslint/require-await
        await db.inTransaction(ReadWrite, [DefaultCollectionName], async () => {
            ++calls;
        });
        expect(calls).toBe(1);

        // eslint-disable-next-line @typescript-eslint/require-await
        await db.inTransaction(ReadOnly, [DefaultCollectionName], async () => {
            ++calls;
        });
        expect(calls).toBe(2);
    });
});


describe("Collection", () => {

    test("counts", async () => {
        expect(await coll.count()).toBe(0);
        expect(await coll.count('deleted')).toBe(0);
        expect(await coll.count('includeDeleted')).toBe(0);

        expect(await coll.lastSequence()).toBe(0);
    });


    test("new untitled doc", () => {
        const doc = coll.createDocument(null, {});
        expect(doc).toEqual({});
        expect(meta(doc).body).toBe(doc);
        expect(meta(doc).id).toMatch(/^-\S{20,40}$/);
        expect(meta(doc).collection).toEqual(coll);
        expect(meta(doc).revisionID).toBeUndefined();
        expect(meta(doc).sequence).toBeUndefined();
    });


    test("new titled doc", () => {
        const doc = coll.createDocument(DocID("foo"), {});
        expect(doc).toEqual({});
        expect(meta(doc).body).toBe(doc);
        expect(meta(doc).id).toBe("foo");
        expect(meta(doc).collection).toEqual(coll);
        expect(meta(doc).revisionID).toBeUndefined();
        expect(meta(doc).sequence).toBeUndefined();
    });


    test("save new doc", async () => {
        const doc = coll.createDocument(DocID("foo"), {name: "Bob", shoeSize: 8});
        expect(doc).toEqual({name: "Bob", shoeSize: 8});
        await coll.save(doc);

        expect(meta(doc).id).toBe("foo");
        expect(meta(doc).collection).toBe(coll);
        expect(doc).toEqual({name: "Bob", shoeSize: 8});
        expectDefined(meta(doc).revisionID);
        expect(meta(doc).revisionID!.startsWith("1-")).toBeTruthy();
        expect(meta(doc).sequence).toBe(1);
        expect(await coll.lastSequence()).toBe(1);

        expect(await coll.count()).toBe(1);
        expect(await coll.count('deleted')).toBe(0);
        expect(await coll.count('includeDeleted')).toBe(1);

        expect(await coll.documentIDs()).toEqual([DocID("foo")]);
        expect(await coll.deletedDocumentIDs()).toEqual([]);

        const readDoc = await coll.getDocument(DocID("foo"));
        expect(readDoc).toEqual(doc);
    });


    test("delete doc", async () => {
        {
            const doc = coll.createDocument(DocID("foo"), {name: "Bob", shoeSize: 8});
            await coll.save(doc);
        }
        {
            const doc = await coll.getDocument(DocID("foo"));
            expectDefined(doc);
            await coll.delete(doc);
        }
        expect(await coll.getDocument(DocID("foo"))).toBeUndefined();
        expect(await coll.count('deleted')).toBe(1);
        expect(await coll.count()).toBe(0);
        expect(await coll.count('includeDeleted')).toBe(1);

        expect(await coll.documentIDs()).toEqual([]);
        expect(await coll.deletedDocumentIDs()).toEqual([DocID("foo")]);
    });


    test("update doc", async () => {
        expect(await coll.count()).toBe(0);
        const doc = coll.createDocument(DocID("foo"), {name: "Bob", shoeSize: 8});
        expect(doc.name).toEqual("Bob");
        await coll.save(doc);

        doc.shoeSize = 9.5;
        expect(doc.shoeSize).toEqual(9.5);
        await coll.save(doc);

        expect(doc).toEqual({name: "Bob", shoeSize: 9.5});
        expectDefined(meta(doc).revisionID);
        expect(meta(doc).revisionID!.startsWith("2-")).toBeTruthy();
        expect(meta(doc).sequence).toBe(2);
        expect(await coll.lastSequence()).toBe(2);

        doc.name = "Steve";
        await coll.save(doc);

        expect(doc).toEqual({name: "Steve", shoeSize: 9.5});
        expectDefined(meta(doc).revisionID);
        expect(meta(doc).revisionID!.startsWith("3-")).toBeTruthy();
        expect(meta(doc).sequence).toBe(3);
        expect(await coll.lastSequence()).toBe(3);

        const readDoc = await coll.getDocument(DocID("foo"));
        expect(readDoc).toEqual(doc);
    });


    test("doc conflict failure", async () => {
        const doc = coll.createDocument(DocID("foo"), {name: "Bob", shoeSize: 8});
        await coll.save(doc);

        // Behind the scenes, something updates the document again:
        const readDoc = await coll.getDocument(DocID("foo"));
        expectDefined(readDoc);
        readDoc.shoeSize = 9.5;
        await coll.save(readDoc);

        // Now try to save `doc` again:
        doc.hairColor = "bald";
        await expect(coll.save(doc)).rejects.toHaveProperty("name", "Conflict");
        expect(await coll.lastSequence()).toBe(2);

        // Use a conflict handler, which will return false to fail:
        let handlerCalled = false;
        const noOpHandler: ConflictHandler = (rev, conflict): ConflictHandlerResult => {
            expect(rev).toBe(doc);
            expect(conflict).toEqual(readDoc);
            handlerCalled = true;
            return 'fail';
        };
        await expect(coll.save(doc, noOpHandler)).rejects.toHaveProperty("name", "Conflict");
        expect(handlerCalled).toBeTruthy();
        expect(await coll.lastSequence()).toBe(2);
    });


    test("doc conflict success", async () => {
        const doc = coll.createDocument(DocID("foo"), {name: "Bob", shoeSize: 8});
        await coll.save(doc);

        // Behind the scenes, something updates the document again:
        const readDoc = await coll.getDocument(DocID("foo"));
        expectDefined(readDoc);
        readDoc.shoeSize = 9.5;
        await coll.save(readDoc);

        doc.hairColor = "bald";

        // This time, use a conflict handler that returns true to save the new rev:
        let handlerCalled = false;
        const overwriteHandler: ConflictHandler = (rev, conflict) => {
            expect(rev).toBe(doc);
            expect(conflict).toEqual(readDoc);
            rev.conflictHandled = true;
            handlerCalled = true;
            return 'replace';
        };
        await coll.save(doc, overwriteHandler);
        expect(handlerCalled).toBeTruthy();

        expect(doc).toEqual({name: "Bob", shoeSize: 8, hairColor: "bald", conflictHandled: true});
        expect(doc).toEqual({name: "Bob", shoeSize: 8, hairColor: "bald", conflictHandled: true});
        expectDefined(meta(doc).revisionID);
        expect(meta(doc).revisionID!.startsWith("3-")).toBeTruthy();
        expect(meta(doc).sequence).toBe(3);
        expect(await coll.lastSequence()).toBe(3);
    });


    test("updateMultiple", async () => {
        // Bulk-insert 3 docs:
        let docs = [
            coll.createDocument(DocID("doc0"), {name: "doc0", shoeSize: 8}),
            coll.createDocument(DocID("doc1"), {name: "doc1", shoeSize: 9}),
            coll.createDocument(DocID("doc2"), {name: "doc2", shoeSize: 10})
        ];
        await coll.updateMultiple({save: docs});
        expect(await coll.count()).toBe(3);
        for (const doc of docs) {
            expectDefined(meta(doc).sequence);
            expectDefined(meta(doc).revisionID);
            expect(meta(doc).revisionID!.startsWith("1-")).toBeTruthy();
        }

        {
            // Save a new rev of "doc0", to produce a conflict later:
            const otherDoc0 = await coll.getDocument(DocID("doc0"));
            expectDefined(otherDoc0);
            otherDoc0.shoeSize = 8.5;
            await coll.save(otherDoc0);
        }

        for (let bestEffort = 0; bestEffort <= 1; ++bestEffort) {
            // Try to update docs 0 and 1, and delete doc 2:
            docs[0].hairColor = "red";
            docs[1].hairColor = "green";
            let error;
            try {
                await coll.updateMultiple({
                    save: [docs[0], docs[1]],
                    delete: [docs[2]],
                    bestEffort: (bestEffort !== 0)
                });
            } catch (x) {
                error = x;
            }

            // This fails due to a conflict in doc 1:
            expect(error).toBeInstanceOf(MultipleConflictsError);
            assert(error instanceof MultipleConflictsError);
            expect(Array.from(error.errors.keys())).toEqual(["doc0"]);
            const error1 = error.errors.get(DocID("doc0"));
            expect(error1).toBeInstanceOf(ConflictError);

            if (bestEffort === 0) {
                // without bestEffort, no doc was updated:
                for (const doc of docs)
                    expect(meta(doc).revisionID!.startsWith("1-")).toBeTruthy();
            } else {
                // with bestEffort, the other two docs updated:
                expect(meta(docs[0]).revisionID!.startsWith("1-")).toBeTruthy();
                expect(meta(docs[1]).revisionID!.startsWith("2-")).toBeTruthy();
                expect(meta(docs[2]).revisionID!.startsWith("2-")).toBeTruthy();
            }
        }
    });


    test("doc expiration", async () => {
        db.enableAutoExpiry = false;

        const doc1 = coll.createDocument(DocID("doc1"), {});
        await coll.save(doc1);
        const doc2 = coll.createDocument(DocID("doc2"), {});
        await coll.save(doc2);
        const doc3 = coll.createDocument(DocID("doc3"), {});
        await coll.save(doc3);

        expect(await coll.getDocumentExpiration(doc1)).toBeUndefined();
        expect(await coll.getDocumentExpiration(DocID("doc2"))).toBeUndefined();
        expect(await coll.nextExpirationTime()).toBeUndefined();
        expect(await coll.expireDocs()).toBe(0);

        await coll.setDocumentExpiration(doc1, undefined);
        expect(await coll.getDocumentExpiration(doc1)).toBeUndefined();

        // Make doc1 expire in 100ms:
        const startTime = Date.now();
        await coll.setDocumentExpiration(doc1, 100);
        const expDate1 = await coll.getDocumentExpiration(doc1);
        expectDefined(expDate1);
        expect(Math.abs(expDate1.getTime() - startTime - 100)).toBeLessThan(100);
        const nextExpTime = await coll.nextExpirationTime();
        expect(nextExpTime).toEqual(expDate1.getTime());

        // Make doc1 expire in 500ms:
        const expDate2 = new Date(startTime + 500);
        await coll.setDocumentExpiration(doc2, new Date(startTime + 500));
        expect(await coll.getDocumentExpiration(doc2)).toEqual(expDate2);

        // Next expiration is still doc1 in 100ms:
        expect(await coll.nextExpirationTime()).toEqual(nextExpTime);

        // Wait for doc1 to expire:
        let n;
        do {
            n = await coll.expireDocs();
        } while (n === 0);
        expect(n).toBe(1);
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(100);
        expect(Date.now() - startTime).toBeLessThanOrEqual(400);

        // Verify doc1 was purged:
        expect(await coll.getDocument(DocID("doc1"))).toBeUndefined();
        expect(await coll.count('includeDeleted')).toBe(2);

        // Next expiration is doc2:
        expect(await coll.nextExpirationTime()).toEqual(expDate2.getTime());

        // Wait for doc2 to expire:
        do {
            n = await coll.expireDocs();
        } while (n === 0);
        expect(n).toBe(1);
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(500);
        expect(Date.now() - startTime).toBeLessThanOrEqual(900);

        // Verify doc2 was purged:
        expect(await coll.getDocument(DocID("doc2"))).toBeUndefined();
        expect(await coll.count('includeDeleted')).toBe(1);

        // Verify there are no more docs to expire:
        expect(await coll.nextExpirationTime()).toBeUndefined();
        expect(await coll.expireDocs()).toBe(0);
    });


    test("doc auto-expiration", async () => {
        // This time we don't turn off `db.enableAutoExpiry`
        const doc1 = coll.createDocument(DocID("doc1"), {});
        await coll.save(doc1);
        const doc2 = coll.createDocument(DocID("doc2"), {});
        await coll.save(doc2);
        const doc3 = coll.createDocument(DocID("doc3"), {});
        await coll.save(doc3);

        // Set expiration times:
        const startTime = Date.now();
        await coll.setDocumentExpiration(doc1, 200);
        await coll.setDocumentExpiration(doc2, 400);

        // Wait for doc1 to expire:
        do {
            await Timer.sleep(10);
        } while (await coll.getDocument(DocID("doc1")) !== undefined);
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(200);
        expect(Date.now() - startTime).toBeLessThanOrEqual(400);
        expect(await coll.getDocument(DocID("doc2"))).toBeDefined();

        // Wait for doc2 to expire:
        do {
            await Timer.sleep(10);
        } while (await coll.getDocument(DocID("doc2")) !== undefined);
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(400);
        expect(Date.now() - startTime).toBeLessThanOrEqual(1000);

        // That's all, folks:
        expect(await coll.getDocument(DocID("doc3"))).toBeDefined();
        expect(await coll.nextExpirationTime()).toBeUndefined();
    });


    test("save encrypted doc", async () => {
        const Foo = DocID("foo");
        await db.changeEncryptionKey("password123");    // Indexed property "name" is excluded

        const doc = coll.createDocument(Foo, {name: "Bob", shoeSize: 8});
        await coll.save(doc);

        // Inspect the LocalRevision without decrypting it:
        const rev = await coll.getRevision(Foo, false);
        expect(rev?.body).toEqual({name: "Bob"});   // encrypted property is not accessible
        expect(rev?.encrypted).toBeDefined();

        // Get the doc normally:
        const readDoc = await coll.getDocument(Foo);
        expect(readDoc).toEqual(doc);

        db.lock();
        await expect( coll.getDocument(Foo) ).rejects.toThrow("Cannot decrypt without key");

        expect(await db.unlock("duhh")).toBeFalsy();
        expect(await db.unlock("password123")).toBeTruthy();
        expect(await coll.getDocument(Foo)).toEqual({name: "Bob", shoeSize: 8});

        // Try closing & reopening the database:
        db.close();
        await expect( db.reopen() ).rejects.toThrow("Incorrect or missing database password");
        await db.reopen("password123");
        coll = db.collections._default;
        expect(await coll.getDocument(Foo)).toEqual({name: "Bob", shoeSize: 8});

    }, {timeout: 10000});
    // Note: Putting the options arg after the callback is deprecated in vitest,
    // but Bun 1.2 doesn't support the new signature, so we're leaving it at the end.


    test("save doc then encrypt", async () => {
        // Create a document:
        const Foo = DocID("foo");
        const doc = coll.createDocument(Foo, {name: "Bob", shoeSize: 8});
        await coll.save(doc);

        // Then encrypt the database:
        await db.changeEncryptionKey("password123");

        expect(coll.property("name").encrypted).toBeFalsy();
        expect(coll.property("shoeSize").encrypted).toBeTruthy();
        expect(coll.property("some.path").encrypted).toBeTruthy();

        // Inspect the LocalRevision without decrypting it:
        let rev = await coll.getRevision(Foo, false);
        expect(rev?.body).toEqual({name: "Bob"});   // encrypted property is not accessible
        expect(rev?.encrypted).toBeDefined();

        // Get the doc normally:
        let readDoc = await coll.getDocument(Foo);
        expect(readDoc).toEqual(doc);

        // Change the password:
        await db.changeEncryptionKey("drowssap");

        rev = await coll.getRevision(Foo, false);
        expect(rev?.body).toEqual({name: "Bob"});   // encrypted property is not accessible
        expect(rev?.encrypted).toBeDefined();

        readDoc = await coll.getDocument(Foo);
        expect(readDoc).toEqual(doc);

        // Now decrypt the collection:
        await db.decrypt();

        rev = await coll.getRevision(Foo, false);
        expect(rev?.encrypted).toBeUndefined();
        expect(rev?.body).toEqual({name: "Bob", shoeSize: 8});

        readDoc = await coll.getDocument(Foo);
        expect(readDoc).toEqual(doc);

        expect(coll.property("name").encrypted).toBeFalsy();
        expect(coll.property("shoeSize").encrypted).toBeFalsy();
        expect(coll.property("some.path").encrypted).toBeFalsy();
    });


    test("change listener", async () => {
        // NOTE: Any change to the revID generation algorithm will require updating the snapshots.

        // Add a collection listener:
        let eventCount = 0;
        let lastChange: CollectionChange | undefined;
        coll.addChangeListener(change => {
            console.log(change);
            ++eventCount;
            lastChange = change;
        });

        // Add a document listener on "doc2":
        let docEventCount = 0;
        let lastDocChange: DocumentChange | undefined;
        const docListener = (change: DocumentChange) => {
            console.log("Document: ", change);
            ++docEventCount;
            lastDocChange = change;
        };
        let token = coll.addDocumentChangeListener(DocID("doc2"), docListener);

        // Outside a transaction, notify immediately:
        const doc0 = coll.createDocument(DocID("doc0"), {});
        expect(eventCount).toBe(0);
        expect(docEventCount).toBe(0);

        await coll.save(doc0);
        expect(eventCount).toBe(1);
        expect(lastChange).toMatchInlineSnapshot(`
          Map {
            "doc0" => {
              "id": "doc0",
              "rev": "1-a5bb2524156f3e56dcc4e5c52c73c46f82c2efb0",
              "sequence": 1,
            },
          }
        `);
        lastChange = undefined;
        expect(docEventCount).toBe(0);

        // Transaction should not notify until it's committed:
        await coll.inTransaction(ReadWrite, async () => {
            const doc1 = coll.createDocument(DocID("doc1"), {});
            await coll.save(doc1);
            expect(eventCount).toBe(1);
            const doc2 = coll.createDocument(DocID("doc2"), {});
            await coll.save(doc2);
            expect(eventCount).toBe(1);
            const doc3 = coll.createDocument(DocID("doc3"), {});
            await coll.save(doc3);
            expect(eventCount).toBe(1);
        });
        expect(eventCount).toBe(2);
        expect(lastChange).toMatchInlineSnapshot(`
          Map {
            "doc1" => {
              "id": "doc1",
              "rev": "1-a5bb2524156f3e56dcc4e5c52c73c46f82c2efb0",
              "sequence": 2,
            },
            "doc2" => {
              "id": "doc2",
              "rev": "1-a5bb2524156f3e56dcc4e5c52c73c46f82c2efb0",
              "sequence": 3,
            },
            "doc3" => {
              "id": "doc3",
              "rev": "1-a5bb2524156f3e56dcc4e5c52c73c46f82c2efb0",
              "sequence": 4,
            },
          }
        `);

        expect(docEventCount).toBe(1);
        expect(lastDocChange).toMatchInlineSnapshot(`
          {
            "id": "doc2",
            "rev": "1-a5bb2524156f3e56dcc4e5c52c73c46f82c2efb0",
            "sequence": 3,
          }
        `);

        // Aborted transaction should not notify:
        await expect( coll.inTransaction(ReadWrite, async () => {
            const doc4 = coll.createDocument(DocID("doc4"), {});
            await coll.save(doc4);
            expect(eventCount).toBe(2);
            throw Error("abort");
        }) ).rejects.toThrowError("abort");
        expect(await coll.getDocument(DocID("doc4"))).toBeUndefined();
        expect(eventCount).toBe(2);
        expect(docEventCount).toBe(1);

        // Remove document listener, then update the doc it was listening to:
        token.remove();
        {
            const doc2 = (await coll.getDocument(DocID("doc2")))!;
            await coll.delete(doc2);
        }
        expect(eventCount).toBe(3);
        expect(lastChange).toMatchInlineSnapshot(`
          Map {
            "doc2" => {
              "deleted": true,
              "id": "doc2",
              "rev": "2-99935bb02b100cbffcd7d7f96b2a4794782096b9",
              "sequence": 5,
            },
          }
        `);
        expect(docEventCount).toBe(1);
    });
});

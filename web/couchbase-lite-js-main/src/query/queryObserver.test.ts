//
// query/queryObserver.test.ts
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
import { Database, DocID, LogCategory, Query } from "@/couchbase-lite";
import { Airlines, CreateTravelDB, type TravelSchema } from "./common.test";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import * as logtape from "@logtape/logtape";
import type { QueryResult } from "./query";
import { MainLogger } from "@/util/logging";
import { Timer } from "@/util/timer";

Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


let db!: Database<TravelSchema>;

beforeEach( async () => {
    db = await CreateTravelDB();
});

afterEach( async () => {
    await db?.closeAndDelete();
});


async function startLogging(): Promise<void> {
    await logtape.configure({
        sinks: {
            console: logtape.getConsoleSink({formatter: logtape.ansiColorFormatter}),
        },
        loggers: [
            {category: LogCategory, lowestLevel: "debug", sinks: ["console"]},
            {category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"]}
        ],
    });
}

afterEach( async () => {
    await logtape.reset();
});


describe("Query Observer", () => {

    test("called after a change", async () => {
        const airlines = db.collections.airlines;
        await startLogging();
        let query = new Query(db, `SELECT * FROM airlines WHERE meta().id like "airline_%"`);
        expect(query.collections()).toEqual(new Set([airlines]));
        expect((await query.execute()).length).toBe(Airlines.length);

        let calls = 0;
        let {promise, resolve} = Promise.withResolvers<QueryResult[]>();
        using _token = query.addChangeListener( results => {
            ++calls;
            MainLogger.info `Query change listener call #${calls}!`;
            resolve(results);
        });

        await airlines.save(airlines.createDocument(DocID("airline_1000000")));
        await airlines.save(airlines.createDocument(DocID("airline_1000001")));

        const results = await promise;
        MainLogger.info `Resolved query promise!`;
        expect(results.length).toBe(Airlines.length + 2);
        expect(calls).toBe(1);
    });

    test("not called when results don't change", async () => {
        const airlines = db.collections.airlines;
        await startLogging();
        let query = new Query(db, `SELECT * FROM airlines WHERE meta().id like "airline_%"`);
        expect(query.collections()).toEqual(new Set([airlines]));

        let calls = 0;
        let {promise, resolve} = Promise.withResolvers<QueryResult[]>();
        using _token = query.addChangeListener( results => {
            ++calls;
            MainLogger.info `Query change listener call #${calls}!`;
            resolve(results);
        });

        await airlines.save(airlines.createDocument(DocID("TEMP 1")));
        await Timer.sleep(100);
        await airlines.save(airlines.createDocument(DocID("TEMP 2")));

        const delay = new Timer(2000).wait();

        const results = await Promise.race([promise, delay]);
        expect(results).toBeUndefined();
        expect(calls).toBe(0);
    });

    test("not called after removed", async () => {
        const airlines = db.collections.airlines;
        await startLogging();
        let query = new Query(db, `SELECT * FROM airlines WHERE meta().id like "airline_%"`);
        expect(query.collections()).toEqual(new Set([airlines]));

        let calls = 0;
        let {promise, resolve} = Promise.withResolvers<QueryResult[]>();
        using token = query.addChangeListener( results => {
            ++calls;
            MainLogger.info `Query change listener call #${calls}!`;
            resolve(results);
        });

        await Timer.sleep(1000);
        token.remove();

        await airlines.save(airlines.createDocument(DocID("TEMP 1")));
        await Timer.sleep(100);
        await airlines.save(airlines.createDocument(DocID("TEMP 2")));

        const delay = new Timer(2000).wait();

        const results = await Promise.race([promise, delay]);
        expect(results).toBeUndefined();
        expect(calls).toBe(0);
    });

});

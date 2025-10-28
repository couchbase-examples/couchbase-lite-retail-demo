//
// examples/sync_collections_node.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { type Collection, Database, type DocumentEnded, LogCategory, Replicator, type ReplicatorCollectionConfig, type ReplicatorStatus } from "@/couchbase-lite";
import { assertEqual } from "@/util/assert";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";
import * as logtape from "@logtape/logtape";

//-------- INSTRUCTIONS:
//
// This tests replication in a server environment (node.js).
// Since IndexedDB is not available, it uses the "fake-indexeddb" package;
// this database is ephemeral, since it's only for testing purposes.
//
// To run, first configure the constants below under "CONFIGURATION".
// Then:
//      bun run examples/sync_collections_node.ts
// or:
//      tsc && node build/examples/sync_collections_node.js
//
//-------- CONFIGURATION:
//
// The Travel Sample database must be available from Sync Gateway at this URL.
// It must be in collection-per-type form, with five collections "inventory.airline",
// "inventory.airport", "inventory.hotel", "inventory.landmark", "inventory.route".
const ServerPullURL = "ws://localhost:4985/travel";

// If `ServerPushURL` is defined, the test will then push its database to that URL:
const ServerPushURL = undefined; // "ws://localhost:4987/travel";

const ContinuousPull = false;   // Set to true for continuous pull (will not push)
const ContinuousPush = false;   // Set to true for continuous push
//--------


// Configure Dexie for use with fake-indexeddb:
Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


// Configure logtape library to log to the console:
async function ConfigureLogging(level: "debug" | "trace" | "info" | "warning" | "error") {
    await logtape.configure({
        sinks: {
            console: logtape.getConsoleSink({formatter: logtape.ansiColorFormatter}),
        },
        loggers: [
            {
                category: LogCategory,
                lowestLevel: level,
                sinks: ["console"],
            },
            {
                category: "EXAMPLE",
                lowestLevel: "info",
                sinks: ["console"],
            },
            {
                category: ["logtape", "meta"],
                lowestLevel: "warning",
                sinks: ["console"],
            }
        ],
        reset: true,
    });
}

const Logger = logtape.getLogger("EXAMPLE");


async function run() {
    await ConfigureLogging('warning');

    using DB = await Database.open({
        name: "travel-sample",
        version: 1,
        collections: {
            "inventory.airline":  { },
            "inventory.airport":  { },
            "inventory.hotel":    { },
            "inventory.landmark": { },
            "inventory.route":    { },
        }
    });

    function onStatusChange(p: ReplicatorStatus) {
        if (p.pulledRevisions !== undefined)
            Logger.info `Status: ${p.status}; pulled ${p.pulledRevisions} docs`;
        else if (p.pushedRevisions !== undefined)
            Logger.info `Status: ${p.status}; pushed ${p.pushedRevisions} docs`;
        else
            Logger.info `Status: ${p.status}`;
    }

    function onDocuments(collection: Collection, dir: 'push' | 'pull', docs: DocumentEnded[]) {
        Logger.debug `Collection ${collection.name} ${dir}ed ${docs.length} documents`;
    }

    async function logTotals(): Promise<number> {
        let total = 0;
        let totals: Record<string,number> = {};
        for (const name of DB.collectionNames) {
            const coll = DB.getCollection(name);
            const n = await coll.count('includeDeleted');
            totals[name] = n;
            total += n;
        }
        Logger.info `Total of ${total} docs: ${JSON.stringify(totals)}`;
        return total;
    }

    await logTotals();

    try {
        // Pull phase:
        {
            Logger.error("Starting " + (ContinuousPull ? "continuous" : "one-shot") + " pull...");
            const start = Date.now();
            const collectionSettings: ReplicatorCollectionConfig = {
                pull: {continuous: ContinuousPull}
            };
            const replicator = new Replicator({
                database: DB,
                url: ServerPullURL,
                collections: {
                    "inventory.airline":    collectionSettings,
                    "inventory.airport":    collectionSettings,
                    "inventory.hotel":      collectionSettings,
                    "inventory.landmark":   collectionSettings,
                    "inventory.route":      collectionSettings,
                }
            });
            replicator.onStatusChange = onStatusChange;
            replicator.onDocuments = onDocuments;
            await replicator.run();

            Logger.info `Done! Pull took ${Date.now() - start}ms`;
            const numDocs = await logTotals();
            assertEqual(numDocs, 31591, "revs pulled");

            Logger.info `Pulling again...`;
            await replicator.run();
            assertEqual(replicator.status.pulledRevisions, 0, "revs pulled on 2nd try");
        }

        // Push phase:
        if (ServerPushURL) {
            const start = Date.now();
            await ConfigureLogging('debug');
            Logger.error("Starting " + (ContinuousPush ? "continuous" : "one-shot") + " push...");
            const collectionSettings: ReplicatorCollectionConfig = {
                push: {continuous: ContinuousPush}
            };
            const replicator = new Replicator({
                database: DB,
                url: ServerPushURL,
                collections: {
                    "inventory.airline":    collectionSettings,
                    "inventory.airport":    collectionSettings,
                    "inventory.hotel":      collectionSettings,
                    "inventory.landmark":   collectionSettings,
                    "inventory.route":      collectionSettings,
                }
            });
            replicator.onStatusChange = onStatusChange;
            replicator.onDocuments = onDocuments;
            await replicator.run();

            Logger.info `Done! Push took ${Date.now() - start}ms`;
            Logger.info `Status is ${replicator.status}`;
            assertEqual(replicator.status.pushedRevisions, 31591, "revs pushed");
        }

    } catch (x) {
        console.error("Fatal error!", x);
        return;
    }
}

void(run());

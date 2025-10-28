//
// examples/browser.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

// To run:
//     bun dev
// Then open http://localhost:5173/example.html
// To make the "Load Sample" button work, unzip public/travel-sample.zip.

import { Database, DocID, N1QLParseError, Replicator, type ReplicatorConfig, type ReplicatorCollectionConfig, type ReplicatorStatus, LogCategory, type DatabaseConfig, type CBLDictionary, type JSONObject } from "@/couchbase-lite";
import * as logtape from "@logtape/logtape";


async function InitLogging() {
    await logtape.configure({
        sinks: {
            console: logtape.getConsoleSink(),
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
}


/* The database schema. Keys are collection names, values are their document types. */
interface DBSchema {
    "inventory.airline":    CBLDictionary,
    "inventory.airport":    CBLDictionary,
    "inventory.hotel":      CBLDictionary,
    "inventory.landmark":   CBLDictionary,
    "inventory.route":      CBLDictionary,
}

const DBConfig: DatabaseConfig<DBSchema> = {
    name: "travel-sample",
    version: 3,
    collections:  {
        "inventory.airline":    {indexes: [ "name", "icao"] },
        "inventory.airport":    {indexes: [ "airportname", "icao", "iata"] },
        "inventory.hotel":      {indexes: [ "country"] },
        "inventory.landmark":   {indexes: [ "country"] },
        "inventory.route":      {indexes: [ "airlineid"] },
    }
};


let DB!: Database<DBSchema>;


let Start               = Date.now();
let Progress!           : HTMLElement;
let DBStatus!           : HTMLElement;
let Status!             : HTMLElement;
let Elapsed!            : HTMLElement;
let EraseButton!        : HTMLButtonElement;
let ReloadButton!       : HTMLButtonElement;
let QueryInput!         : HTMLTextAreaElement;
let QueryExplanation!   : HTMLElement;
let QueryButton!        : HTMLButtonElement;

function timeElapsed() {
    return (Date.now() - Start) / 1000;
}

function UpdateElapsed() {
    Elapsed.innerText = `${timeElapsed()}`;
}
function LogStatus(message: string) {
    console.log(`[${timeElapsed()}] Displaying status: ${message}`);
    Status.innerText = message;
    UpdateElapsed();
}
function LogProgress(message: string) {
    console.log(`Displaying progress: ${message}`);
    Progress.innerText = message;
    UpdateElapsed();
}


async function UpdateDBStatus() {
    let n = 0;
    let counts: Record<string,number> = {};
    for (const name of DB.collectionNames) {
        const count = await DB.collections[name].count();
        n += count;
        counts[name] = count;
    }
    const status = `${n} documents — ${JSON.stringify(counts, undefined, 1)}`;
    console.log(status);
    DBStatus.innerText = status;
}


async function LoadTravelSample() {
    console.log("Loading travel-sample database from local JSON...");
    ReloadButton.disabled = true;
    EraseButton.disabled = true;
    for (const name of DB.collectionNames) {
        const collection = DB.collections[name];
        const suffix = name.split('.')[1];
        const response = await fetch(`/travel-sample/${suffix}s.json`);
        const lines = (await response.text()).trim().split('\n');
        const docs = lines.map( line => {
            const body = JSON.parse(line) as JSONObject;
            const id = DocID(body._id as string);
            delete body._id;
            return collection.createDocument(id, body);
        });
        await collection.updateMultiple({save: docs});
        console.log(`Loaded ${lines.length} documents into ${name}`);
        await UpdateDBStatus();
    }
    ReloadButton.disabled = false;
    EraseButton.disabled = false;
}

//////// QUERY / TABLE:


async function createTable() {
    const table = document.getElementById("table")! as HTMLTableElement;
    const rows = new Array<HTMLElement>();
    const countElem = document.getElementById("airlineCount")!;
    let elapsed;

    try {
        QueryButton.disabled = true;
        let query = DB.createQuery(QueryInput.value);

        QueryExplanation.innerText = query.explanation;

        let columnNames = query.columnNames;

        countElem.innerText = "Querying...";
        console.log("Running query...");
        const start = Date.now();
        await query.execute( row => {
            if (rows.length === 0) {
                // Before the first table row, create the table head with the columns:
                if (columnNames.some( name => name.endsWith(".*") )) {
                    // Document properties will appear as columns, so use ones from 1st row:
                    columnNames = Object.getOwnPropertyNames(row).sort();
                }
                let headRow = document.createElement("tr");
                for (const alias of columnNames) {
                    let th = document.createElement("th");
                    th.textContent = alias;
                    th.scope = "col";
                    th.align = "left";
                    headRow.appendChild(th);
                }
                let head = document.createElement("thead");
                head.appendChild(headRow);
                rows.push(head);
            }

            // Create a table row:
            const tableRow = document.createElement("tr");
            for (const alias of columnNames) {
                let value = row[alias];
                if (value === undefined)
                    value = "MISSING";
                else if (typeof value !== 'string')
                    value = JSON.stringify(value);
                const tableCell = document.createElement("td");
                tableCell.textContent = value;
                tableRow.appendChild(tableCell);
            }
            rows.push(tableRow);
        });
        elapsed = (Date.now() - start) / 1000;
        console.log(`...query took ${elapsed} sec`);
    } catch (x) {
        QueryInput.focus();
        if (x instanceof N1QLParseError && x.sourceRange)
            QueryInput.setSelectionRange(x.sourceRange[0], x.sourceRange[1]);
        alert(`Query error: ${x}`);
        return;
    } finally {
        QueryButton.disabled = false;
    }

    table.replaceChildren(...rows);

    countElem.innerText = `${Math.max(rows.length - 1, 0)} rows in ${elapsed} sec`;
}


async function initialize() {
    await InitLogging();

    DB = await Database.open(DBConfig);

    let persistenceMsg: string;
    if (navigator.storage && navigator.storage.persist) {
        if (await navigator.storage.persist())
            persistenceMsg = "Storage will not be cleared except by explicit user action";
        else
            persistenceMsg = "Storage may be cleared by the browser under storage pressure.";
        document.getElementById("persistence")!.innerText = persistenceMsg;
    }

    Status = document.getElementById("status")!;
    DBStatus = document.getElementById("db")!;
    Progress = document.getElementById("progress")!;
    Elapsed = document.getElementById("elapsed")!;

    EraseButton = document.getElementById("erase")! as HTMLButtonElement;
    ReloadButton = document.getElementById("load-sample")! as HTMLButtonElement;

    QueryInput = document.getElementById("query")! as HTMLTextAreaElement;
    QueryExplanation = document.getElementById("explanation")!;
    QueryButton = document.getElementById("runQuery")! as HTMLButtonElement;

    QueryButton.onclick = _event => void(createTable());

    EraseButton.onclick = async function() {
        await DB.closeAndDelete();
        await DB.reopen();
        await UpdateDBStatus();
        await createTable();
    };

    ReloadButton.onclick = async function() {
        await DB.closeAndDelete();
        await DB.reopen();
        await LoadTravelSample();
        await UpdateDBStatus();
        await createTable();
    };

    await UpdateDBStatus();
    await createTable();
}
document.addEventListener("DOMContentLoaded", () => void(initialize()));


//////// REPLICATION:


function onStatusChange(p: ReplicatorStatus) {
    if (p.status)
        LogStatus(p.status);
    if (p.pulledRevisions !== undefined)
        LogProgress(`Pulled ${p.pulledRevisions} docs`);
    else if (p.pushedRevisions !== undefined)
        LogProgress(`Pushed ${p.pushedRevisions} docs`);
}


function createReplicator(serverURL: string, collectionConfig: ReplicatorCollectionConfig): Replicator {
    let config: ReplicatorConfig = {
        database: DB,
        url: serverURL,
        collections: {},
    };
    for (const name of DB.collectionNames)
        config.collections[name] = collectionConfig;
    let replicator = new Replicator(config);
    replicator.onStatusChange = onStatusChange;
    return replicator;
}


document.getElementById("start_pull")!.onclick = async function() {
    const serverURL = (document.getElementById("pull_url") as HTMLInputElement).value;
    Start = Date.now();
    LogStatus(`Connecting to <${serverURL}> for pull...`);

    try {
        let replicator = createReplicator(serverURL, {pull: {}});
        await replicator.run();

        LogStatus(`Done! Got ${replicator.status.pulledRevisions} revisions`);
        await UpdateDBStatus();
        if (replicator.status.pulledRevisions)
            await createTable();
    } catch (x) {
        LogStatus(`Error: ${x}`);
    }
};


document.getElementById("start_push")!.onclick = async function() {
    const serverURL = (document.getElementById("push_url") as HTMLInputElement).value;
    Start = Date.now();
    LogStatus(`Connecting to <${serverURL}> for push...`);

    try {
        let replicator = createReplicator(serverURL, {push: {}});
        await replicator.run();

        LogStatus(`Done! Pushed ${replicator.status.pushedRevisions} docs.`);
    } catch (x) {
        LogStatus(`Error: ${x}`);
    }
};

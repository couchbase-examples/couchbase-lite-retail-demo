//
// query/n1ql_test_suite.ts
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
import type { Collection, CBLDocument, JSONObject } from "@/couchbase-lite";
import { Database, DocID } from "@/couchbase-lite";
import { N1QLParseError } from "@/query/N1QLParser";
import { assert, check } from "@/util/assert";

import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import { describe, test, expect } from "vitest";

//-------- INSTRUCTIONS:
// These tests use a large (24MB) set of test files from Server's N1QL test suite.
// The tests will be skipped unless these exist at the relative path given in `DataDir`.
// You can get these by cloning or downloading from:
// https://github.com/couchbase/query/tree/master/test/filestore/test_cases

const DataDir = "../vendor/query-master/test/filestore/test_cases";

// See also @borrrden's N1QL tester for LiteCore:
// https://github.com/couchbaselabs/mobile-n1ql-tester


// Initializes CBL to use FakeIndexedDB:
Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


// We have to skip a lot of the tests because they use N1QL features not implemented by CBL.
// The `GlobalWhiteList` specifies which tests to run.

type TestWhitelist = {skip?: number[], only?: number[]}
type SuiteWhitelist = Record<string,TestWhitelist>;

const GlobalWhitelist: Record<string,SuiteWhitelist> = {
    "aggregate_functions": {
        "distinct": {skip: [
            2,      // agg(DISTINCT x)
            3,      // agg(DISTINCT x)
            4,      // agg(DISTINCT x)
            9,      // agg(DISTINCT x)
        ]},
        "group_by_having": {skip: [
            5,      // GROUP BY ... AS      (LiteCore's N1QL grammar doesn't support this either)
        ]},
        "median_stddev_variance": {only: []},    // MEDIAN(), STDDEV()
    },
    "alias_functions": { },
    "any_functions": { },
    "array_functions": {
        "array": {skip: [
            1,       // ARRAY sale FOR sale IN orderlines END ...
            2,       // ARRAY sale FOR sale IN orderlines END ...
            3,       // ARRAY sale FOR sale IN orderlines END ...
            4,       // ARRAY sale FOR sale IN orderlines END ...
            6,       // ARRAY sale FOR sale IN orderlines END ...
            7,       // ARRAY sale FOR sale IN orderlines END ...
            8,       // orderlines[0:2]
            9,       // orderlines[0:2]
            10,      // orderlines[0:2]
            11,      // ARRAY_APPEND
            12,      // ARRAY_PREPEND
            13,      // ARRAY...FOR...END
            14,      // ARRAY...FOR...END
            15,      // ARRAY...FOR...END
            16,      // ARRAY...FOR...END
        ]},
        "func_array": {only: [4, 8, 11, 17]}    // Lots of array fns and ARRAY...FOR operator
    },
    // "bitwise_functions" skipped
    "case_functions": { },
    "comp_functions": {
        "func_comp": {skip: [
            10,      // from ([{"b":"abc123","c":null}])
        ]}
    },
    "conditional_unkn_functions": {
        "func_cond_unkn": {skip: [
            15,      // NVL()
            16,      // NVL()
            17,      // NVL2()
            18,      // DECODE()
            19,      // DECODE()
            20,      // DECODE()
            21,      // DECODE()
            22,      // DECODE()
        ]}
    },
    // "crypto_functions" skipped
    "date_functions": {
        "func_date": {only: [
            //TODO: cases 8-20 should pass
            21,
            //TODO: 73
            74,
            //TODO: 77, 78, 79
            80,
            81,
            //TODO: 82
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            //TODO: 98, 113, 114, 116
            135,
            136,
            140
        ]}
    },
    // "error_cases" skipped -- USE KEYS
    "from_functions": {
        "from": {},
        "from-over": {only: []},    // UNNEST
    },
    "integers": {
        "select": {}
    },
    // "joins" skipped -- ON KEYS, USE KEYS
    // "json_functions" skipped
    // "key_functions" skipped
    "meta_functions": {
        "meta": {skip: [
            2,       // BASE64()
            3,       // BASE64_DECODE()
            4,       // DECODE_BASE64()
            5,       // DS_VERSION()
        ]}
    },
    "number_functions": {
        "expression": {},
        "func_cond_num": {only: []},    // IfINF(), etc.
        "func_num": {skip: [
            5,       // Test expects string "NaN", but we return a real NaN
            6,       // ??? round(atan(unitPrice/10), 16) coming out wrong
            7,       // rounding differences
            8,       // rounding differences
            11,       // rounding differences
            12,       // rounding differences
            13,       // rounding differences
            14,       // rounding differences
            16,       // rounding differences
            38,       // RANDOM()
            39,       // It thinks ROUND(12.5) should be 12, not 13
            51,       // NaN()
            52,       // PosInf()
            53,       // NegInf()
            57,       // "NaN" string, again
            62,       // ROUND() vs ROUND_EVEN()  [CBL compatibility]
        ]},
    },
    // "obj_functions" skipped
    "order_functions": {
        "first": {only: []},    // FIRST
        "orderby_limit": {},
        "orderby": {skip: [
            4,       // SELECT id, orderlines[0].*
        ]},
    },
    // "other_functions" skipped -- "FIRST"
    "select_functions": {
        "distinct": {},
        "select": {skip: [
            6,       // SELECT orderlines[0].*
            7,       // SELECT orderlines[0].*
            8,       // SELECT orderlines[0].*
            9,       // SELECT orderlines[0].*
            12,      // SELECT orderlines[0].*
        ]},
    },
    "string_functions": {
        "str": {skip: [
            8,      // SUBSTR()
            9,      // SUBSTR()
            10,     // SUBSTR()
            15,     // INITCAP()
            16,     // INITCAP()
            17,     // TITLE()
            21,     // POSITION()
            27,     // TITLE()
            31,     // REPLACE()
            32,     // REPEAT()
            33,     // SPLIT()
            34,     // SUBSTR()
            35,     // REGEXP_POSITION1()
            36,     // POSITION1()
            37,     // SUBSTR1()
            38,     // SUBSTR1()
            39,     // SUBSTR1()
            40,     // SUBSTR1()
            41,     // SUBSTR1()
            42,     // CONCAT2()
            43,     // REPLACE()
            44,     // LIKE_PREFIX()
            45,     // REGEXP_PREFIX()
            46,     // LPAD()
            47,     // LPAD()
            48,     // LPAD()
            49,     // MASK()
            50,     // MASK()
            51,     // LET
        ]}
    },
    // "subqexp" skipped -- FROM [...]
    // "system" skipped -- server-specific
    "typeconv_functions": {
        "type_check": {skip: [
            9,      // IS_NUM() -- undocumented
            10,     // IS_NUM() -- undocumented
            11,     // IS_OBJ() -- undocumented
            13,     // ARRAY ... FOR
            14,     // ARRAY ... FOR
        ]},
        "type_conv": {skip: []}
    },
    // "unnest" skipped
    "where_functions": {
        "simple": {},
        "where": {skip: [
            28,     // ARRAY ... FOR
            29,     // ARRAY ... FOR
            30,     // ARRAY ... FOR
        ]},
    },
};


const ShowSkipped = false;


/// Top level: iterate the DataDir and call RunSuite on each whitelisted suite:
describe.skipIf(!await DirExists(DataDir))("N1QL Test Suite", async () => {
    if (await DirExists(DataDir)) {
        // eslint-disable-next-line @typescript-eslint/require-await
        await IterateDir(DataDir, true, async (name, path) => {
            const which = GlobalWhitelist[name];
            if (which) {
                describe(name, async () => {
                    await RunSuite(name, path, which);
                });
            } else {
                describe.skip(name, () => {});
            }
        });
    }
});


const InsertRE = /^INSERT INTO (\w+)\s+\(KEY,VALUE\)\s+VALUES\((.*)$/;

type InsertsJSON = {statements:string}[];
type TestsJSON = {statements:string, results: JSONObject[]}[];


/// Runs one test suite from a subdirectory of DataDir.
async function RunSuite(name: string, dir: string, suiteWhitelist: SuiteWhitelist) {
    let _db!: Database;

    // Subroutine that creates a Database and inserts the docs as described by `insert.json`.
    // Deferred until one of the tests (below) actually runs, since the entire suite might be
    // filtered out by the test runner.
    async function prepareDatabase(): Promise<Database> {
        if (_db) return _db;
        _db = await Database.open({
            name: "n1ql-tests",
            version: 1,
            collections: {
                customer: {},
                orders: {},
                product: {},
                purchase: {},
                review: {
                    indexes: ["customerId", "productId", "test_id"]
                }
            }
        });
        let inserts = await ReadJSONFile<InsertsJSON>(dir + '/' + "insert.json");
        if (inserts) {
            console.log(`Inserting documents for ${name} tests...`);
            let docCount = 0;
            let docs = new Map<Collection,CBLDocument[]>();
            for (const row of inserts) {
                //console.log(`\t${row.statements}`);
                const match = InsertRE.exec(row.statements);
                if (match === null) {
                    //console.error("\tXXXXX Couldn't parse: " + row.statements);
                    continue;
                }
                const [_, collection, remainder] = match;
                for (let piece of remainder.split("), VALUES(")) {
                    if (piece.endsWith(')'))
                        piece = piece.slice(0, -1);
                    const match2 = /^"(\w+)",\s*(.*)/.exec(piece);
                    check(match2 !== null, `Couldn't parse: ${piece}`);
                    const [_2, docID, bodyJSON] = match2;
                    //console.log(`$$ ${docID} : ${bodyJSON}`);
                    const body = ParseJSON(bodyJSON);

                    let coll = _db.getCollection(collection);
                    let list = docs.get(coll);
                    if (list === undefined) {
                        list = [];
                        docs.set(coll, list);
                    }
                    list.push(coll.createDocument(DocID(docID), body));
                    ++docCount;
                }
            }
            const start = Date.now();
            for (const [coll, list] of docs)
                await coll.updateMultiple({save: list});
            console.log(`Inserted ${docCount} docs in ${Date.now() - start}ms.`);
        }
        return _db;
    }

    // Now read the test files and run the tests in them:
    // eslint-disable-next-line @typescript-eslint/require-await
    await IterateDir(dir, false, async (filename, path) => {
        const match = /^case_(.*)\.json$/.exec(filename);
        if (!match) return;
        const testName = match[1];
        const whitelist = suiteWhitelist[testName] ?? {};

        if (whitelist.only && whitelist.only.length === 0) {
            describe.skip(testName, () => {});
            return;
        }

        // Runs all the tests in a test file:
        describe(testName, async () => {
            let caseNo = 0;
            for (const testSpec of (await ReadJSONFile<TestsJSON>(path))!) {
                ++caseNo;
                if (testSpec.results === undefined)
                    continue;       // skip other types of tests
                const caseName = `case #${caseNo}`;

                // Runs a single test:
                const testFn = async () => {
                    const db = await prepareDatabase();
                    let n1ql = testSpec.statements;
                    let rows: JSONObject[];
                    try {
                        const query = db.createQuery(n1ql);
                        //console.log("\t" + query.explanation.join("\n\t"));
                        rows = await query.execute();
                    } catch (x) {
                        const message = `!!! ${caseName}:  `;
                        console.error(message + n1ql);
                        if (x instanceof N1QLParseError && x.sourceRange !== undefined) {
                            const [start, end] = x.sourceRange;
                            console.error(" ".repeat(message.length + start)
                                          + "^".repeat(Math.max(end - start, 1))
                                          + `---"${x.message}"`);
                        }
                        throw x;
                    }

                    try {
                        expect(rows!).toEqual(testSpec.results);
                    } catch (x) {
                        console.error(`!!! ${caseName}:  ${n1ql}`);
                        throw x;
                    }
                };

                // Run or skip the test, according to the whitelist:
                if ((whitelist.skip && whitelist.skip.includes(caseNo))
                        || (whitelist.only && !whitelist.only.includes(caseNo))) {
                    if (ShowSkipped)
                        test.skip(caseName, testFn, 30000);
                } else {
                    test(caseName, testFn, 30000);
                }
            }
        });
    });
}


//-------- UTILITIES:


async function DirExists(path: string): Promise<boolean> {
    try {
        await fs.access(path, fs.constants.R_OK | fs.constants.X_OK);
        return true;
    } catch (_x) {
        return false;
    }
}


async function IterateDir(path: string, dirs: boolean,
                          fn: (name: string, path: string)=>Promise<void>)
{
    const names: string[] = [];
    const dir = await fs.opendir(path);
    for await (const dirent of dir) {
        if (!dirent.name.startsWith('.') && dirs === dirent.isDirectory())
            names.push(dirent.name);
    }
    names.sort();
    if (!path.endsWith('/'))
        path += '/';
    for (const name of names)
        await fn(name, path + name);
}


async function ReadJSONFile<T>(path: string): Promise<T | undefined> {
    if (existsSync(path))
        return JSON.parse(await fs.readFile(path, {encoding: "utf-8"})) as T;
    else
        return undefined;
}


function ParseJSON(json: string): JSONObject {
    try {
        const result = JSON.parse(json) as JSONObject;
        assert(typeof result === 'object' && result !== null);
        return result;
    } catch (_x) {
        throw Error(`Couldn't parse JSON: ${json}`);
    }
}

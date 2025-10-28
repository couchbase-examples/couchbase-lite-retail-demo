//
// query/query.test.ts
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
import { Database, Query } from "@/couchbase-lite";
import { Airlines, AirlinesSortedByFn, CreateTravelDB, type Airline, type TravelSchema } from "./common.test";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Normalize, NormalizePaths } from "./normalize";
import type { Select } from "./schema";
import type { CompiledExpr } from "./eval";
import { RegisterUserFunction } from "./compile";

Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


let db!: Database<TravelSchema>;

beforeAll( async () => {
    db = await CreateTravelDB();
});

afterAll( async () => {
    await db.closeAndDelete();
});


describe("Query", () => {

    test("normalize", () => {
        let select = {
            what: [["."], [".coll.zog"], [".", "wow"], "shortcut"],
            Where: ["=", [".foo.bar"], ["length()", ["$x"]]],
            from: [ {collection: "scope.collection", as: "coll"} ],
        } as unknown as Select;

        Normalize(select);

        let aliases = new Map<string,unknown>;
        aliases.set("coll", true);
        NormalizePaths(select, aliases, "coll");

        expect(select).toMatchInlineSnapshot(`
          {
            "FROM": [
              {
                "AS": "coll",
                "COLLECTION": "scope.collection",
              },
            ],
            "WHAT": [
              [
                ".",
                "coll",
              ],
              [
                ".",
                "coll",
                "zog",
              ],
              [
                ".",
                "coll",
                "wow",
              ],
              [
                ".",
                "coll",
                "shortcut",
              ],
            ],
            "WHERE": [
              "=",
              [
                ".",
                "coll",
                "foo",
                "bar",
              ],
              [
                "LENGTH()",
                [
                  "$",
                  "x",
                ],
              ],
            ],
          }
        `);
    });

    test("simplest", () => {
        let query = new Query(db, "SELECT * FROM airlines");
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("underscore alias", () => {
        let query = new Query(db, "SELECT * FROM _");
        expect(query.explanation).toMatchInlineSnapshot(`
        "Scan collection _default:
            - If doc is not deleted,
            - Produce row {
                _: _.* }"
      `);
    });

    test("WHERE docID =", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE meta().id = "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "id" of collection airlines where (
              _id = "foo" ):
              - If doc is not deleted,
              - Produce row {
                  airlines: airlines.* }"
        `);
    });


    test("WHERE name =", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name = "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name = "foo" ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE name <", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name < "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name in range [ ... "foo") ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE name <=", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name <= "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name in range [ ... "foo"] ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE name >", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name > "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name in range ("foo" ... ] ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE name >=", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name >= "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name in range ["foo" ... ] ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE name LIKE", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name LIKE "foo%"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name starts with "foo" ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE with array index", async () => {
        let query = new Query(db, 'SELECT meta().id FROM people WHERE "driving" IN likes');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.likes" of collection people where (
              "driving" IN likes ):
              - Produce row {
                  id: META(people).id }"
        `);
        expect(await query.execute()).toMatchInlineSnapshot(`
          [
            {
              "id": "person_006",
            },
            {
              "id": "person_009",
            },
          ]
        `);
    });

    test("WHERE with ANY using array index", async () => {
        let query = new Query(db, 'SELECT meta().id FROM people WHERE ANY x IN likes SATISFIES x = "driving" END');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.likes" of collection people where (
              "driving" IN likes ):
              - Produce row {
                  id: META(people).id }"
        `);
        expect(await query.execute()).toMatchInlineSnapshot(`
          [
            {
              "id": "person_006",
            },
            {
              "id": "person_009",
            },
          ]
        `);
    });

    test("WHERE including collection name", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE airlines.name >= "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name in range ["foo" ... ] ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE with key-path", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name.first = "foo"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - If airlines.name.first = "foo",
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE with parameter", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name.first = $first');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - If airlines.name.first = $first,
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE with AND", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name.first = "foo" AND name.last >= "bar"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - If airlines.name.first = "foo",
              - If airlines.name.last >= "bar",
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE with multiple AND", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name.first = "foo" AND name.last >= "bar" AND wow = 0');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - If airlines.name.first = "foo",
              - If airlines.name.last >= "bar",
              - If airlines.wow = 0,
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE with multicolumn index single condition", async () => {
        let query = new Query(db, 'SELECT name FROM airlines WHERE iata = "BA"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "[body.iata+body.icao]" of collection airlines where (
              iata = "BA" ):
              - Produce row {
                  name: airlines.name }"
        `);
        expect(await query.execute()).toMatchInlineSnapshot(`
          [
            {
              "name": "British Airways",
            },
          ]
        `);
    });

    test("WHERE with multicolumn index", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE iata = "Iata" AND icao = "Icao"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "[body.iata+body.icao]" of collection airlines where (
              iata = "Iata"
              icao = "Icao" ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE with multicolumn index inequality", async () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE iata = "Iata" AND icao > "Icao"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "[body.iata+body.icao]" of collection airlines where (
              iata = "Iata"
              icao in range ("Icao" ... ] ):
              - Produce row {
                  airlines: airlines.* }"
        `);
        expect(await query.execute()).toMatchInlineSnapshot(`[]`);
    });

    test("WHERE with multicolumn index partial inequality", () => {
        // Only the last column used in a multi-index may be an inequality
        let query = new Query(db, 'SELECT * FROM airlines WHERE iata > "Iata" AND icao = "Icao"');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "[body.iata+body.icao]" of collection airlines where (
              iata in range ("Iata" ... ] ):
              - If airlines.icao = "Icao",
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("WHERE that's not a range", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name = enam');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - If airlines.name = airlines.enam,
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("ORDER BY indexed property", () => {
        let query = new Query(db, 'SELECT * FROM airlines ORDER BY name');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan index "body.name" of collection airlines:
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("ORDER BY DESC indexed property", () => {
        let query = new Query(db, 'SELECT * FROM airlines ORDER BY name DESC');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan index "body.name" of collection airlines in reverse order:
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("ORDER BY ASC indexed property", () => {
        let query = new Query(db, 'SELECT * FROM airlines ORDER BY name ASC');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan index "body.name" of collection airlines:
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("ORDER BY indexed property with WHERE", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name LIKE "foo%" ORDER BY name DESC');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name starts with "foo" ) in reverse order:
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("ORDER BY indexed property with multiple WHERE", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE type = "airline" AND name LIKE "foo%" ORDER BY name DESC');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.type" of collection airlines where (
              type = "airline" ):
              - If LIKE[airlines.name, "foo%"],
          With docs sorted by airlines.name descending,
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("ORDER BY key-path", () => {
        let query = new Query(db, 'SELECT * FROM airlines ORDER BY name.first');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
          With docs sorted by airlines.name.first,
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("LIMIT", () => {
        let query = new Query(db, 'SELECT * FROM airlines LIMIT 10');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Produce row {
                  airlines: airlines.* }
          Limit to 10 rows"
        `);
    });

    test("OFFSET", () => {
        let query = new Query(db, 'SELECT * FROM airlines OFFSET 10');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Produce row {
                  airlines: airlines.* }
          Skip first 10 rows"
        `);
    });

    test("OFFSET LIMIT", () => {
        let query = new Query(db, 'SELECT * FROM airlines OFFSET 10 LIMIT 20');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Produce row {
                  airlines: airlines.* }
          Skip first 10 rows
          Limit to 20 rows"
        `);
    });

    test("LIMIT variable", () => {
        let query = new Query(db, 'SELECT * FROM airlines LIMIT $lim');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Produce row {
                  airlines: airlines.* }
          Limit to $lim rows"
        `);
    });

    test("LIMIT computed", () => {
        let query = new Query(db, 'SELECT * FROM airlines LIMIT $lim * 5');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Produce row {
                  airlines: airlines.* }
          Limit to $lim * 5 rows"
        `);
    });

    test("WHERE computed", () => {
        let query = new Query(db, 'SELECT * FROM airlines WHERE name = $name');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name = $name ):
              - Produce row {
                  airlines: airlines.* }"
        `);
    });

    test("User function", async () => {
        RegisterUserFunction('reverse', (arrayf: CompiledExpr) => {
            const array = arrayf();
            if (!Array.isArray(array)) return null;
            return array.toReversed();
        });

        let query = new Query(db, `SELECT REVERSE(["hi", "de", "ho"])`);
        let result = await query.execute();
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "$1": [
                "ho",
                "de",
                "hi",
              ],
            },
          ]
        `);
    });

    test("Invalid parameter names", async () => {
        let query = new Query(db, 'SELECT * FROM airlines OFFSET $off LIMIT $lim');
        expect(query.parameterNames).toEqual(new Set(["off", "lim"]));
        expect(query.parameters["off"]).toBeUndefined();
        expect(query.parameters["lim"]).toBeUndefined();

        expect( () => query.parameters["$off"] = 42 ).toThrow("Don't use '$' prefix in query parameter names");
        expect( () => query.parameters["zzz"] = 42 ).toThrow(`"zzz" is not a parameter of this query`);
        await expect(query.execute()).rejects.toThrow(`The query parameter "off" must have a value`);

        query.parameters = {off: 100, lim: 10};

        expect(query.parameters).toEqual({off: 100, lim: 10});
        expect( () => query.parameters = {off: 100} ).toThrow(`All 2 parameters must be set`);
        expect( () => query.parameters = {off: 100, limmm: 1} ).toThrow(`"limmm" is not a parameter of this query`);
    });


    test("Run with airlines.*", async () => {
        let query = new Query(db, "SELECT airlines.* FROM airlines");
        expect(query.columnNames).toEqual(["airlines.*"]);

        let result = await query.execute<Airline>();
        expect(result.length).toBe(Airlines.length);
        let i = 0;
        for (let row of result)
            expect(row).toEqual(Airlines[i++].body);
    });

    test("Run with *", async () => {
        let query = new Query(db, "SELECT * FROM airlines");
        expect(query.columnNames).toEqual(["airlines"]);

        let result = await query.execute<{airlines:Airline}>();
        expect(result.length).toBe(Airlines.length);
        let i = 0;
        for (let row of result)
            expect(row["airlines"]).toEqual(Airlines[i++].body);
    });

    test("Run with columns", async () => {
        let query = new Query(db, "SELECT name, id * 100 AS ID FROM airlines");
        expect(query.columnNames).toEqual(["name", "ID"]);

        let result = await query.execute();
        expect(result.length).toBe(Airlines.length);
        let i = 0;
        for (let row of result) {
            expect(row['name']).toEqual(Airlines[i].body.name);
            expect(row['ID']).toEqual(Airlines[i].body.id as number * 100);
            ++i;
        }
    });

    test("Run with aggregates", async () => {
        let query = new Query(db, `
             SELECT count(*) as count, min(id) as minID, max(id) as maxID,
                    round(avg(length(name))) as avgLen, name
             FROM airlines`);
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Accumulate state for COUNT(airlines.*)
              - Accumulate state for MIN(airlines.id)
              - Accumulate state for MAX(airlines.id)
              - Accumulate state for AVG(LENGTH(airlines.name))
          After aggregating,
              - Produce row {
                  count: COUNT(airlines.*),
                  minID: MIN(airlines.id),
                  maxID: MAX(airlines.id),
                  avgLen: ROUND(AVG(LENGTH(airlines.name))),
                  name: airlines.name }"
        `);

        let result = await query.execute();
        expect(result.length).toBe(1);
        expect(result[0]).toEqual({
            count: Airlines.length,
            minID: 10,
            maxID: 13947,
            avgLen: 14,
            name: "40-Mile Air"    // non-aggregate value from the first row
        });
    });

    test("Run with non-property order", async () => {
        const sortedAirlines = AirlinesSortedByFn( rev => (rev.body.name as string).length );

        let query = new Query(db, "SELECT name FROM airlines ORDER BY length(name)");
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
          With docs sorted by LENGTH(airlines.name),
              - Produce row {
                  name: airlines.name }"
        `);

        let result = await query.execute();
        expect(result.length).toBe(Airlines.length);
        let i = 0;
        for (let row of result) {
            //console.log("name = ", row);
            expect(row['name']).toEqual(sortedAirlines[i].body.name);
            ++i;
        }
    });

    test("Run with non-property order descending", async () => {
        const sortedAirlines = AirlinesSortedByFn( rev => - (rev.body.name as string).length );

        let query = new Query(db, "SELECT name FROM airlines ORDER BY length(name) DESC");
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
          With docs sorted by LENGTH(airlines.name) descending,
              - Produce row {
                  name: airlines.name }"
        `);

        let result = await query.execute();
        expect(result.length).toBe(Airlines.length);
        let i = 0;
        for (let row of result) {
            //console.log("name = ", row);
            expect(row['name']).toEqual(sortedAirlines[i].body.name);
            ++i;
        }
    });

    test("Run with two non-property orders", async () => {
        const sortedAirlines = AirlinesSortedByFn(
            rev => [rev.body.country, (rev.body.name as string).length] );

        let query = new Query(db, "SELECT country, name FROM airlines ORDER BY country, length(name)");
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
          With docs sorted by airlines.country, LENGTH(airlines.name),
              - Produce row {
                  country: airlines.country,
                  name: airlines.name }"
        `);

        let result = await query.execute();
        expect(result.length).toBe(Airlines.length);
        let i = 0;
        for (let row of result) {
            expect(row['name']).toEqual(sortedAirlines[i].body.name);
            ++i;
        }
    });


    test("UNNEST", async () => {
        let query = new Query(db, 'SELECT routes.id as route, schedule.flight as flight FROM routes UNNEST routes.schedule AS schedule ORDER BY flight LIMIT 5');

        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection routes:
              - If doc is not deleted,
              - Scan unnested array routes.schedule as 'schedule':
          With docs sorted by schedule.flight,
              - Produce row {
                  route: routes.id,
                  flight: schedule.flight }
          Limit to 5 rows"
        `);

        let result = await query.execute();
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "flight": "AF064",
              "route": 10000,
            },
            {
              "flight": "AF074",
              "route": 10000,
            },
            {
              "flight": "AF079",
              "route": 10001,
            },
            {
              "flight": "AF108",
              "route": 10001,
            },
            {
              "flight": "AF110",
              "route": 10001,
            },
          ]
        `);
    });


    test("JOIN", async () => {
        let query = new Query(db, 'SELECT routes.id as route, airlines.name as airline FROM routes JOIN airlines ON airlines.iata = routes.airline');
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection routes:
              - If doc is not deleted,
              - inner join with:
                  Search index "[body.iata+body.icao]" of collection airlines where (
                      iata = routes.airline ):
              - Produce row {
                  route: routes.id,
                  airline: airlines.name }"
        `);

        let result = await query.execute();
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "airline": "Air France",
              "route": 10000,
            },
            {
              "airline": "Air France",
              "route": 10001,
            },
            {
              "airline": "British Airways",
              "route": 14396,
            },
          ]
        `);
    });

    test("LEFT OUTER JOIN", async () => {
        let query = new Query(
            db,
            `SELECT airlines.name AS airline, routes.id AS route
             FROM airlines LEFT OUTER JOIN routes ON routes.airline = airlines.iata
             ORDER BY routes.distance;`);
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - left outer join with:
                  Search index "body.airline" of collection routes where (
                      airline = airlines.iata ):
          With docs sorted by routes.distance,
              - Produce row {
                  airline: airlines.name,
                  route: routes.id }"
        `);

        let result = await query.execute();
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "airline": "40-Mile Air",
            },
            {
              "airline": "Texas Wings",
            },
            {
              "airline": "Atifly",
            },
            {
              "airline": "Jc royal.britannica",
            },
            {
              "airline": "Locair",
            },
            {
              "airline": "SeaPort Airlines",
            },
            {
              "airline": "Alaska Central Express",
            },
            {
              "airline": "Astraeus",
            },
            {
              "airline": "Air Austral",
            },
            {
              "airline": "Airlinair",
            },
            {
              "airline": "AirTran Airways",
            },
            {
              "airline": "U.S. Air",
            },
            {
              "airline": "PanAm World Airways",
            },
            {
              "airline": "Air Caledonie International",
            },
            {
              "airline": "Tom's & co airliners",
            },
            {
              "airline": "British International Helicopters",
            },
            {
              "airline": "bmi",
            },
            {
              "airline": "bmibaby",
            },
            {
              "airline": "Bemidji Airlines",
            },
            {
              "airline": "British Midland Regional",
            },
            {
              "airline": "Bering Air",
            },
            {
              "airline": "Air Cargo Carriers",
            },
            {
              "airline": "Brit Air",
            },
            {
              "airline": "Air France",
              "route": 10001,
            },
            {
              "airline": "Air France",
              "route": 10000,
            },
            {
              "airline": "British Airways",
              "route": 14396,
            },
          ]
        `);
    });

    test("RIGHT OUTER JOIN", async () => {
        let query = new Query(
            db,
            `SELECT airlines.name AS airline, routes.id AS route
             FROM routes RIGHT OUTER JOIN airlines ON airlines.iata = routes.airline
             ORDER BY airline.name LIMIT 10;`);
        expect(query.explanation).toMatchInlineSnapshot(`
          "Scan collection routes:
              - If doc is not deleted,
              - outer join with:
                  Search index "[body.iata+body.icao]" of collection airlines where (
                      iata = routes.airline ):
          With docs sorted by airline.name,
              - Produce row {
                  airline: airlines.name,
                  route: routes.id }
          Limit to 10 rows"
        `);

        let result = await query.execute();
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "airline": "Air France",
              "route": 10000,
            },
            {
              "airline": "Air France",
              "route": 10001,
            },
            {
              "airline": "British Airways",
              "route": 14396,
            },
            {
              "airline": "40-Mile Air",
            },
            {
              "airline": "Texas Wings",
            },
            {
              "airline": "Atifly",
            },
            {
              "airline": "Jc royal.britannica",
            },
            {
              "airline": "Locair",
            },
            {
              "airline": "SeaPort Airlines",
            },
            {
              "airline": "Alaska Central Express",
            },
          ]
        `);
    });

    test("interrupt", async () => {
        let query = new Query(db, "SELECT * FROM airlines");
        let rowCount = 0;
        let ok = await query.execute( _row => {
            ++rowCount;
            if (rowCount === 5)
                query.interrupt();
        });
        expect(ok).toBeFalsy();
        expect(rowCount).toBe(5);
    });

    test("encrypted database", async () => {
        await db.changeEncryptionKey("password123");

        let query = new Query(db, 'SELECT * FROM airlines WHERE country == "France" ORDER BY callsign LIMIT 3');
        let result = await query.execute();
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "airlines": {
                "callsign": "AIRCALIN",
                "country": "France",
                "iata": "SB",
                "icao": "ACI",
                "id": 139,
                "name": "Air Caledonie International",
                "type": "airline",
              },
            },
            {
              "airlines": {
                "callsign": "AIRFRANS",
                "country": "France",
                "iata": "AF",
                "icao": "AFR",
                "id": 137,
                "name": "Air France",
                "type": "airline",
              },
            },
            {
              "airlines": {
                "callsign": "AIRLINAIR",
                "country": "France",
                "iata": "A5",
                "icao": "RLA",
                "id": 1203,
                "name": "Airlinair",
                "type": "airline",
              },
            },
          ]
        `);

        db.lock();
        await expect( query.execute() ).rejects.toThrowError("Cannot decrypt without key");
    });

});

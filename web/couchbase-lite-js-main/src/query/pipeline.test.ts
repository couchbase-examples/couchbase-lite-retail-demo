// query/basic_query.test.ts
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
import type { Collection } from "@/database/collection";
import { Database } from "@/database/database";
import { CreateTravelDB, type Airline, type Route, type TravelSchema } from "./common.test";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Aggregator, Distinctifier, Grouper, Joiner, Limiter, Projector, RevFilterer, RevProducer, RowCollector, RowObjectifier, SorterProjector, Unnester } from "./pipeline";
import { EvalContext } from "./eval";
import { KeyPrefixClause, KeyValueClause } from "./whereClause";
import type { Operation } from "./schema";

Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


let db!: Database<TravelSchema>;
let coll!: Collection<Airline>;
let routes!: Collection<Route>;

beforeAll( async () => {
    db = await CreateTravelDB();
    coll = db.collections.airlines;
    routes = db.collections.routes;
});

afterAll( async () => {
    await db.closeAndDelete();
});


describe("Pipeline", () => {

    test("indexed query", async () => {
        // SELECT name FROM airlines WHERE country = "United Kingdom";
        let ctx = new EvalContext();
        let nameExpr: Operation = ['.', 'airlines', 'name'];
        let nameCol = ctx.compile(nameExpr);
        let filter = ctx.compile( ['=', ['.', 'airlines', 'country'], 'United Kingdom'],);

        let source = new RevProducer({collection: coll, alias: "airlines",
            index: coll.indexOfProperty(coll.property("name")),
            indexedWhereOrSort: [
                new KeyPrefixClause(['.', 'airlines', 'name'], coll.property("name"), "Brit")
            ]});
        let collector = source
            .then(new RevFilterer([filter]))
            .then(new Projector([nameCol], ["name"]))
            .then(new RowCollector());

        await source.run(ctx);

        expect(collector.rows).toMatchInlineSnapshot(`
          [
            [
              "British Airways",
            ],
            [
              "British International Helicopters",
            ],
            [
              "British Midland Regional",
            ],
          ]
        `);

        expect(source.explanation).toMatchInlineSnapshot(`
          "Search index "body.name" of collection airlines where (
              name starts with "Brit" ):
              - If airlines.country = "United Kingdom",
              - Produce row {
                  name: airlines.name }"
        `);
    });


    test("normal query", async () => {
        // SELECT name FROM airlines WHERE country = "France" ORDER BY length(name) DESC;
        let ctx = new EvalContext();
        let nameCol = ctx.compile( ['.', 'airlines', 'name']);
        let nameLen = ctx.compile( ['LENGTH()', ['.', 'airlines', 'name']]);
        let filter = ctx.compile( ['=', ['.', 'airlines', 'country'], 'France'],);

        let source = new RevProducer({collection: coll, alias: "airlines"});
        let collector = source
            .then(new RevFilterer([filter]))
            .then(new SorterProjector([nameCol], ["name"], [{expr: nameLen, descending: true}]))
            .then(new RowCollector());

        expect(source.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - If airlines.country = "France",
          With docs sorted by LENGTH(airlines.name) descending,
              - Produce row {
                  name: airlines.name }"
        `);

        await source.run(ctx);

        expect(collector.rows).toMatchInlineSnapshot(`
          [
            [
              "Air Caledonie International",
            ],
            [
              "Tom's & co airliners",
            ],
            [
              "Air Austral",
            ],
            [
              "Air France",
            ],
            [
              "Airlinair",
            ],
            [
              "Brit Air",
            ],
          ]
        `);
    });


    test("star column", async () => {
        // SELECT airlines.* FROM airlines WHERE iata = "BA";
        let ctx = new EvalContext();
        let starCol = ctx.compile(['.', 'airlines']);

        let source = new RevProducer({collection: coll, alias: "airlines",
            index: coll.indexOfProperty(coll.property("iata")),
            indexedWhereOrSort: [
                new KeyValueClause(['.', 'airlines', 'iata'], coll.property("iata"), ctx.compile("BA"))
            ]});
        let collector = source
            .then(new Projector([starCol], ["airlines.*"]))
            .then(new RowObjectifier(["airlines.*"]))  // causes col to be merged into row object
            .then(new RowCollector());

        expect(source.explanation).toMatchInlineSnapshot(`
          "Search index "[body.iata+body.icao]" of collection airlines where (
              iata = "BA" ):
              - Produce row {
                  airlines.* }"
        `);

        await source.run(ctx);
        expect(collector.rows).toMatchInlineSnapshot(`
          [
            {
              "callsign": "SPEEDBIRD",
              "country": "United Kingdom",
              "iata": "BA",
              "icao": "BAW",
              "id": 1355,
              "name": "British Airways",
              "type": "airline",
            },
          ]
        `);
    });


    test("aggregate", async () => {
        let ctx = new EvalContext();
        let count = ctx.compileWithAggregates( ['COUNT()', ['.', 'airlines']]);

        let source = new RevProducer({collection: coll, alias: "airlines"});
        let collector = source
            .then(new Aggregator(ctx))
            .then(new Projector([count], ["count"]))
            .then(new RowCollector());

        await source.run(ctx);

        expect(collector.rows).toMatchInlineSnapshot(`
          [
            [
              25,
            ],
          ]
        `);

        expect(source.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - Accumulate state for COUNT(airlines.*)
          After aggregating,
              - Produce row {
                  count: COUNT(airlines.*) }"
        `);
    });


    test("grouper", async () => {
        // SELECT country, COUNT(*) FROM airlines GROUP BY country ORDER BY country;
        let ctx = new EvalContext();
        let countryCol = ctx.compile( ['.', 'airlines', 'country']);
        let count = ctx.compileWithAggregates( ['COUNT()', ['.', 'airlines']]);

        let source = new RevProducer({collection: coll, alias: "airlines"});
        let collector = source
            .then(new Grouper([countryCol], undefined, ctx))
            .then(new SorterProjector([countryCol, count], ["country", "count"],
                                      [{expr: countryCol}]))
            .then(new RowCollector());

        await source.run(ctx);

        expect(collector.rows).toMatchInlineSnapshot(`
          [
            [
              "France",
              6,
            ],
            [
              "United Kingdom",
              7,
            ],
            [
              "United States",
              12,
            ],
          ]
        `);

        expect(source.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
          Group rows by airlines.country, and for each group:
              - Accumulate state for COUNT(airlines.*)
          After aggregating,
          With docs sorted by airlines.country,
              - Produce row {
                  country: airlines.country,
                  count: COUNT(airlines.*) }"
        `);
    });


    test("distinct", async () => {
        // SELECT DISTINCT country FROM airlines ORDER BY country;
        let ctx = new EvalContext();
        let countryCol = ctx.compile( ['.', 'airlines', 'country']);

        let source = new RevProducer({collection: coll, alias: "airlines"});
        let collector = source
            .then(new SorterProjector([countryCol], ["country"], [{expr: countryCol}]))
            .then(new Distinctifier())
            .then(new RowCollector());

        await source.run(ctx);
        expect(collector.rows).toMatchInlineSnapshot(`
          [
            [
              "France",
            ],
            [
              "United Kingdom",
            ],
            [
              "United States",
            ],
          ]
        `);

        expect(source.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
          With docs sorted by airlines.country,
              - Produce row {
                  country: airlines.country }
          Remove identical rows"
        `);
    });


    test("inner join", async () => {
        // SELECT airline.name AS airline, route.id AS route
        // FROM airlines JOIN routes ON routes.airline = airlines.iata
        // ORDER BY routes.distance;
        let ctx = new EvalContext();
        let airlineNameCol = ctx.compile( ['.', 'airlines', 'name']);
        let routeIDCol = ctx.compile( ['.', 'routes', 'id']);
        let routeDistanceCol = ctx.compile( ['.', 'routes', 'distance']);

        let source = new RevProducer({collection: coll, alias: "airlines"});
        let onClause = new KeyValueClause(['=', ['.', 'airlines', 'iata'], ['.', 'routes', 'airline']],
                                          routes.property("airline"),
                                          ctx.compile(['.', 'airlines', 'iata']));
        let joinSource = new RevProducer({
            collection: routes,
            alias: "routes",
            index: routes.indexOfProperty(routes.property("airline")),
            indexedWhereOrSort: [onClause]});

        let collector = source
            .then(new Joiner(joinSource, 'INNER'))
            .then(new SorterProjector([airlineNameCol, routeIDCol], ["airline", "route"],
                                      [{expr: routeDistanceCol}]))
            .then(new RowObjectifier(["airline", "route"]))
            .then(new RowCollector());

        expect(source.explanation).toMatchInlineSnapshot(`
          "Scan collection airlines:
              - If doc is not deleted,
              - inner join with:
                  Search index "body.airline" of collection routes where (
                      airline = airlines.iata ):
          With docs sorted by routes.distance,
              - Produce row {
                  airline: airlines.name,
                  route: routes.id }"
        `);

        await source.run(ctx);
        expect(collector.rows).toMatchInlineSnapshot(`
          [
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



    test("outer join", async () => {
        // SELECT airline.name AS airline, route.id AS route
        // FROM airlines LEFT OUTER JOIN routes ON routes.airline = airlines.iata
        // ORDER BY routes.distance;
        let ctx = new EvalContext();
        let airlineNameCol = ctx.compile( ['.', 'airlines', 'name']);
        let routeIDCol = ctx.compile( ['.', 'routes', 'id']);
        let routeDistanceCol = ctx.compile( ['.', 'routes', 'distance']);

        let source = new RevProducer({collection: coll, alias: "airlines"});
        let onClause = new KeyValueClause(['=', ['.', 'airlines', 'iata'], ['.', 'routes', 'airline']],
                                          routes.property("airline"),
                                          ctx.compile(['.', 'airlines', 'iata']));
        let joinSource = new RevProducer({
            collection: routes,
            alias: "routes",
            index: routes.indexOfProperty(routes.property("airline")),
            indexedWhereOrSort: [onClause]});

        let collector = source
            .then(new Joiner(joinSource, 'LEFT OUTER'))
            .then(new SorterProjector([airlineNameCol, routeIDCol], ["airline", "route"],
                                      [{expr: routeDistanceCol}]))
            .then(new RowObjectifier(["airline", "route"]))
            .then(new RowCollector());

        expect(source.explanation).toMatchInlineSnapshot(`
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

        await source.run(ctx);
        expect(collector.rows).toMatchInlineSnapshot(`
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


    test("unnest", async () => {
        // SELECT routes.id, schedule.flight FROM routes UNNEST routes.schedule AS schedule ORDER BY schedule.flight LIMIT 5;
        let ctx = new EvalContext();
        ctx.sourceTypes.set("routes", 'collection');
        ctx.sourceTypes.set("schedule", 'unnest');
        const routeIDExpr = ctx.compile(['.', 'routes', 'id']);
        const flightExpr = ctx.compile(['.', 'schedule', 'flight']);
        let source = new RevProducer({collection: routes, alias: "routes"});
        let collector = source
            .then(new Unnester(ctx.compile(['.', 'routes', 'schedule']), "schedule"))
            .then(new SorterProjector([routeIDExpr, flightExpr],
                                      ["route", "flight"],
                                      [{expr: flightExpr}]))
            .then(new Limiter(undefined, ctx.compile(5)))
            .then(new RowObjectifier(["id", "flight"]))
            .then(new RowCollector());

        expect(source.explanation).toMatchInlineSnapshot(`
          "Scan collection routes:
              - If doc is not deleted,
              - Scan unnested array routes.schedule as 'schedule':
          With docs sorted by schedule.flight,
              - Produce row {
                  route: routes.id,
                  flight: schedule.flight }
          Limit to 5 rows"
        `);

        await source.run(ctx);
        expect(collector.rows).toMatchInlineSnapshot(`
          [
            {
              "flight": "AF064",
              "id": 10000,
            },
            {
              "flight": "AF074",
              "id": 10000,
            },
            {
              "flight": "AF079",
              "id": 10001,
            },
            {
              "flight": "AF108",
              "id": 10001,
            },
            {
              "flight": "AF110",
              "id": 10001,
            },
          ]
        `);
    });
});

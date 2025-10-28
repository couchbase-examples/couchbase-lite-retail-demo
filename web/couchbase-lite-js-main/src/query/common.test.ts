// query/common.test.ts
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
import { Database, type DatabaseConfig } from "@/database/database";
import { type CBLValue, DocID, type RevID, type Sequence } from "@/database/types";
import { test } from "vitest";
import type { LocalRevision } from "@/database/internals";
import * as N1QL from "@/query/N1QLFunctions";
import type { Value } from "./eval";
import type { JSONObject } from "@/util/json_types";

Database.useIndexedDB(indexedDB, IDBKeyRange);
Database.debugMode(true);


export interface Airline {
    id                  : number,
    type                : "airline",
    name                : string,
    iata                : string | null,
    icao                : string,
    callsign            : string | null,
    country             : string,
}


export interface Route {
    id                  : number,
    type                : "route",
    airline             : string,
    airlineid           : string,
    sourceairport       : string,
    destinationairport  : string,
    stops               : number,
    equipment           : string,
    schedule            : {day: number, utc: string, flight: string}[],
    distance            : number,
}


export interface Person {
    name: {first: string, last: string},
    gender: string,
    birthday: string,
    contact: {
        address: {street: string, zip: string, city: string, state: string},
        email: string[],
        region: string,
        phone: string[],
    },
    likes: string[],
    memberSince: string,
}


/** Schema of the travel-sample database (at least, the small subset herein.) */
export interface TravelSchema {
    airlines:   Airline,
    routes:     Route,
    people:     Person,
    _default:   JSONObject,
}

const TravelDBConfig: DatabaseConfig<TravelSchema> = {
    name: "travel",
    version: 1,
    collections: {
        airlines: {
            indexes: ["name", "type", { on: ["iata", "icao"] }]
        },
        routes: {
            indexes: ["airline", "airlineid"]
        },
        people: {
            indexes: [ {on: "likes", type: "array"} ]
        },
        _default: { }
    }
};


const RawAirlines: ReadonlyArray<{id:string,body:Airline}> = [
    {id: "airline_10", body: {"id":10,"type":"airline","name":"40-Mile Air","iata":"Q5","icao":"MLA","callsign":"MILE-AIR","country":"United States"}},
    {id: "airline_10123", body: {"id":10123,"type":"airline","name":"Texas Wings","iata":"TQ","icao":"TXW","callsign":"TXW","country":"United States"}},
    {id: "airline_10226", body: {"id":10226,"type":"airline","name":"Atifly","iata":"A1","icao":"A1F","callsign":"atifly","country":"United States"}},
    {id: "airline_10642", body: {"id":10642,"type":"airline","name":"Jc royal.britannica","iata":null,"icao":"JRB","callsign":null,"country":"United Kingdom"}},
    {id: "airline_10748", body: {"id":10748,"type":"airline","name":"Locair","iata":"ZQ","icao":"LOC","callsign":"LOCAIR","country":"United States"}},
    {id: "airline_10765", body: {"id":10765,"type":"airline","name":"SeaPort Airlines","iata":"K5","icao":"SQH","callsign":"SASQUATCH","country":"United States"}},
    {id: "airline_109", body: {"id":109,"type":"airline","name":"Alaska Central Express","iata":"KO","icao":"AER","callsign":"ACE AIR","country":"United States"}},
    {id: "airline_112", body: {"id":112,"type":"airline","name":"Astraeus","iata":"5W","icao":"AEU","callsign":"FLYSTAR","country":"United Kingdom"}},
    {id: "airline_1191", body: {"id":1191,"type":"airline","name":"Air Austral","iata":"UU","icao":"REU","callsign":"REUNION","country":"France"}},
    {id: "airline_1203", body: {"id":1203,"type":"airline","name":"Airlinair","iata":"A5","icao":"RLA","callsign":"AIRLINAIR","country":"France"}},
    {id: "airline_1316", body: {"id":1316,"type":"airline","name":"AirTran Airways","iata":"FL","icao":"TRS","callsign":"CITRUS","country":"United States"}},
    {id: "airline_13391", body: {"id":13391,"type":"airline","name":"U.S. Air","iata":"-+","icao":"--+","callsign":null,"country":"United States"}},
    {id: "airline_1355", body: {"id":1355,"type":"airline","name":"British Airways","iata":"BA","icao":"BAW","callsign":"SPEEDBIRD","country":"United Kingdom"}},
    {id: "airline_13633", body: {"id":13633,"type":"airline","name":"PanAm World Airways","iata":"WQ","icao":"PQW","callsign":null,"country":"United States"}},
    {id: "airline_137", body: {"id":137,"type":"airline","name":"Air France","iata":"AF","icao":"AFR","callsign":"AIRFRANS","country":"France"}},
    {id: "airline_139", body: {"id":139,"type":"airline","name":"Air Caledonie International","iata":"SB","icao":"ACI","callsign":"AIRCALIN","country":"France"}},
    {id: "airline_13947", body: {"id":13947,"type":"airline","name":"Tom's & co airliners","iata":"&T","icao":"T&O","callsign":"T&","country":"France"}},
    {id: "airline_1411", body: {"id":1411,"type":"airline","name":"British International Helicopters","iata":"BS","icao":"BIH","callsign":"BRINTEL","country":"United Kingdom"}},
    {id: "airline_1437", body: {"id":1437,"type":"airline","name":"bmi","iata":"BD","icao":"BMA","callsign":"MIDLAND","country":"United Kingdom"}},
    {id: "airline_1441", body: {"id":1441,"type":"airline","name":"bmibaby","iata":"WW","icao":"BMI","callsign":"BABY","country":"United Kingdom"}},
    {id: "airline_1442", body: {"id":1442,"type":"airline","name":"Bemidji Airlines","iata":"CH","icao":"BMJ","callsign":"BEMIDJI","country":"United States"}},
    {id: "airline_1445", body: {"id":1445,"type":"airline","name":"British Midland Regional","iata":null,"icao":"BMR","callsign":null,"country":"United Kingdom"}},
    {id: "airline_1472", body: {"id":1472,"type":"airline","name":"Bering Air","iata":"8E","icao":"BRG","callsign":"BERING AIR","country":"United States"}},
    {id: "airline_149", body: {"id":149,"type":"airline","name":"Air Cargo Carriers","iata":"2Q","icao":"SNC","callsign":"NIGHT CARGO","country":"United States"}},
    {id: "airline_1523", body: {"id":1523,"type":"airline","name":"Brit Air","iata":"DB","icao":"BZH","callsign":"BRITAIR","country":"France"}},
];


const RawRoutes: ReadonlyArray<{id:string,body:Route}> = [
    {id: "route_10000", body: {"id":10000,"type":"route","airline":"AF","airlineid":"airline_137","sourceairport":"TLV","stops":0,"equipment":"320","schedule":[{"day":0,"utc":"10:13:00","flight":"AF198"},{"day":0,"utc":"19:14:00","flight":"AF547"},{"day":0,"utc":"01:31:00","flight":"AF943"},{"day":1,"utc":"12:40:00","flight":"AF356"},{"day":1,"utc":"08:58:00","flight":"AF480"},{"day":1,"utc":"12:59:00","flight":"AF250"},{"day":1,"utc":"04:45:00","flight":"AF130"},{"day":2,"utc":"00:31:00","flight":"AF997"},{"day":2,"utc":"19:41:00","flight":"AF223"},{"day":2,"utc":"15:14:00","flight":"AF890"},{"day":2,"utc":"00:30:00","flight":"AF399"},{"day":2,"utc":"16:18:00","flight":"AF328"},{"day":3,"utc":"23:50:00","flight":"AF074"},{"day":3,"utc":"11:33:00","flight":"AF556"},{"day":4,"utc":"13:23:00","flight":"AF064"},{"day":4,"utc":"12:09:00","flight":"AF596"},{"day":4,"utc":"08:02:00","flight":"AF818"},{"day":5,"utc":"11:33:00","flight":"AF967"},{"day":5,"utc":"19:42:00","flight":"AF730"},{"day":6,"utc":"17:07:00","flight":"AF882"},{"day":6,"utc":"17:03:00","flight":"AF485"},{"day":6,"utc":"10:01:00","flight":"AF898"},{"day":6,"utc":"07:00:00","flight":"AF496"}],"distance":2881.617376098415,"destinationairport":"MRS"}},
    {id: "route_10001", body: {"id":10001,"type":"route","airline":"AF","airlineid":"airline_137","sourceairport":"TLV","stops":0,"equipment":"320","schedule":[{"day":0,"utc":"21:24:00","flight":"AF248"},{"day":1,"utc":"13:36:00","flight":"AF517"},{"day":1,"utc":"21:35:00","flight":"AF279"},{"day":1,"utc":"00:54:00","flight":"AF753"},{"day":1,"utc":"15:29:00","flight":"AF079"},{"day":1,"utc":"06:16:00","flight":"AF756"},{"day":2,"utc":"03:39:00","flight":"AF499"},{"day":2,"utc":"08:49:00","flight":"AF158"},{"day":2,"utc":"06:01:00","flight":"AF337"},{"day":2,"utc":"11:48:00","flight":"AF436"},{"day":2,"utc":"09:35:00","flight":"AF660"},{"day":3,"utc":"12:55:00","flight":"AF692"},{"day":3,"utc":"19:38:00","flight":"AF815"},{"day":3,"utc":"12:33:00","flight":"AF455"},{"day":3,"utc":"19:45:00","flight":"AF926"},{"day":4,"utc":"10:36:00","flight":"AF133"},{"day":4,"utc":"07:46:00","flight":"AF999"},{"day":4,"utc":"15:42:00","flight":"AF703"},{"day":5,"utc":"05:40:00","flight":"AF656"},{"day":6,"utc":"16:21:00","flight":"AF185"},{"day":6,"utc":"00:56:00","flight":"AF110"},{"day":6,"utc":"06:07:00","flight":"AF783"},{"day":6,"utc":"04:54:00","flight":"AF108"},{"day":6,"utc":"12:07:00","flight":"AF673"}],"distance":2735.2013399811754,"destinationairport":"NCE"}},
    {id: "route_14396", body: {"id":14396,"type":"route","airline":"BA","airlineid":"airline_1355","sourceairport":"ABV","stops":0,"equipment":"777","schedule":[{"day":0,"utc":"08:31:00","flight":"BA587"},{"day":0,"utc":"17:06:00","flight":"BA718"},{"day":1,"utc":"18:50:00","flight":"BA059"},{"day":1,"utc":"10:33:00","flight":"BA581"},{"day":1,"utc":"13:51:00","flight":"BA326"},{"day":1,"utc":"09:59:00","flight":"BA070"},{"day":1,"utc":"09:30:00","flight":"BA452"},{"day":2,"utc":"12:34:00","flight":"BA228"},{"day":2,"utc":"04:25:00","flight":"BA781"},{"day":3,"utc":"04:29:00","flight":"BA787"},{"day":4,"utc":"23:07:00","flight":"BA391"},{"day":4,"utc":"22:25:00","flight":"BA742"},{"day":5,"utc":"11:19:00","flight":"BA637"},{"day":5,"utc":"20:44:00","flight":"BA424"},{"day":5,"utc":"22:30:00","flight":"BA135"},{"day":6,"utc":"23:15:00","flight":"BA465"},{"day":6,"utc":"16:55:00","flight":"BA613"}],"distance":4774.961348171372,"destinationairport":"LHR"}},
];


const RawPeople: ReadonlyArray<{id:string,body:Person}> = [
    {id:"person_001", body:{"name":{"first":"Lue","last":"Laserna"},"gender":"female","birthday":"1983-09-18","contact":{"address":{"street":"19 Deer Loop","zip":"90732","city":"San Pedro","state":"CA"},"email":["lue.laserna@nosql-matters.org","laserna@nosql-matters.org"],"region":"310","phone":["310-8268551","310-7618427"]},"likes":["chatting"],"memberSince":"2011-05-05"}},
    {id:"person_002", body:{"name":{"first":"Jasper","last":"Grebel"},"gender":"male","birthday":"1989-04-29","contact":{"address":{"street":"19 Florida Loop","zip":"66840","city":"Burns","state":"KS"},"email":["jasper.grebel@nosql-matters.org"],"region":"316","phone":["316-2417120","316-2767391"]},"likes":["shopping"],"memberSince":"2011-11-10"}},
    {id:"person_003", body:{"name":{"first":"Kandra","last":"Beichner"},"gender":"female","birthday":"1963-11-21","contact":{"address":{"street":"6 John Run","zip":"98434","city":"Tacoma","state":"WA"},"email":["kandra.beichner@nosql-matters.org","kandra@nosql-matters.org"],"region":"253","phone":["253-0405964"]},"likes":["swimming"],"memberSince":"2012-03-18"}},
    {id:"person_004", body:{"name":{"first":"Jeff","last":"Schmith"},"gender":"male","birthday":"1977-10-14","contact":{"address":{"street":"14 198th St","zip":"72569","city":"Poughkeepsie","state":"AR"},"email":["jeff.schmith@nosql-matters.org"],"region":"870","phone":[]},"likes":["chatting","boxing","reading"],"memberSince":"2011-02-10"}},
    {id:"person_005", body:{"name":{"first":"Tuan","last":"Climer"},"gender":"male","birthday":"1951-04-06","contact":{"address":{"street":"6 Kansas St","zip":"07921","city":"Bedminster","state":"NJ"},"email":["tuan.climer@nosql-matters.org"],"region":"908","phone":["908-8376478"]},"likes":["ironing"],"memberSince":"2011-02-06"}},
    {id:"person_006", body:{"name":{"first":"Warner","last":"Lemaire"},"gender":"male","birthday":"1953-05-01","contact":{"address":{"street":"14 234th St","zip":"22553","city":"Spotsylvania","state":"VA"},"email":["warner.lemaire@nosql-matters.org","warner@nosql-matters.org"],"region":"540","phone":[]},"likes":["driving"],"memberSince":"2008-10-20"}},
    {id:"person_007", body:{"name":{"first":"Hugh","last":"Potash"},"gender":"male","birthday":"1971-02-17","contact":{"address":{"street":"16 Beechwood Way","zip":"14902","city":"Elmira","state":"NY"},"email":["hugh.potash@nosql-matters.org","potash@nosql-matters.org","hugh@nosql-matters.org"],"region":"607","phone":["607-5183546"]},"likes":[],"memberSince":"2011-10-28"}},
    {id:"person_008", body:{"name":{"first":"Jennefer","last":"Menning"},"gender":"female","birthday":"1972-09-11","contact":{"address":{"street":"1 Euclid Dr","zip":"56307","city":"Albany","state":"MN"},"email":["jennefer.menning@nosql-matters.org","jennefer@nosql-matters.org"],"region":"320","phone":[]},"likes":[],"memberSince":"2010-09-11"}},
    {id:"person_009", body:{"name":{"first":"Claude","last":"Willcott"},"gender":"female","birthday":"1979-01-08","contact":{"address":{"street":"2 Country club Ave","zip":"50588","city":"Storm Lake","state":"IA"},"email":["claude.willcott@nosql-matters.org","willcott@nosql-matters.org","claude@nosql-matters.org"],"region":"712","phone":["712-3896363"]},"likes":["chess","driving"],"memberSince":"2010-03-27"}},
    {id:"person_010", body:{"name":{"first":"Maximina","last":"Kilzer"},"gender":"female","birthday":"1992-03-10","contact":{"address":{"street":"4 Phillips Ln","zip":"73726","city":"Carmen","state":"OK"},"email":["maximina.kilzer@nosql-matters.org","kilzer@nosql-matters.org"],"region":"580","phone":["580-7678062"]},"likes":["shopping","travelling"],"memberSince":"2007-09-12"}},
    {id:"person_011", body:{"name":{"first":"Calvin","last":"Porro"},"gender":"male","birthday":"1940-03-31","contact":{"address":{"street":"20 12th Ave","zip":"59820","city":"Alberton","state":"MT"},"email":["calvin.porro@nosql-matters.org"],"region":"406","phone":["406-7464035"]},"likes":[],"memberSince":"2009-10-17"}},
    {id:"person_012", body:{"name":{"first":"Diedre","last":"Clinton"},"gender":"female","birthday":"1959-11-06","contact":{"address":{"street":"2 Fraser Ave","zip":"81223","city":"Cotopaxi","state":"CO"},"email":["diedre.clinton@nosql-matters.org","clinton@nosql-matters.org","diedre@nosql-matters.org"],"region":"719","phone":["719-7055896"]},"likes":["swimming"],"memberSince":"2009-03-14"}},
];


export const Airlines: LocalRevision[] = RawAirlines.map( record => {
    return AsLocalRev(record.id, record.body as unknown as JSONObject);
});

export const Routes: LocalRevision[] = RawRoutes.map( record => {
    return AsLocalRev(record.id, record.body as unknown as JSONObject);
});

export const People: LocalRevision[] = RawPeople.map( record => {
    return AsLocalRev(record.id, record.body as unknown as JSONObject);
});


export async function CreateTravelDB(): Promise<Database<TravelSchema>> {
    const db = await Database.open<TravelSchema>(TravelDBConfig);
    const airlines = db.collections.airlines;
    await airlines.updateMultiple({save: RawAirlines.map(
        record => airlines.createDocument(DocID(record.id), record.body) ) });
    const routes = db.collections.routes;
    await routes.updateMultiple({save: RawRoutes.map(
        record => routes.createDocument(DocID(record.id), record.body) ) });
    const people = db.collections.people;
    await people.updateMultiple({save: RawPeople.map(
        record => people.createDocument(DocID(record.id), record.body) ) });
    return db;
}


export function AirlinesSortedBy(key: string, mustExist = true): LocalRevision[] {
    return AirlinesSortedByFn( rev => rev.body[key], mustExist );
}


export function AirlinesSortedByFn(fn: (rev: LocalRevision)=>CBLValue, mustExist = true): LocalRevision[] {
    return Airlines
        .filter(rev => !mustExist || fn(rev) !== undefined)
        .sort( (a, b) => {
            return N1QL.compare(fn(a) as Value, fn(b) as Value);
        });
}


export function AsLocalRev(docID: string, body: JSONObject): LocalRevision {
    return {id: DocID(docID), body: body, rev: "" as RevID, seq: 0 as Sequence};
}


// Vite complains if there are no tests in the file
test.skip("nothing", () => {});

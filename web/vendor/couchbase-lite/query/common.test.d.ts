import { Database } from '../database/database';
import { CBLValue } from '../database/types';
import { LocalRevision } from '../database/internals';
import { JSONObject } from '../util/json_types';
export interface Airline {
    id: number;
    type: "airline";
    name: string;
    iata: string | null;
    icao: string;
    callsign: string | null;
    country: string;
}
export interface Route {
    id: number;
    type: "route";
    airline: string;
    airlineid: string;
    sourceairport: string;
    destinationairport: string;
    stops: number;
    equipment: string;
    schedule: {
        day: number;
        utc: string;
        flight: string;
    }[];
    distance: number;
}
export interface Person {
    name: {
        first: string;
        last: string;
    };
    gender: string;
    birthday: string;
    contact: {
        address: {
            street: string;
            zip: string;
            city: string;
            state: string;
        };
        email: string[];
        region: string;
        phone: string[];
    };
    likes: string[];
    memberSince: string;
}
/** Schema of the travel-sample database (at least, the small subset herein.) */
export interface TravelSchema {
    airlines: Airline;
    routes: Route;
    people: Person;
}
export declare const Airlines: LocalRevision[];
export declare const Routes: LocalRevision[];
export declare const People: LocalRevision[];
export declare function CreateTravelDB(): Promise<Database<TravelSchema>>;
export declare function AirlinesSortedBy(key: string, mustExist?: boolean): LocalRevision[];
export declare function AirlinesSortedByFn(fn: (rev: LocalRevision) => CBLValue, mustExist?: boolean): LocalRevision[];
export declare function AsLocalRev(docID: string, body: JSONObject): LocalRevision;

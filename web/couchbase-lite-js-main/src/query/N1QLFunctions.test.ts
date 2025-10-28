//
// query/N1QLFunctions.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import * as n from "./N1QLFunctions";
import { describe, test, expect } from "vitest";


const kDateStringUTC = "2025-07-08T23:37:19.452Z";
const kDateStringPDT = "2025-07-08T16:37:19.452-07:00";
const kDateStringNYC = "2025-07-08T19:37:19.452-04:00";
const kDateInMillis  = 1752017839452;

const kEarlierDateStringPDT = "1964-11-28T10:00:00+02:00";
const kEarlierDateInMillis = -160675200000;


describe("N1QL Functions", () => {

    describe("Date-time", () => {
        test("millis_to_str", () => {
            // Note: `bun test` uses a timezone of GMT, while `vite test` uses the real timezone
            if (new Date().toString().includes("GMT+0000")) {
                expect(n.millis_to_str(kDateInMillis)).toBe("2025-07-08T23:37:19.452+00:00");
            } else {
                // expect(n.millis_to_str(kDateInMillis)).toBe(kDateStringPDT);
            }
        });
        test("millis_to_utc", () => {
            expect(n.millis_to_utc(kDateInMillis)).toBe("2025-07-08T23:37:19.452Z");
        });
        test("millis_to_tz", () => {
            expect(n.millis_to_tz(kDateInMillis, "America/Los_Angeles")).toBe(kDateStringPDT);
            expect(n.millis_to_tz(kDateInMillis, "America/New_York")).toBe(kDateStringNYC);
            expect(n.millis_to_tz(kDateInMillis, "Asia/R'lyeh")).toBe(null);
        });
        test("str_to_millis", () => {
            expect(n.str_to_millis(kDateStringUTC)).toBe(kDateInMillis);
            expect(n.str_to_millis(kDateStringPDT)).toBe(kDateInMillis);
            expect(n.str_to_millis("*Fj$!")).toBe(null);
        });
        test("str_to_utc", () => {
            expect(n.str_to_utc(kDateStringUTC)).toBe(kDateStringUTC);
            expect(n.str_to_utc(kDateStringPDT)).toBe(kDateStringUTC);
            expect(n.str_to_utc("*Fj$!")).toBe(null);
        });
        test("str_to_tz", () => {
            expect(n.str_to_tz(kDateStringUTC, "America/Los_Angeles")).toBe(kDateStringPDT);
            expect(n.str_to_tz(kDateStringPDT, "America/New_York")).toBe(kDateStringNYC);
            expect(n.str_to_tz("*Fj$!", "America/New_York")).toBe(null);
        });
        test("date_diff_str", () => {
            expect(n.date_diff("2025-07-08T23:37:19.452Z", "2025-06-30T23:37:19.452Z", 'month')).toBe(1);
            expect(n.date_diff(kDateStringUTC, kEarlierDateStringPDT, 'century')).toBe(0);
            expect(n.date_diff(kDateStringUTC, kEarlierDateStringPDT, 'decade')).toBe(6);
            expect(n.date_diff(kDateStringUTC, kEarlierDateStringPDT, 'year')).toBe(61);
            expect(n.date_diff(kDateStringUTC, kEarlierDateStringPDT, 'month')).toBe(728);
        });
        test("date_diff_millis", () => {
            expect(n.date_diff(kDateInMillis, kEarlierDateInMillis, 'century')).toBe(0);
            expect(n.date_diff(kDateInMillis, kEarlierDateInMillis, 'decade')).toBe(6);
            expect(n.date_diff(kDateInMillis, kEarlierDateInMillis, 'year')).toBe(61);
            expect(n.date_diff(kDateInMillis, kEarlierDateInMillis, 'month')).toBe(728);
        });
        test("date_add_str", () => {
            expect(n.date_add(kDateStringUTC, 1, 'month')).toBe("2025-08-08T23:37:19.452Z");
            expect(n.date_add(kDateStringUTC, -60, 'year')).toBe("1965-07-08T23:37:19.452Z");
            expect(n.date_add(kDateStringUTC, 1, 'century')).toBe("2125-07-08T23:37:19.452Z");
        });
        test("date_add_millis", () => {
            expect(n.date_add(kDateInMillis, 1, 'month')).toBe(1754696239452);
            expect(n.date_add(kDateInMillis, -60, 'year')).toBe(-141438160548);
            expect(n.date_add(kDateInMillis, 1, 'century')).toBe(4907691439452);
        });
    });

    describe("LIKE", () => {

        test("unescape backslashes", () => {
            expect(n.unescapeBackslashes(`hello there`)).toBe("hello there");
            expect(n.unescapeBackslashes(String.raw`he\llo th\\ere`)).toBe("hello th\\ere");
            expect(n.unescapeBackslashes(String.raw`hello th\\\ere`)).toBe("hello th\\ere");
            expect(n.unescapeBackslashes(String.raw`\hello there\\`)).toBe("hello there\\");
        });

        test("likeMode", () => {
            expect(n.likeMode("plain"))         .toEqual([0, "plain"]);
            expect(n.likeMode("pl\\_ai\\%n"))   .toEqual([0, "pl_ai%n"]);
            expect(n.likeMode("%plain"))        .toEqual([2, "plain"]);
            expect(n.likeMode("%pl\\%in"))      .toEqual([2, "pl%in"]);
            expect(n.likeMode("plain%"))        .toEqual([1, "plain"]);
            expect(n.likeMode("pl\\%in%"))      .toEqual([1, "pl%in"]);
            expect(n.likeMode("f%ncy%"))        .toEqual([3, "f%ncy%"]);

            expect(n.likeMode("pl\\_in"))       .toEqual([0, "pl_in"]);
            expect(n.likeMode("pl_in"))         .toEqual([3, "pl_in"]);
        });

        test("regexpFromLike", () => {
            let re = n.regexpFromLike("foo%bar_baz");
            // Regexp.escape() does some funny escaping of letters, like "f" to "\x66".
            expect(re).toEqual(/\x66oo.*\x62ar.\x62az/);
            expect("foosomebarthingbar!baz").toMatch(re);
            expect("foobar baz").toMatch(re);

            re = n.regexpFromLike("%foo..*_");
            expect(re).toEqual(/.*\x66oo\.\.\*./);
        });

        test("like", () => {
            expect(n.like("foobar", "foobar")).toBeTruthy();
            expect(n.like("foobar", " foobar")).toBeFalsy();
            expect(n.like("foo_bar", "foo\\_bar")).toBeTruthy();

            expect(n.like("foo!bar", "foo_bar")).toBeTruthy();

            expect(n.like("XXXfoobar", "%foobar")).toBeTruthy();
            expect(n.like("foobar", "%foobar")).toBeTruthy();
            expect(n.like("foobarX", "%foobar")).toBeFalsy();

            expect(n.like("foobarXXX", "foobar%")).toBeTruthy();
            expect(n.like("foobar", "foobar%")).toBeTruthy();
            expect(n.like("  foobar", "foobar%")).toBeFalsy();
            expect(n.like("Xfoobar", "foobar%")).toBeFalsy();

            expect(n.like("foosomebarthingbar!baz", "foo%bar_baz")).toBeTruthy();
        });
    });

    describe("Vector distances", () => {
        test("euclidean_distance", () => {
            const vec1 = [0, 3];
            const vec2 = [4, 0];
            expect(n.euclidean_distance(vec1, vec1)).toBe(0);
            expect(n.euclidean_distance(vec1, vec2)).toBe(5);
            expect(n.euclidean_distance(vec1, vec2, 2)).toBe(25);
        });
        test("euclidean_distance with encoded vectors", () => {
            const vec1 = n.encodeVector([0, 3]);
            const vec2 = n.encodeVector([4, 0]);
            expect(n.euclidean_distance(vec1, vec1)).toBe(0);
            expect(n.euclidean_distance(vec1, vec2)).toBe(5);
        });
        test("cosine_distance", () => {
            const vec1 = [0, 3];
            const vec2 = [4, 0];
            expect(n.cosine_distance(vec1, vec1)).toBe(0);
            expect(n.cosine_distance(vec1, vec2)).toBe(1);
        });
        test("cosine_distance with encoded vectors", () => {
            const vec1 = n.encodeVector([0, 3]);
            const vec2 = n.encodeVector([4, 0]);
            expect(n.cosine_distance(vec1, vec1)).toBe(0);
            expect(n.cosine_distance(vec1, vec2)).toBe(1);
        });
    });

});

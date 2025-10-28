//
// util/jsonMap.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { JSONMap, type JSONMapKey } from "./jsonMap";
import { describe, test, expect } from "vitest";


describe("JSONMap", () => {

    test("empty", () => {
        const map = new JSONMap<number>;
        expect(map.size).toBe(0);
        expect(map.get(true)).toBe(undefined);
        expect(map.toString()).toMatchInlineSnapshot(`
          "JSONMap {
          }"
        `);
    });


    test("scalars", () => {
        const map = new JSONMap<JSONMapKey>;

        expect(map.size).toBe(0);

        const values = [undefined, null, true, false, 12345, 3.14159, "", "foo"];
        for (const value of values)
            map.set(value, value);

        expect(map.toString()).toMatchInlineSnapshot(`
          "JSONMap {
          	undefined : undefined
          	null : null
          	true : true
          	false : false
          	12345 : 12345
          	3.14159 : 3.14159
          	"" : ""
          	"foo" : "foo"
          }"
        `);

        for (const value of values)
            expect(map.get(value)).toBe(value);

        let i = 0;
        for (const [k, v] of map) {
            expect(k).toBe(values[i]);
            expect(v).toBe(values[i]);
            ++i;
        }
    });


    test("arrays", () => {
        const map = new JSONMap<string>;

        expect(map.get(["a", "b"])).toBeUndefined();

        map.set([], "empty");
        expect(map.get([])).toBe("empty");
        expect(map.toString()).toMatchInlineSnapshot(`
          "JSONMap {
          	[] : "empty"
          }"
        `);

        map.set(["a", "b"], "ab");

        expect(map.get(["a", "b"])).toBe("ab");
        expect(map.get(["a"])).toBeUndefined();
        expect(map.get(["a", "b", "c"])).toBeUndefined();

        map.set(["a", "b"], "AB");
        expect(map.get(["a", "b"])).toBe("AB");

        map.set(["a", 42, "b"], "a42b");
        expect(map.get(["a", 42, "b"])).toBe("a42b");
        expect(map.get(["a", "b"])).toBe("AB");
        expect(map.get([])).toBe("empty");
        expect(map.get(["a", "b", 42])).toBeUndefined();

        expect(map.toString()).toMatchInlineSnapshot(`
          "JSONMap {
          	[] : "empty"
          	["a","b"] : "AB"
          	["a",42,"b"] : "a42b"
          }"
        `);
    });


    test("nested arrays", () => {
        const map = new JSONMap<string>;

        expect(map.get(["a", ["b"], "c"])).toBeUndefined();
        map.set(["a", ["b"], "c"], "a[b]c");
        expect(map.get(["a", ["b"], "c"])).toBe("a[b]c");

        map.set([[[12]]], "12!");
        expect(map.get([[[12]]])).toBe("12!");

        expect(map.toString()).toMatchInlineSnapshot(`
          "JSONMap {
          	["a",["b"],"c"] : "a[b]c"
          	[[[12]]] : "12!"
          }"
        `);

        const gen = map.entries();
        expect(gen.next()).toEqual({done: false, value: [["a", ["b"], "c"], "a[b]c"]});
        expect(gen.next()).toEqual({done: false, value: [[[[12]]], "12!"]});
        expect(gen.next()).toEqual({done: true});
    });


    test("objects", () => {
        const map = new JSONMap<string>;

        expect(map.get({})).toBeUndefined();
        expect(map.get({a: 12, b: 34})).toBeUndefined();

        map.set({}, "empty");

        expect(map.get({})).toBe("empty");
        expect(map.toString()).toMatchInlineSnapshot(`
          "JSONMap {
          	{} : "empty"
          }"
        `);

        map.set({a: 12, b: 34}, "a12b34");

        expect(map.get({a: 12, b: 34})).toBe("a12b34");
        expect(map.get({b: 34, a: 12})).toBe("a12b34");
        expect(map.get({a: 12})).toBeUndefined();
        expect(map.get({})).toBe("empty");

        map.set({a: "a", b: "b"}, "aabb");

        expect(map.get({a: "a", b: "b"})).toBe("aabb");
        expect(map.get({a: 12, b: 34})).toBe("a12b34");
        expect(map.toString()).toMatchInlineSnapshot(`
          "JSONMap {
          	{} : "empty"
          	{"a":12,"b":34} : "a12b34"
          	{"a":"a","b":"b"} : "aabb"
          }"
        `);
    });

});

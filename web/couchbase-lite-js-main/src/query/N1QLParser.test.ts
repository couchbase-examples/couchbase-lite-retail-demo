//
// n1ql.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import {N1QLParseError, ParseExpression, ParseSelect} from "./N1QLParser";
import { describe, test, expect } from "vitest";
import type { Expr, Operation, Select } from "./schema";
import { VisitExpr, VisitSelect } from "./normalize";


// The N1QL parser adds properties `sourceTextStart` and `sourceTextEnd` to `Operation`s.
// This gets in the way of comparing them via `expect(...)toEqual(...)`.
// These wrapper functions parse an expression or SELECT and strip out those properties:

function stripSourceRange(op: Operation) {
    // eslint-disable-next-line @typescript-eslint/no-array-delete
    delete op.sourceTextStart;
    // eslint-disable-next-line @typescript-eslint/no-array-delete
    delete op.sourceTextEnd;
}

function parseExpr(source: string): Expr {
    const expr = ParseExpression(source);
    // Strip meta properties that impede equality checks:
    VisitExpr(expr, (_, op) => {
        stripSourceRange(op);
        return true;
    });
    return expr;
}

function parseSelect(source: string): Select {
    const select = ParseSelect(source);
    // Strip meta properties that impede equality checks:
    VisitSelect(select, (_, op) => {
        stripSourceRange(op);
        return true;
    });
    stripSourceRange(select.WHAT as Operation);
    stripSourceRange(select.FROM as unknown as Operation);
    for (let what of select.WHAT) stripSourceRange(what as Operation);
    for (let from of select.FROM) stripSourceRange(from as unknown as Operation);
    return select;
}


describe("N1QL Parser", () => {
    test("simple parse", () => {
        const result = parseExpr("3 + 4 + \"hello\"");
        expect(result).toEqual([ "+", [ "+", 3, 4 ], "hello" ]);
    });

    test("parse booleans", () => {
        const result = parseExpr("true and false");
        expect(result).toEqual(["AND", true, false]);
    });

    test("parse array literal", () => {
        const result = parseExpr("[3, \"foo\", x]");
        expect(result).toEqual(["[]", 3, "foo", [".", "x"]]);
    });

    test("parse dict literal", () => {
        const result = parseExpr("{\"wow\": $arg, \"hey\": NULL}");
        expect(result).toEqual({wow: ["$", "arg"], hey: null});
    });

    test("parse properties", () => {
        const result = parseExpr("foo.bar[3].x");
        expect(result).toEqual([".", "foo", "bar", 3, "x"]);
    });

    test("parse function", () => {
        const result = parseExpr("length(17)");
        expect(result).toEqual(["LENGTH()", 17]);
    });

    test("parse META", () => {
        expect(parseExpr("META()")).toEqual(['META()']);
        expect(parseExpr("META().sequence")).toEqual(['META()', null, 'sequence']);
        expect(parseExpr("META(collection)")).toEqual(['META()', 'collection']);
        expect(parseExpr("META(collection).id")).toEqual(['META()', 'collection', 'id']);
    });

    test("parse ANY", () => {
        let result = parseExpr("ANY x IN list SATISFIES ?x > 0 END");
        expect(result).toEqual(["ANY", "x", [".", "list"], [">", ["?", "x"], 0]]);
        result = parseExpr("SOME x IN list SATISFIES ?x > 0 END");
        expect(result).toEqual(["ANY", "x", [".", "list"], [">", ["?", "x"], 0]]);
        result = parseExpr("EVERY x IN list SATISFIES ?x > 0 END");
        expect(result).toEqual(["EVERY", "x", [".", "list"], [">", ["?", "x"], 0]]);
        result = parseExpr("ANY AND EVERY x IN list SATISFIES ?x > 0 END");
        expect(result).toEqual(["ANY AND EVERY", "x", [".", "list"], [">", ["?", "x"], 0]]);
    });

    test("parse IN", () => {
        let result = parseExpr("x IN [3, 4 + 5, 6]");
        expect(result).toEqual(['IN', ['.', 'x'], ['[]', 3, ['+', 4, 5], 6]]);

        result = parseExpr("x IN [3, 4, 5]");
        expect(result).toEqual(['IN', ['.', 'x'], ['[]', 3, 4, 5]]);

        result = parseExpr("x NOT IN [3, 4, 5]");
        expect(result).toEqual(['NOT IN', ['.', 'x'], ['[]', 3, 4, 5]]);
    });

    test("parse BETWEEN", () => {
        let result = parseExpr("6 BETWEEN 5 AND 7");
        expect(result).toEqual(["BETWEEN", 6, 5, 7]);
        result = parseExpr("6 NOT BETWEEN 5 AND 7");
        expect(result).toEqual(["NOT", ["BETWEEN", 6, 5, 7]]);
    });

    test("parse CASE", () => {
        let result = parseExpr("CASE $x WHEN 1 THEN \"one\" WHEN 2 THEN \"two\" END");
        expect(result).toEqual(["CASE", ["$", "x"], 1, "one", 2, "two"]);
        result = parseExpr("CASE $x WHEN 1 THEN \"one\" WHEN 2 THEN \"two\" ELSE \"huh\" END");
        expect(result).toEqual(["CASE", ["$", "x"], 1, "one", 2, "two", "huh"]);
        result = parseExpr("CASE WHEN 1 THEN \"one\" WHEN 2 THEN \"two\" ELSE \"huh\" END");
        expect(result).toEqual(["CASE", null, 1, "one", 2, "two", "huh"]);
    });

    test("select", () => {
        const result = parseSelect("SELECT 4 as four, alias.x from scope.coll AS alias");
        expect(result).toEqual( {
            WHAT: [ ["AS", 4, "four"], [".", "alias", "x"] ],
            FROM: [ {SCOPE: "scope", COLLECTION: "coll", AS: "alias"} ]
        } );
    });

    test("select join", () => {
        let result = parseSelect("SELECT 4 FROM coll1 JOIN coll2 ON 17 UNNEST 42 AS answer");
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [
                {COLLECTION: "coll1"},
                {COLLECTION: "coll2", JOIN: "INNER", ON: 17},
                {UNNEST: 42, AS: "answer"}
            ]
        } );
        result = parseSelect("SELECT 4 FROM coll1 INNER JOIN coll2 ON 17 UNNEST 42 AS answer");
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [
                {COLLECTION: "coll1"},
                {COLLECTION: "coll2", JOIN: "INNER", ON: 17},
                {UNNEST: 42, AS: "answer"}
            ]
        } );
        result = parseSelect("SELECT 4 FROM coll1 LEFT OUTER JOIN coll2 ON 17 UNNEST 42 AS answer");
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [
                {COLLECTION: "coll1"},
                {COLLECTION: "coll2", JOIN: "LEFT OUTER", ON: 17},
                {UNNEST: 42, AS: "answer"}
            ]
        } );
    });

    test("select order", () => {
        const result = parseSelect("SELECT 4 from coll ORDER BY \"x\", \"y\" ASC, \"z\" DESC");
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [ {COLLECTION: "coll"} ],
            ORDER_BY: [ "x", "y", ["DESC", "z"] ]
        } );
    });

    test("select limit", () => {
        let result = parseSelect("SELECT 4 from coll LIMIT 100");
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [ {COLLECTION: "coll"} ],
            LIMIT: 100
        } );
        result = parseSelect(`SELECT 4 from coll OFFSET 100`);
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [ {COLLECTION: "coll"} ],
            OFFSET: 100
        } );
        result = parseSelect(`SELECT 4 from coll OFFSET 100 LIMIT 200`);
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [ {COLLECTION: "coll"} ],
            OFFSET: 100,
            LIMIT: 200
        } );
        result = parseSelect(`SELECT 4 from coll LIMIT 200 OFFSET 100`);
        expect(result).toEqual( {
            WHAT: [ 4 ],
            FROM: [ {COLLECTION: "coll"} ],
            OFFSET: 100,
            LIMIT: 200
        } );
    });

    test("failed parse", () => {
        let threw = false;
        try {
            ParseExpression("3 + 4 / * 2");
        } catch (x) {
            threw = true;
            expect(x).toBeInstanceOf(N1QLParseError);
            const error = x as N1QLParseError;
            expect(error.message).toContain("expected");
            expect(error.sourceRange).toEqual([10, 10]);
        }
        expect(threw).toBeTruthy();
    });

});

//
// database/docProperty.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import {DocIDProperty, DocProperty, ExpiresProperty, SequenceProperty} from "./docProperty";
import { ExpiresKey, IDKey, type LocalRevision, SeqKey } from "./internals";
import type { DocID} from "./types";
import type { RevID, Sequence } from "./types";
import { describe, test, expect } from "vitest";

const kDocument: LocalRevision = {
    id: "doc" as DocID,
    rev: "1-2345" as RevID,
    seq: 1234 as Sequence,
    body: {
        color: "red",
        geo: {lat: -123, lon: 31},
    }
};


describe("DocProperty", () => {

    test("id", () => {
        const id = DocProperty.create(DocIDProperty);
        expect(id.name).toBe(DocIDProperty);
        expect(id.keypath).toBe(IDKey);
        expect(id.indexed).toBe(true);

        expect(id.in(kDocument)).toBe(true);
        expect(id.getFrom(kDocument)).toBe("doc");
    });


    test("seq", () => {
        const seq = DocProperty.create(SequenceProperty);
        expect(seq.name).toBe(SequenceProperty);
        expect(seq.keypath).toBe(SeqKey);
        expect(seq.indexed).toBe(true);

        expect(seq.in(kDocument)).toBe(true);
        expect(seq.getFrom(kDocument)).toBe(1234);
    });


    test("expires", () => {
        const exp = DocProperty.create(ExpiresProperty);
        expect(exp.name).toBe(ExpiresProperty);
        expect(exp.keypath).toBe(ExpiresKey);
        expect(exp.indexed).toBe(true);

        expect(exp.in(kDocument)).toBe(false);
    });


    test("normal", () => {
        const color = DocProperty.create("color");
        expect(color.name).toBe("color");
        expect(color.keypath).toBe("body.color");
        expect(color.indexed).toBe(false);

        expect(color.in(kDocument)).toBe(true);
        expect(color.getFrom(kDocument)).toBe("red");
    });


    test("normal missing", () => {
        const shoeSize = DocProperty.create("shoe_size");
        expect(shoeSize.in(kDocument)).toBe(false);
        expect(shoeSize.getFrom(kDocument)).toBe(undefined);
    });


    test("path", () => {
        const lat = DocProperty.create("geo.lat");
        expect(lat.in(kDocument)).toBe(true);
        expect(lat.getFrom(kDocument)).toBe(-123);
    });


    test("path missing", () => {
        const foo = DocProperty.create("geo.foo");
        expect(foo.in(kDocument)).toBe(false);
        expect(foo.getFrom(kDocument)).toBeUndefined();
    });


    test.each(
        ["", ".", ".foo", "_foo", "_foo.bar", "foo.bar.", "foo..bar"]
    )("invalid name %p", (name: string) => {
        expect( () => DocProperty.create(name) ).toThrow();
    });

});

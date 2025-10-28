// database/cryptoCodec.test.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import {CryptoCodec, type Encrypted} from "./cryptoCodec";
import { assertDefined } from "@/util/assert";
import type { LocalRevision } from "./internals";
import { DocID, type RevID, type Sequence } from "./types";
import { test, describe, expect } from "vitest";

describe("CryptoCodec", () => {

    test("codec", async () => {
        let challenge: Encrypted;
        let clonedEncrypted: Encrypted;
        {
            // Create a new Codec:
            const codec = await CryptoCodec.create("password123456");
            expect(codec.isUnlocked).toBe(true);
            challenge = codec.challenge!;
            expect(challenge?.iv).toBeInstanceOf(Uint8Array);
            expect(challenge?.data).toBeInstanceOf(Uint8Array);

            // encrypt:
            let encrypted = await codec.encryptJSON({a: 123, b: "howdy"});
            assertDefined(encrypted);
            expect(encrypted.iv).toBeInstanceOf(Uint8Array);
            expect(encrypted.data).toBeInstanceOf(Uint8Array);
            clonedEncrypted = structuredClone(encrypted);
            expect(clonedEncrypted).toEqual(encrypted);
        }
        {
            // New Codec, initialized with the saved challenge:
            const codec = CryptoCodec.withChallenge(challenge);
            expect(codec.isUnlocked).toBe(false);
            // Try to unlock it:
            let unlocked = await codec.unlock("letmein");
            expect(unlocked).toBeFalsy();
            unlocked = await codec.unlock("password123456");
            expect(unlocked).toBeTruthy();

            // decrypt:
            let decrypted = await codec.decryptJSON(clonedEncrypted);
            expect(decrypted).toEqual({a: 123, b: "howdy"});
        }
    });

    test("encrypt rev", async () => {
        const codec = await CryptoCodec.create("password123456");
        const unencryptedProperties = new Set(["name", "shoeSize"]);

        const doc = {
            name: "Fred",
            shoeSize: 8.5,
            secretSanta: "Barney",
            secretCrush: "Betty",
        };

        let rev: LocalRevision = {
            id: DocID("doc"),
            rev: "1-2345" as RevID,
            seq: 1 as Sequence,
            body: {}
        };

        const enc = await codec.partlyEncrypt(doc, unencryptedProperties);
        expect(enc.body).toEqual({name: "Fred", shoeSize: 8.5});
        expect(enc.encrypted).toBeDefined();
        rev.body = enc.body;
        rev.encrypted = enc.encrypted;

        // Now decrypt it:
        await codec.decryptRevision(rev);
        console.log(rev);
        expect(rev.body).toEqual(doc);
        expect(rev.encrypted).toBeUndefined();
    });

});

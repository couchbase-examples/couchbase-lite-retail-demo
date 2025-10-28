import * as blob from "./blob";
import { IsLikelyCompressible } from "./sync_blobs";
import { describe, test, expect } from "vitest";

const SampleData       = new Uint8Array([0x62, 0x6c, 0x6f, 0x62]);
const SampleDataDigest = "sha1-D9C8+0T4Pn1ax6iSJXgna5r0h0Y=";
const SampleDataType   = "application/octet-stream";


describe("Blob Tests", () => {

    test("digest", () => {
        const nb = new blob.NewBlob(SampleData);
        expect(nb.digest).toBe(SampleDataDigest);
    });

    test("new blob", async () => {
        const b = new blob.NewBlob(SampleData, SampleDataType);
        expect(b.digest).toBe(SampleDataDigest);
        expect(b.content_type).toBe(SampleDataType);
        expect(b.length).toBe(4);

        expect(await b.getContents()).toEqual(SampleData);

        const j = JSON.parse(JSON.stringify(b)) as blob.Bloblike;
        expect(j).toEqual({"@type":"blob", digest:SampleDataDigest,
            length:4, content_type: SampleDataType});
    });

    test("new blob no type", async () => {
        const b = new blob.NewBlob(SampleData);
        expect(b.digest).toBe(SampleDataDigest);
        expect(b.content_type).toBeUndefined();
        expect(b.length).toBe(4);

        expect(await b.getContents()).toEqual(SampleData);

        const j = JSON.parse(JSON.stringify(b)) as blob.Bloblike;
        expect(j).toEqual({"@type":"blob", "digest":SampleDataDigest, "length":4});
    });


    test("existing blob", async () => {
        const bloblike = {"digest":SampleDataDigest, "length":4, "content_type": SampleDataType};

        let loaderCalls = 0;
        const loader: blob.BlobLoader = async (digest, content_type) => {
            ++loaderCalls;
            expect(digest).toBe(SampleDataDigest);
            expect(content_type).toBe(SampleDataType);
            return Promise.resolve(SampleData);
        };

        const b = new blob.ExistingBlob(bloblike, loader);
        expect(b.digest).toBe(SampleDataDigest);
        expect(b.content_type).toBe(SampleDataType);
        expect(b.length).toBe(4);

        expect(await b.getContents()).toEqual(SampleData);
        expect(loaderCalls).toBe(1);

        const j = JSON.parse(JSON.stringify(b)) as blob.Bloblike;
        expect(j).toEqual({"@type":"blob", digest:SampleDataDigest, length:4,
            content_type: SampleDataType});
    });


    test("IsLikelyCompressible", () => {
        expect(IsLikelyCompressible(undefined)).toBe(false);
        expect(IsLikelyCompressible("text/plain")).toBe(true);
        expect(IsLikelyCompressible("application/json")).toBe(true);
        expect(IsLikelyCompressible("image/svg+xml")).toBe(true);
        expect(IsLikelyCompressible("image/png")).toBe(false);
        expect(IsLikelyCompressible("archive/zip")).toBe(false);
        expect(IsLikelyCompressible("video/mpeg")).toBe(false);
    });

});

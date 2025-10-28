# Couchbase Lite for JavaScript

> [!WARNING]
> Couchbase Confidential

This is the JavaScript (really TypeScript) implementation of Couchbase Lite.

It's intended for use in web browsers, or in web-view-based apps.
Server and CLI environments like Node.js, Deno, Bun are not supported,
because they lack a proper implementation of the [IndexedDB][INDEXEDDB] API.

This ReadMe last updated Sept 30 2025.

## Getting Started / Documentation

The [wiki][WIKI] has some documents introducing the [API][APIDOCS], and describing differences from
other Couchbase Lite platforms.

For an example of using the API in a web page, see [`examples/browser.ts`](./examples/browser.ts).
If you want to run that example yourself, see ["Kicking The Tires"][KICKING].

## Source Code

Code is in the `src` directory.
The public API is declared in `src/couchbase-lite.ts`, which just re-exports public symbols.

Subdirectories are:

* `blip`: The BLIP RPC protocol, used by the replicator
* `blob`: Blob/attachment classes and support code
* `database`: Database, Collection and document implementation
* `query`: Query implementation
* `replicator`: Replicator implementation (but not its public API)
* `util`: Internal utilities

## Building It

### Dependencies

For development you'll need to install [Bun](https://bun.sh).
(Node.js should work too, but isn't supported.)

Package dependencies (will be installed by Bun):

* General:
  * [`@logtape/logtape`](https://www.npmjs.com/package/@logtape/logtape) -- Logging
* BLIP:
  * [`@foxglove/crc`](https://www.npmjs.com/package/@foxglove/crc) -- CRC32 checksums.
  * [`pako`](https://www.npmjs.com/package/pako) -- data compression (it's a port of zlib.)
  * [`isomorphic-ws`](https://www.npmjs.com/package/isomorphic-ws) -- WebSockets (not needed in browsers.)
* Database:
  * [`dexie`](https://www.npmjs.com/package/dexie) -- High-level wrapper for IndexedDB.
  * [`fake-indexeddb`](https://www.npmjs.com/package/fake-indexeddb) -- In-memory IndexedDB implementation (not needed in browsers)
  * [`sha.js`](https://www.npmjs.com/package/sha.js) -- SHA-1 digests (used instead of JS crypto because it's synchronous.)
  * [`buffer`](https://www.npmjs.com/package/buffer) -- Required to use `sha.js` in a browser.
* Query:
  * [`ohm-js`](https://www.npmjs.com/package/ohm-js) -- Parser library, used for N1QL/SQL++.
  * [`date-fns`](https://www.npmjs.com/package/date-fns) -- For the N1QL date/time functions
  * [`regexp.escape`](https://www.npmjs.com/package/regexp.escape) -- Escapes regular expression strings. Used in implementation of LIKE.

### Building

1. `bun install` _(first time only)_
2. `bun run build`

This compiles the TypeScript code in `./src` into JavaScript files in `./dist`.

### Running Tests

You can run the tests with either `bun test` or `bun run test`.
The former uses Bun's built-in test runner, the latter uses vitest.

By default, the tests in `src/query/N1QLTestSuite.test.ts` will be skipped
because they require about 24MB of test data from the Server N1QL test suite repo.
To enable those tests, follow the directions in the file.

## Running The Examples

### …in a web browser

See the wiki page ["Kicking the Tires"][KICKING].

### …from the command line

We have a test of replication in a server environment (Bun or node.js).
Since IndexedDB is not available, it uses the "fake-indexeddb" package;
this database is ephemeral, since it's only for testing purposes.

To run, first read the instructions at the top of
[`examples/sync_collections_node.ts`](./examples/sync_collections_node.ts)
and set up your server (Sync Gateway or Edge Server).

Then run `bun run examples/sync_collections_node.ts`

[WIKI]: https://github.com/couchbaselabs/couchbase-lite-js/wiki
[APIDOCS]: https://glowing-invention-kr285q7.pages.github.io/modules.html
[KICKING]: https://github.com/couchbaselabs/couchbase-lite-js/wiki/Kicking-The-Tires
[INDEXEDDB]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

/**
 * This is a pure JavaScript / TypeScript implementation of Couchbase Lite, for use in browsers.
 * @module */

// couchbase-lite.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

/* Main interface for Couchbase Lite For JavaScript. Simply re-exports the public symbols. */

declare const __APP_VERSION__: string;
export const Version = __APP_VERSION__;
export const APIVersion = 1;

export {
    Blob,
    NewBlob,
    ExistingBlob,
    type Bloblike,
} from "./blob/blob";

export {
    ArrayIndex,
    Collection,
    ConflictError,
    DefaultCollectionName,
    LastWriteWins,
    MostWritesWins,
    MultipleConflictsError,
    ValueIndex,
    type CollectionChange,
    type CollectionChangeCallback,
    type CollectionConfig,
    type ConflictHandler,
    type ConflictHandlerResult,
    type DocumentChange,
    type DocumentChangeCallback,
    type IndexConfig,
    type IndexType,
} from "./database/collection";

export {
    Database,
    EncryptionError,
    type CollectionsConfig,
    type DatabaseConfig,
    type UnencryptedProperties,
} from "./database/database";

export {
    meta,
    type CBLDocument,
    type DocumentMeta,
} from "./database/document";

export {
    Replicator,
    type CheckpointerDelegate,
    type Credentials,
    type DocumentEnded,
    type PullConflictResolver,
    type PullerConfig,
    type PusherConfig,
    type RemoteRevisionInfo,
    type ReplicatorConfig,
    type ReplicatorCollectionConfig,
    type Status as ReplicatorStatus,
} from "./database/replicator";

export {
    DocID,
    type CBLArray,
    type CBLDictionary,
    type CBLValue,
    type RevID,
    type RevisionInfo,
    type Sequence,
} from './database/types';

export {
    LogCategory,
} from "./util/logging";

export {
    InterruptedQueryError,
    N1QLParseError,
    Query,
    RegisterUserFunction,
    type QueryChangeCallback,
    type QueryResult as QueryAliases,
    type UserFunction,
    type UserFunctionOptions
} from "./query/query";

export {
    ListenerToken
} from "./util/listener";

export {
    type JSONArray,
    type JSONCollection,
    type JSONObject,
    type JSONScalar,
    type JSONValue
} from "./util/json_types";

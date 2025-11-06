/**
 * This is a pure JavaScript / TypeScript implementation of Couchbase Lite, for use in browsers.
 * @module */
export declare const Version: string;
export declare const APIVersion = 1;
export { Blob, NewBlob, ExistingBlob, type Bloblike, } from './blob/blob';
export { ArrayIndex, Collection, ConflictError, DefaultCollectionName, LastWriteWins, MostWritesWins, MultipleConflictsError, ValueIndex, type CollectionChange, type CollectionChangeCallback, type CollectionConfig, type ConflictHandler, type ConflictHandlerResult, type DocumentChange, type DocumentChangeCallback, type IndexConfig, type IndexType, } from './database/collection';
export { Database, EncryptionError, type CollectionsConfig, type DatabaseConfig, type UnencryptedProperties, } from './database/database';
export { meta, type CBLDocument, type DocumentMeta, } from './database/document';
export { Replicator, type DocumentEnded, type ReplicatorConfig, type ReplicatorCollectionConfig, type Status as ReplicatorStatus, } from './database/replicator';
export { ReplicatorError } from './replicator/types';
export { type Credentials, type CheckpointerDelegate, type LostAccess, type PusherConfig, type PullerConfig, type PullConflictResolver, type RemoteRevisionInfo, type Status } from './replicator/replicator';
export { DocID, type CBLArray, type CBLDictionary, type CBLValue, type RevID, type Revision, type RevisionInfo, type Sequence, } from './database/types';
export { LogCategory, } from './util/logging';
export { InterruptedQueryError, N1QLParseError, Query, RegisterUserFunction, type QueryChangeCallback, type QueryResult as QueryAliases, type UserFunction, type UserFunctionOptions } from './query/query';
export { ListenerToken } from './util/listener';
export { type JSONArray, type JSONCollection, type JSONObject, type JSONScalar, type JSONValue } from './util/json_types';

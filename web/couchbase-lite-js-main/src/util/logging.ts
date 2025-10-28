//
// util/logging.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import * as logtape from "@logtape/logtape";

/** The name of the root category of Couchbase Lite's logtape loggers. */
export const LogCategory = "CouchbaseLite";

export const MainLogger = logtape.getLogger([LogCategory]);
export const DBLogger = MainLogger.getChild("DB");
export const QueryLogger = MainLogger.getChild("Query");

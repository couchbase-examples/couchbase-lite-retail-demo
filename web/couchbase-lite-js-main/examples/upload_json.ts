//
// examples/upload_json.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

// This is just a standalone Node utility script to upload a JSON-lines file to SG.

import * as fs from "node:fs/promises";
import * as http from "node:http";

async function run() {
    const agent = new http.Agent();

    const fd = await fs.open("/Users/snej/Couchbase/DataSets/travel-sample/travel.json", "r");
    const contents = await fd.readFile({encoding: "utf-8"});
    for (const line of contents.split("\n")) {
        console.log("line: " + line);
        const p = new Promise<number | undefined>((resolve, reject) => {
            const req = http.request("http://localhost:4985/travel-sample/",
                                     {method: "POST", agent: agent},
                                     response => {resolve(response.statusCode);}
            );
            req.on("error", (e) => {
                console.error(`problem with request: ${e.message}`);
                reject(e);
            });
            req.write(line);
            req.end();
        });
        const status = await p;
        console.log(`    --> ${status}`);
    }
    await fd.close();
}

void(run());

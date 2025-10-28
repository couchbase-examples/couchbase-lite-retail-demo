//
// util/listener.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

/** A reference to a registered listener, which allows you to remove the listener by calling
 *  its `remove` method. In TypeScript you can also use it with the `using` keyword. */
export class ListenerToken {
    constructor(destructor: ()=>void) {this.#destructor = destructor;}

    remove() {this.#destructor?.(); this.#destructor = undefined;}
    [Symbol.dispose]() {this.remove();}

    #destructor?: ()=>void;
}

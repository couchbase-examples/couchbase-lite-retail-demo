//
// query/decompile.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { IsInfixBinaryOp } from "./compile";
import { ExprIsLiteral, type Expr, type Operation } from "./schema";
import type { CompiledExpr } from "./eval";


/** Decompiles a JSON query expression back to N1QL.
 *  ...sort of. It handles the most common things, and returns an invalid-but-readable approximation
 *  for the rest.
 *  Used by Query.explanation() and unit tests. */
export function Decompile(expr: Expr | CompiledExpr): string {
    //TODO: Add a `predecence` parameter and parenthesize result as necessary
    if (typeof expr === 'function') {
        // CompiledExpr:
        return expr.sourceExpression ? Decompile(expr.sourceExpression) : "<expression>";
    } else if (Array.isArray(expr)) {
        // Operation:
        const op = expr[0];
        switch (op) {
            case '$':       return "$" + decompilePath(expr);
            case '?':       return expr[1] as string;
            case 'MISSING': return op;
            case 'NOT':     return "NOT " + Decompile(expr[1]);

            case '.':
                if (expr.length === 2)
                    return (expr[1] as string) + ".*";
                return decompilePath(expr);

            case 'META()': {
                let result = `META(${expr[1] as string})`;
                if (expr[2])
                    result += "." + (expr[2] as string);
                return result;
            }

            default:
                if (op.endsWith('()')) {
                    return op.slice(0, -2) + "(" + expr.slice(1).map(Decompile).join(", ") + ")";
                } else if (IsInfixBinaryOp(op)) {
                    return Decompile(expr[1]) + " " + op + " " + Decompile(expr[2]);
                } else if (op === '-' || op === '+') {
                    return op + Decompile(expr[1]);     // unary forms
                } else {
                    // A lame fallback producing a sort-of functional notation:
                    return op + "[" + expr.slice(1).map(Decompile).join(", ") + "]";
                }
        }
    } else if (!ExprIsLiteral(expr)) {
        // Dictionary template:
        return "{" + Object.getOwnPropertyNames(expr)
            .map( key => JSON.stringify(key) + ": " + Decompile(expr[key]) )
            .join(", ") + "}";
    } else {
        // Literals, and fallback for unhandled Operations:
        return JSON.stringify(expr);
    }
}


function decompilePath(expr: Operation): string {
    return expr.slice(1)
        .map( item => (typeof item === 'number') ? `[${item}]` : (item as string) )
        .join(".");
}

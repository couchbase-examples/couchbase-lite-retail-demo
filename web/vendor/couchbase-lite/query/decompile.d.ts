import { Expr } from './schema';
import { CompiledExpr } from './eval';
/** Decompiles a JSON query expression back to N1QL.
 *  ...sort of. It handles the most common things, and returns an invalid-but-readable approximation
 *  for the rest.
 *  Used by Query.explanation() and unit tests. */
export declare function Decompile(expr: Expr | CompiledExpr): string;

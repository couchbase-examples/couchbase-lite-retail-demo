import { EvalContext, Value, CompiledExpr } from './eval';
import { Expr, Operation } from './schema';
/** Thrown if an Expr accesses a data source that isn't present in the EvalContext. */
export declare class MissingDataSourceError extends Error {
}
/** Thrown if an Expr accesses a "$" query parameter that isn't present in the EvalContext. */
export declare class MissingParameterError extends Error {
}
/** Returns true if [name] is a valid Operator name. (Used by the N1QL parser.)
 *  > Note: The name must be uppercase. If it's a function, it must end with "()". */
export declare function IsValidOpcode(op: string): boolean;
/** Returns true if `fn` is the name of a function that can be called with `arity` args.
 *  (Used by the N1QL parser.)
 *  > Note: The string must be uppercase and end with "()". */
export declare function IsValidFunctionCall(fn: string, arity: number): boolean;
/** Returns true if `op` is a binary operator that's infix in N1QL syntax. (Used by Decompile.) */
export declare function IsInfixBinaryOp(op: string): boolean;
/** Returns true if `expr` is an Operation whose initial items match the following arguments. */
export declare function MatchOp(expr: Expr, ...target: Expr[]): expr is Operation;
/** Main compilation function. But for top-level expressions you should call EvalContext.compile()
 *  instead, because it will set the `sourceExpression` property. */
export declare function compile(expr: Expr, ctx: EvalContext): CompiledExpr;
/** The implementation of a user-defined N1QL function.
 *
 *  The arguments are passed as zero-arg functions that return a JSON value or `undefined`.
 *  (This allows you to conditionally evaluate arguments, which can help performance.)
 *
 *  Your function will return a JSON value or `undefined` (aka `MISSING`.)
 *
 *  Argument values are deeply read-only. You MUST NOT modify arrays or objects. If you need to
 *  return a modified version, make a copy and modify that.
 *
 *  By convention, most N1QL functions will return `MISSING` (`undefined`) if any argument is
 *  `MISSING`, and otherwise `NULL` (`null`) if any argument is `NULL`.
 *  You're not required to do this, but it's usually a good idea; it makes it easier for queries
 *  to handle missing or invalid data.
 *
 *  Most N1QL functions are deterministic or "pure", that is, given the same arguments they will
 *  return the same value. If your function is not, you must set the `nondeterminstic` option,
 *  else query optimizations might cache stale values and cause incorrect behavior.
 *  (Examples of non-deterministic functions are `RANDOM()` and `CURRENT_DATE()`.)
 *
 *  Your function MUST NOT access external mutable state, nor keep any mutable state between
 *  calls -- in particular, don't try to implement an aggregate function, it won't work!
 *  (We may add support for custom aggregate functions in the future.)
 *
 *  Avoid throwing exceptions under "normal" circumstances like an illegal argument value.
 *  Instead return `null`.
 *  Any exception thrown will be caught and logged, and treated as a return value of `null`. */
export type UserFunction = (...args: CompiledExpr[]) => Value;
/** Options for UserFunctions.
 *  @property nondeterministic  If true, the function may return different values given the same
 *      input. (For example, it might return a random number or the current time.) Setting this
 *      to true disables any query optimizations that might cache the result of a call. */
export type UserFunctionOptions = {
    minimumArgs?: number;
    maximumArgs?: number;
    nondeterministic?: boolean;
};
/** Registers a custom N1QL function.
 *  @param name  Function's name. Case-insensitive.
 *  @param implementation  The function itself. See the type `UserFunction` for details.
 *  @param options  Other options such as min/max arg counts. */
export declare function RegisterUserFunction(name: string, implementation: UserFunction, options?: UserFunctionOptions): void;
export declare function checkNumber(val: unknown, what: string): number;
export declare function checkString(val: unknown, what: string): string;

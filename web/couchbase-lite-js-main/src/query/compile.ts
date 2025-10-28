//
// query/compile.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { EvalContext, Value, DefinedValue, NonNullValue, CompiledExpr } from "./eval";
import { ExprIsLiteral, type Expr, type ExprDict, type Operation } from "./schema";
import { assert } from "@/util/assert";
import { RevFlagDeleted, revIsDeleted, type LocalRevision } from "@/database/internals";
import * as N1QL from "./N1QLFunctions";
import { N1QLParseError } from "./N1QLParser";
import type { JSONObject } from "@/couchbase-lite";


/*  Functions for compiling and evaluating expressions in the JSON query syntax.

    ## Compilation

    A compiled expression (`CompiledExpr`) is simply a zero-arg function that returns the result.
    The expression's arguments are captured in its closure in compiled form and evaluated/called
    when the CompiledExpr runs. That makes this a "tree walking" interpreter, as opposed to
    a bytecode interpreter, but it should be fast enough.

    A `CompiledExpr` may have a property `sourceExpression` [hey, it's JavaScript, functions are
    objects that can have properties!] that holds the source `Expr` it was compiled from.
    This isn't needed at runtime, but it's used to construct the human-readable explanation
    of a query. Any top-level expression compiled by `Compile` will have this property set.

    ## The Context

    The outer state that expressions use -- query parameters, the current document, etc. --
    live in a shared `EvalContext` object which is passed in at compile-time, and which is
    captured in the closures of expressions that need it.

    When evaluating a `CompiledExpr`, its `EvalContext` needs to be populated appropriately or
    an exception will be thrown:
    - Evaluating an unbound query ('$') parameter throws a `MissingParameterError`. This means
      the app forgot to set a value for a parameter.
    - Evaluating an unbound ANY/EVERY ('?') variable throws an `Error` -- this should be
      impossible unless there's a bug in the parser, or someone handcrafts an invalid JSON query.
    - Evaluating an unbound data source throws a `MissingDataSourceError`. This can happen
      normally while preparing a query, as it examines the WHERE clause to find comparisons between
      document properties and fixed values; in this situation the exception is caught.

    ## Aggregate Functions

    Compiling an aggregate function, like `SUM()`, adds an `Aggregate` object to the `EvalContext`.
    The compiled form of the function simply returns the Aggregate's current value.
    During evaluation of an aggregate query, the CompiledQuery doesn't output rows for documents;
    instead it calls the context's aggregators and lets each one evaluate its argument and update
    its aggregate value. Only after all the rows have been processed does it evaluate the result
    columns, which then incorporate the final results of the aggregators.

    ## References

    - https://docs.couchbase.com/cloud/n1ql/n1ql-language-reference/functions.html
    - https://docs.couchbase.com/couchbase-lite/current/c/query-n1ql-mobile-server-diffs.html
    - https://github.com/couchbase/couchbase-lite-core/wiki/JSON-Query-Schema#4-operations
    - https://github.com/couchbase/couchbase-lite-core/wiki/JSON-Query-Schema#8-n1ql-functions
 */


/** Thrown if an Expr accesses a data source that isn't present in the EvalContext. */
export class MissingDataSourceError extends Error { }

/** Thrown if an Expr accesses a "$" query parameter that isn't present in the EvalContext. */
export class MissingParameterError extends Error { }


/** Returns true if [name] is a valid Operator name. (Used by the N1QL parser.)
 *  > Note: The name must be uppercase. If it's a function, it must end with "()". */
export function IsValidOpcode(op: string): boolean {
    return op in SpecialOps
        || op in AggregateCompile
        || op in (new UnaryOp(Math.random))
        || op in (new BinaryOp(Math.random, Math.random))
        || op in UserFunctions;
}


/** Returns true if `fn` is the name of a function that can be called with `arity` args.
 *  (Used by the N1QL parser.)
 *  > Note: The string must be uppercase and end with "()". */
export function IsValidFunctionCall(fn: string, arity: number): boolean {
    assert(fn.endsWith('()'));
    if (arity === 1 && fn in (new UnaryOp(Math.random))) {
        return true;
    } else if (arity === 2 && fn in (new BinaryOp(Math.random, Math.random))) {
        return true;
    } else if (fn in SpecialOps) {
        const range = SpecialFnArity[fn] ?? [1, Infinity];
        return (arity >= range[0] && arity <= range[1]);
    } else if (fn in AggregateCompile) {
        return (arity === 1);
    } else if (fn in UserFunctions) {
        const def = UserFunctions[fn];
        return (arity >= def.options.minimumArgs! && arity <= def.options.maximumArgs!);
    } else {
        return false;
    }
}


/** Returns true if `op` is a binary operator that's infix in N1QL syntax. (Used by Decompile.) */
export function IsInfixBinaryOp(op: string): boolean {
    return !op.endsWith('()') && op in (new BinaryOp(Math.random, Math.random));
}


/** Returns true if `expr` is an Operation whose initial items match the following arguments. */
export function MatchOp(expr: Expr, ...target: Expr[]): expr is Operation {
    if (!Array.isArray(expr))
        return false;
    for (let i = 0; i < target.length; ++i)
        if (expr[i] !== target[i])
            return false;
    return true;
}


/** Main compilation function. But for top-level expressions you should call EvalContext.compile()
 *  instead, because it will set the `sourceExpression` property. */
export function compile(expr: Expr, ctx: EvalContext): CompiledExpr {
    if (!Array.isArray(expr)) {
        assert(expr !== undefined, "invalid Expr");
        if (ExprIsLiteral(expr))
            return (): Value => expr;
        else
            return CompileDict(expr, ctx);
    }
    const op = expr[0];

    try {

        // Is it an aggregate function?
        const aggCtor = AggregateCompile[op];
        if (aggCtor !== undefined) {
            // Aggregate function:
            if (!ctx.allowCompilingAggregates)
                throw new N1QLParseError(`Illegal use of aggregate function ${op} outside result column`);
            const aggregator = new aggCtor(expr, compile(expr[1], ctx));
            // Add the Aggregate to the context so it will get updated by the CompiledQuery:
            return ctx.compileAggregate(aggregator);
        }

        // Is it a typical unary or binary operator whose parameters are expressions?
        const arity = expr.length - 1;
        if (arity === 1) {
            const uc = new UnaryOp(compile(expr[1], ctx));
            if (uc[op])
                return uc[op].bind(uc);
        } else if (arity === 2) {
            const bc = new BinaryOp(compile(expr[1], ctx), compile(expr[2], ctx));
            if (bc[op])
                return bc[op].bind(bc);
        }

        // Handle other operators/functions:
        const specialOp = SpecialOps[op];
        if (specialOp)
            return specialOp(expr, ctx);

        const userFn = UserFunctions[op];
        if (userFn)
            return CompileUserFunction(expr, ctx, userFn);

        if (!op.endsWith('()'))
            throw new N1QLParseError(`unknown JSON query operator "${op}"`);
        else if (!IsValidOpcode(op))
            throw new N1QLParseError(`"${op}" is not a supported function`);
        else
            throw new N1QLParseError(`${op} cannot be called with ${arity} arguments`);
    } catch (x) {
        if (x instanceof N1QLParseError && x.sourceRange === undefined && expr.sourceTextStart)
            x.sourceRange = [expr.sourceTextStart, expr.sourceTextEnd ?? expr.sourceTextStart];
        throw x;
    }
}


//////// USER-DEFINED FUNCTIONS:


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
}


interface UserFunctionDef {
    readonly implementation : UserFunction;
    readonly options        : UserFunctionOptions;
}

const UserFunctions: Record<string,UserFunctionDef> = { };


/** Registers a custom N1QL function.
 *  @param name  Function's name. Case-insensitive.
 *  @param implementation  The function itself. See the type `UserFunction` for details.
 *  @param options  Other options such as min/max arg counts. */
export function RegisterUserFunction(name: string,
                                     implementation: UserFunction,
                                     options?: UserFunctionOptions): void
{
    if (!name.match(/^[a-zA-Z][a-zA-Z0-9_]+$/))
        throw Error(`N1QL function name "${name}" is not valid. Must be alphanumeric.`);
    const canonicalName = name.toUpperCase() + '()';
    if (IsValidOpcode(canonicalName))
        throw Error(`N1QL function ${name} already exists.`);
    UserFunctions[canonicalName] = {
        implementation,
        options: {
            minimumArgs: options?.minimumArgs ?? implementation.length,
            maximumArgs: options?.maximumArgs ?? implementation.length,
            nondeterministic: options?.nondeterministic ?? false
        }
    };
}


function CompileUserFunction(expr: Operation, ctx: EvalContext, def: UserFunctionDef): CompiledExpr {
    const name = expr[0];
    const args = compileArgs(expr, ctx);
    checkExpr(args.length >= def.options.minimumArgs! && args.length <= def.options.maximumArgs!,
              `invalid argument count for ${name}`);
    return () => {
        try {
            return def.implementation(...args);
        } catch (x) {
            console.error(`Exception thrown from user-defined N1QL function ${name}`, x);
            return null;
        }
    };
}


//////// UNARY OPERATIONS:


/** A class whose methods are implementations of unary operations. */
class UnaryOp {
    constructor(argf: CompiledExpr) {this.#argf = argf;}

    [op: string]: CompiledExpr; // Enables method lookup by name

    //---- ARRAYS:

    'ARRAY_AVG()' ()        {return this.#unaryOp(N1QL.array_avg);}

    'ARRAY_COUNT()' ()      {return this.#unaryOp(N1QL.array_count);}
    'ARRAY_IFNULL()' ()     {return this.#unaryOp(N1QL.array_ifnull);}
    'ARRAY_LENGTH()' ()     {return this.#unaryOp(N1QL.array_length);}
    'ARRAY_MIN()' ()        {return this.#unaryOp(N1QL.array_min);}
    'ARRAY_MAX()' ()        {return this.#unaryOp(N1QL.array_max);}
    'ARRAY_SUM()' ()        {return this.#unaryOp(N1QL.array_sum);}

    'EXISTS'()              {const arg = this.#argf(); return Array.isArray(arg) && arg.length > 0;}

    //---- LOGICAL:

    'NOT'()                 {return this.#unaryOp(a => !a);}

    //---- MATH:

    '+' ()                  {return this.#argf();}
    '-' ()                  {return this.#unaryMathOp(n => -n);}

    'ABS()' ()              {return this.#unaryMathOp(Math.abs);}
    'ACOS()' ()             {return this.#unaryMathOp(Math.acos);}
    'ASIN()' ()             {return this.#unaryMathOp(Math.asin);}
    'ATAN()' ()             {return this.#unaryMathOp(Math.atan);}
    'CEIL()' ()             {return this.#unaryMathOp(Math.ceil);}
    'COS()' ()              {return this.#unaryMathOp(Math.cos);}
    'DEGREES()' ()          {return this.#unaryMathOp(n => n * 180 / Math.PI);}
    'EXP()' ()              {return this.#unaryMathOp(Math.exp);}
    'FLOOR()' ()            {return this.#unaryMathOp(Math.floor);}
    'LN()' ()               {return this.#unaryMathOp(Math.log);}
    'LOG()' ()              {return this.#unaryMathOp(Math.log10);}
    'RADIANS()' ()          {return this.#unaryMathOp(n => n * Math.PI / 180);}
    'ROUND()' ()            {return this.#unaryMathOp(Math.round);}
    'ROUND_NEAREST()' ()    {return this.#unaryMathOp(Math.round);}
    'ROUND_EVEN()' ()       {return this.#unaryMathOp(N1QL.round_even);}
    'SIGN()' ()             {return this.#unaryMathOp(Math.sign);}
    'SIN()' ()              {return this.#unaryMathOp(Math.sin);}
    'SQRT()' ()             {return this.#unaryMathOp(Math.sqrt);}
    'TAN()' ()              {return this.#unaryMathOp(Math.tan);}
    'TRUNC()' ()            {return this.#unaryMathOp(Math.trunc);}

    //---- STRINGS:

    'LENGTH()'()            {return this.#unaryStringOp(N1QL.length);}
    'LOWER()'()             {return this.#unaryStringOp(str => str.toLowerCase() );}
    'UPPER()'()             {return this.#unaryStringOp(str => str.toUpperCase() );}

    //---- TYPES:

    'IS VALUED'   ()        {return N1QL.isvalued(this.#argf());}

    'ISARRAY()'   ()        {return this.#unaryOp(Array.isArray);}
    'ISATOM()'    ()        {return this.#unaryOp(N1QL.isatom);}
    'ISBOOLEAN()' ()        {return this.#unaryOp(N1QL.isboolean);}
    'ISNUMBER()'  ()        {return this.#unaryOp(N1QL.isnumber);}
    'ISOBJECT()'  ()        {return this.#unaryOp(N1QL.isobject);}
    'ISSTRING()'  ()        {return this.#unaryOp(N1QL.isstring);}
    'ISVALUED()'  ()        {return N1QL.isvalued(this.#argf());}
    'TOARRAY()'   ()        {return this.#unaryOp(N1QL.toarray);}
    'TOATOM()'    ()        {return N1QL.toatom(this.#argf());}
    'TOBOOLEAN()' ()        {return this.#unaryOp(N1QL.toboolean);}
    'TONUMBER()'  ()        {return this.#unaryOp(N1QL.tonumber);}
    'TOOBJECT()'  ()        {return this.#unaryOp(N1QL.toobject);}
    'TOSTRING()'  ()        {return this.#unaryOp(N1QL.tostring);}

    'IS_ARRAY()'  ()        {return this.#unaryOp(Array.isArray);}
    'IS_ATOM()'   ()        {return this.#unaryOp(N1QL.isatom);}
    'IS_BOOLEAN()'()        {return this.#unaryOp(N1QL.isboolean);}
    'IS_NUMBER()' ()        {return this.#unaryOp(N1QL.isnumber);}
    'IS_OBJECT()' ()        {return this.#unaryOp(N1QL.isobject);}
    'IS_STRING()' ()        {return this.#unaryOp(N1QL.isstring);}
    'IS_VALUED()' ()        {return N1QL.isvalued(this.#argf());}
    'TO_ARRAY()'  ()        {return this.#unaryOp(N1QL.toarray);}
    'TO_ATOM()'   ()        {return N1QL.toatom(this.#argf());}
    'TO_BOOLEAN()'()        {return this.#unaryOp(N1QL.toboolean);}
    'TO_NUMBER()' ()        {return this.#unaryOp(N1QL.tonumber);}
    'TO_OBJECT()' ()        {return this.#unaryOp(N1QL.toobject);}
    'TO_STRING()' ()        {return this.#unaryOp(N1QL.tostring);}

    'TYPE()'      ()        {return N1QL.type(this.#argf());}
    'TYPENAME()'  ()        {return N1QL.type(this.#argf());}


    #unaryOp(fn: (n: NonNullValue)=>Value): Value {
        const a = this.#argf();
        if (a === undefined) return undefined;
        if (a === null) return null;
        return fn(a);
    }

    /** This is unaryOp further specialized for numeric functions. */
    #unaryMathOp(fn: (n: number)=>Value): Value {
        const a = this.#argf();
        if (typeof a === 'number') return fn(a);
        else if (a === undefined) return undefined;
        else return null;
    }

    /** This is unaryOp further specialized for string functions. */
    #unaryStringOp(fn: (a: string)=>Value): Value {
        const a = this.#argf();
        if (typeof a === 'string') return fn(a);
        else if (a === undefined) return undefined;
        else return null;
    }

    readonly #argf: CompiledExpr;
}


//////// BINARY OPERATIONS:


/** A class whose methods are implementations of binary operations. */
class BinaryOp {
    constructor(fa: CompiledExpr, fb: CompiledExpr) {this.#fa = fa; this.#fb = fb;}

    [op: string]: CompiledExpr; // Enables method lookup by name


    //---- ARRAYS:

    'ARRAY_CONTAINS()' ()   {return this.#binaryOp(N1QL.array_contains);}

    //---- COMPARISON:

    '=' ()                  {return this.#binaryOp(N1QL.equals);}
    '!=' ()                 {return this.#binaryOp((a, b) => !N1QL.equals(a, b));}

    // These are undocumented but the N1QL test suite calls them...
    'EQ()' ()               {return this.#binaryOp((a, b) => N1QL.equals(a, b));}
    'LT()' ()               {return this.#binaryOp((a, b) => N1QL.compare(a, b) < 0);}
    'LE()' ()               {return this.#binaryOp((a, b) => N1QL.compare(a, b) <= 0);}
    'GT()' ()               {return this.#binaryOp((a, b) => N1QL.compare(a, b) > 0);}
    'GE()' ()               {return this.#binaryOp((a, b) => N1QL.compare(a, b) >= 0);}

    '<' ()                  {return this.#binaryOp((a, b) => N1QL.compare(a, b) < 0);}
    '<=' ()                 {return this.#binaryOp((a, b) => N1QL.compare(a, b) <= 0);}
    '>' ()                  {return this.#binaryOp((a, b) => N1QL.compare(a, b) > 0);}
    '>=' ()                 {return this.#binaryOp((a, b) => N1QL.compare(a, b) >= 0);}

    'MISSINGIF()' ()        {return N1QL.missingif(this.#fa(), this.#fb());}
    'NULLIF()' ()           {return N1QL.nullif(this.#fa(), this.#fb());}

    //---- LOGICAL:

    'AND' () {
        const a = this.#fa();
        if (!a) {
            if (a === undefined) return undefined;
            else if (a === null) return null;
            else return false;
        }
        const b = this.#fb();
        if (!b) {
            if (b === undefined) return undefined;
            else if (b === null) return null;
            else return false;
        }
        return true;
    }

    'OR' () {
        const a = this.#fa();
        if (a) return true;
        else if (a === undefined) return undefined;
        else if (a === null) return null;
        const b = this.#fb();
        if (b) return true;
        else if (b === undefined) return undefined;
        else if (b === null) return null;
        else return false;
    }

    //---- MATH:

    '+' ()                  {return this.#binaryMathOp((a, b) => a + b);}
    '-' ()                  {return this.#binaryMathOp((a, b) => a - b);}
    '*' ()                  {return this.#binaryMathOp((a, b) => a * b);}
    '/' ()                  {return this.#binaryMathOp(N1QL.div);}
    '%' ()                  {return this.#binaryMathOp((a, b) => a % b);}

    'ATAN2()' ()            {return this.#binaryMathOp(Math.atan2);}
    'POWER()' ()            {return this.#binaryMathOp(Math.pow);}
    'DIV()' ()              {return this.#binaryMathOp((a, b) => a / b);}
    'IDIV()' ()             {return this.#binaryMathOp(N1QL.idiv);}
    'ROUND()' ()            {return this.#binaryMathOp(N1QL.round);}
    'ROUND_NEAREST()' ()    {return this.#binaryMathOp(N1QL.round);}
    'ROUND_EVEN()' ()       {return this.#binaryMathOp(N1QL.round_even);}
    'TRUNC()' ()            {return this.#binaryMathOp(N1QL.trunc);}

    'COSINE_DISTANCE()' ()  {return N1QL.cosine_distance(this.#fa(), this.#fb());}

    //---- STRINGS:

    '||' ()                 {return this.#binaryStringOp((a, b) => a + b);}
    'CONTAINS()' ()         {return this.#binaryStringOp((a, b) => a.includes(b));}
    'LTRIM()' ()            {return this.#binaryStringOp(N1QL.ltrim);}
    'RTRIM()' ()            {return this.#binaryStringOp(N1QL.rtrim);}
    'TRIM()' ()             {return this.#binaryStringOp(N1QL.trim);}


    /** Helper function for compiling binary operators. Takes the args as CompiledExprs and a function.
     *  At runtime, if either arg is `undefined`, returns undefined.
     *  Else if either is `null`, returns null.
     *  Else applies the function to the args. */
    #binaryOp( fn: (a: NonNullValue, b: NonNullValue)=>Value): Value {
        const a = this.#fa(), b = this.#fb();
        if (a === undefined || b === undefined) return undefined;
        else if (a === null || b === null) return null;
        return fn(a, b);
    }

    /** This is binaryOp further specialized for numeric functions. */
    #binaryMathOp( fn: (a: number, b: number)=>Value): Value {
        const a = this.#fa(), b = this.#fb();
        if (typeof a === 'number' && typeof b === 'number') return fn(a, b);
        else if (a === undefined || b === undefined) return undefined;
        else return null;
    }

    /** This is binaryOp further specialized for string functions. */
    #binaryStringOp( fn: (a: string, b: string)=>Value): Value {
        const a = this.#fa(), b = this.#fb();
        if (typeof a === 'string' && typeof b === 'string') return fn(a, b);
        else if (a === undefined || b === undefined) return undefined;
        else return null;
    }

    readonly #fa: CompiledExpr;
    readonly #fb: CompiledExpr;
};


//////// AGGREGATES:


type AggregateCtor = new(expr: Expr, compiled: CompiledExpr) => N1QL.Aggregate;

/** Maps aggregate function names to Aggregate subclass constructor functions. */
const AggregateCompile: Record<string,AggregateCtor> = {
    'ARRAY_AGG()':  N1QL.ArrayAggregate,
    'AVG()':        N1QL.AvgAggregate,
    'COUNT()':      N1QL.CountAggregate,
    'MAX()':        N1QL.MaxAggregate,
    'MIN()':        N1QL.MinAggregate,
    'SUM()':        N1QL.SumAggregate,
};


//////// "SPECIAL" OPERATIONS:


/** Range of argument counts of functions in SpecialOps; defaults to [1, Infinity]. */
const SpecialFnArity: Record<string, [number,number]> = {
    'E()':                  [0, 0],
    'PI()':                 [0, 0],
    'EUCLIDEAN_DISTANCE()': [2, 3],
    'GREATEST()':           [2, Infinity],
    'LEAST()':              [2, Infinity],
    'LIKE()':               [2, 2],
    'META()':               [1, 2],
    'REGEXP_CONTAINS()':    [2, 2],
    'REGEXP_LIKE()':        [2, 2],
    'REGEXP_POSITION()':    [2, 2],
    'REGEXP_REPLACE()':     [3, 4]
};


/** Table of special operations that are not unary or binary, or take a variable number of args,
 *  or whose args are not all sub-expressions.
 *  Keys are operator/function names, values are functions that compile them. */
const SpecialOps: Record<string, (expr: Operation, ctx: EvalContext)=>CompiledExpr> = {

    '.': CompilePath,

    '?': CompileVar,

    '[]': CompileArray,

    '$': (expr, ctx) => {
        const name = checkString(expr[1], "$");
        ctx.parameterNames.add(name);
        return () => {
            const val = ctx.parameters.get(name);
            if (val === undefined)
                throw new MissingParameterError(`undefined query parameter $${name}`);
            return val;
        };
    },

    '_.': ([_op, dictx, keyx]: Operation, ctx) => {
        const fdict = compile(dictx, ctx);
        const key = checkString(keyx, "2nd arg of '_.'");
        return () => {
            const dict = fdict();
            return isDictionary(dict) ? dict[key] : undefined;
        };
    },

    'ANY':           CompileAny,
    'EVERY':         CompileAny,
    'ANY AND EVERY': CompileAny,

    'BETWEEN':   CompileBetween,
    'BETWEEN()': CompileBetween,

    'CASE': (expr, ctx) => {
        const arity = expr.length - 1;
        const argsf = compileArgs(expr, ctx);
        if (expr[1] === null) {
            // `CASE WHEN ...` with no value:
            return () => {
                let i;
                for (i = 1; i + 1 < arity; i += 2) {
                    if (argsf[i]())
                        return argsf[i + 1]();
                }
                return (i < arity) ? argsf[i]() : null;
            };
        } else {
            // `CASE value WHEN ...`:
            return () => {
                const value = argsf[0]();
                let i;
                for (i = 1; i + 1 < arity; i += 2) {
                    if (N1QL.equals(value, argsf[i]()))
                        return argsf[i + 1]();
                }
                return (i < arity) ? argsf[i]() : null;
            };
        }
    },

    'EXISTS': (_expr, _ctx) => {
        // const select = expr[1] as unknown as Select;
        throw new N1QLParseError("sorry, EXISTS is currently unimplemented");    //TODO
    },

    'IN':       CompileIn,
    'NOT IN':   CompileIn,

    'IS':       CompileIs,
    'IS NOT':   CompileIs,

    'LIKE':     CompileLike,

    'MISSING':  () => () => undefined,

    //---- Functions with variable numbers of arguments or other special handling:

    'ARRAY()':  CompileArray,

    'E()':      () => () => Math.E,
    'PI()':     () => () => Math.PI,

    'CONCAT()': (expr, ctx) => {
        const argfs = compileArgs(expr, ctx);
        return () => {
            const strings: string[] = [];
            for (const argf of argfs) {
                const arg = argf();
                if (arg === undefined) return undefined;
                if (typeof arg !== 'string') return null;
                strings.push(arg);
            }
            return strings.join("");
        };
    },

    'DATE_ADD_MILLIS()':    CompileDateAdd,
    'DATE_ADD_STR()':       CompileDateAdd,
    'DATE_DIFF_MILLIS()':   CompileDateDiff,
    'DATE_DIFF_STR()':      CompileDateDiff,
    'MILLIS_TO_STR()':      CompileMillisTo,
    'MILLIS_TO_UTC()':      CompileMillisTo,
    'STR_TO_MILLIS()':      CompileDateStrTo,
    'STR_TO_UTC()':         CompileDateStrTo,

    'MILLIS_TO_TZ()': ([_op, millisx, tzx]: Operation, ctx) => {
        const millisf = compile(millisx, ctx), tzf = compile(tzx, ctx);
        return () => {
            const millis = millisf(), tz = tzf();
            if (typeof millis !== 'number' || typeof tz !== 'string')
                return null;
            return N1QL.millis_to_tz(millis, tz);
        };
    },

    'STR_TO_TZ()': ([_op, strx, tzx]: Operation, ctx) => {
        const strf = compile(strx, ctx), tzf = compile(tzx, ctx);
        return () => {
            const str = strf(), tz = tzf();
            if (typeof str !== 'string' || typeof tz !== 'string')
                return null;
            return N1QL.str_to_tz(str, tz);
        };
    },

    'EUCLIDEAN_DISTANCE()': ([_op, a, b, power]: Operation, ctx) => {
        const fa = compile(a, ctx);
        const fb = compile(b, ctx);
        if (power !== undefined)
            power = checkNumber(power, "3rd arg (power) to EUCLIDEAN_DISTANCE()");
        return (): Value => N1QL.euclidean_distance(fa(), fb(), power);
    },

    'GREATEST()': (expr, ctx) => {
        const argfs = compileArgs(expr, ctx);
        return () => N1QL.greatest_or_least(argfs, 1);
    },

    'IFMISSING()': (expr, ctx) => {
        const argfs = compileArgs(expr, ctx);
        return () => {
            for (const argf of argfs) {
                const arg = argf();
                if (arg !== undefined) return arg;
            }
            return null;
        };
    },

    'IFNULL()': (expr, ctx) => {
        const argfs = compileArgs(expr, ctx);
        return () => {
            for (const argf of argfs) {
                const arg = argf();
                if (arg !== null) return arg;
            }
            return null;
        };
    },

    'IFMISSINGORNULL()': CompileCoalesce,
    'COALESCE()':        CompileCoalesce,

    'LEAST()': (expr, ctx) => {
        const argfs = compileArgs(expr, ctx);
        return () => N1QL.greatest_or_least(argfs, -1);
    },

    'LIKE()': CompileLike,

    'META()': ([_op, alias, property]: Operation, ctx) => {
        alias = checkString(alias, "data source in 'META()'");
        checkExpr(ctx.sourceTypes.get(alias) !== 'unnest',
                  "META() cannot be used on an UNNEST");
        if (property !== undefined)
            checkExpr(['id', 'sequence', 'deleted', 'expires'].includes(property as string),
                      `invalid META() property "${property as string}"`);
        return () => {
            let rev = ctx.row?.getSourceRevision(alias);
            if (rev === undefined || rev.id === undefined)
                throw new MissingDataSourceError(`"META(${alias})" is not available`);
            switch (property) {
                case 'id':       return rev.id;
                case 'sequence': return rev.seq;
                case 'deleted':  return ((rev.flags ?? 0) & RevFlagDeleted) !== 0;
                case 'expires':  return rev.expires;
                case undefined: {
                    const meta: JSONObject = {
                        id:       rev.id,
                        sequence: rev.seq
                    };
                    if (revIsDeleted(rev))
                        meta.deleted = true;
                    if (rev.expires !== undefined)
                        meta.expires = rev.expires;
                    return meta;
                }
                default: return undefined;
            }
        };
    },

    'REGEXP_CONTAINS()': CompileRegexp,
    'REGEXP_LIKE()':     CompileRegexp,
    'REGEXP_POSITION()': CompileRegexp,

    'REGEXP_REPLACE()': ([_op, strx, patx, replx, limitx]: Operation, ctx) => {
        const strf = compile(strx, ctx);
        const regex = RegExp(checkString(patx, `arg 2 of REGEXP_REPLACE()`), "g");
        const replacementf = compile(replx, ctx);
        const limit = limitx !== undefined ? checkNumber(limitx, `arg 4 of REGEXP_REPLACE()`) : 1e9;
        return () => {
            const str = strf(), replacement = replacementf();
            if (typeof str !== 'string' || typeof replacement !== 'string')
                return str;
            let n = 1;
            return str.replace(regex, (match) => (n++ <= limit) ? replacement : match);
        };
    }
};


/** Compiles 'ANY', 'EVERY', 'ANY AND EVERY'. */
function CompileAny([op, varName, array, test]: Operation, ctx: EvalContext) {
    const isAny = (op === 'ANY');
    const isAnyAndEvery = (op === 'ANY AND EVERY');
    varName = checkString(varName, `variable name in ${op}`);
    const arrayf = compile(array, ctx);
    const testf = compile(test, ctx);
    return () => {
        const arrayVal = arrayf();
        if (!Array.isArray(arrayVal)) return false;
        if (isAnyAndEvery && arrayVal.length === 0)
            return false;
        try {
            for (const item of arrayVal) {
                ctx.variables[varName] = item;
                if (testf()) {
                    if (isAny) return true;
                } else {
                    if (!isAny) return false;
                }
            }
            return !isAny;
        } finally {
            delete ctx.variables[varName];
        }
    };
}


/** Compiles the ['[]',...] operator, also known as 'ARRAY()', which evaluates its args and
 *  returns the results as an array. */
function CompileArray(expr: Operation, ctx: EvalContext): CompiledExpr {
    if (argsAreLiteral(expr)) {
        const array = expr.slice(1);
        Object.freeze(array);
        return () => array;
    } else {
        const argfs = compileArgs(expr, ctx);
        return () => {
            const result: DefinedValue[] = [];
            for (const argf of argfs) {
                const arg = argf();
                if (arg === undefined) return undefined;
                result.push(arg);
            }
            return result;
        };
    }
}


function CompileBetween([_op, valx, minx, maxx]: Operation, ctx: EvalContext): CompiledExpr {
    const fval = compile(valx, ctx), fmin = compile(minx, ctx), fmax = compile(maxx, ctx);
    return () => {
        let val = fval(), min = fmin(), max = fmax();
        if (val === undefined || min === undefined || max === undefined) return undefined;
        if (val === null || min === null || max === null) return null;
        return N1QL.compare(min, val) <= 0 && N1QL.compare(max, val) >= 0;
    };
}


function CompileCoalesce(expr: Operation, ctx: EvalContext): CompiledExpr {
    const argfs = compileArgs(expr, ctx);
    return () => {
        for (const argf of argfs) {
            const arg = argf();
            if (arg !== undefined && arg !== null) return arg;
        }
        return null;
    };
}


function CompileDateAdd(expr: Operation, ctx: EvalContext) {
    const argfs = compileArgs(expr, ctx);
    return () => {
        const date = argfs[0](), n = argfs[1](), part = argfs[2]();
        if ((typeof date !== 'string' && typeof date !== 'number')
                 || typeof n !== 'number' || typeof part !== 'string')
            return null;
        return N1QL.date_add(date, n, part);
    };
}


function CompileDateDiff(expr: Operation, ctx: EvalContext) {
    const argfs = compileArgs(expr, ctx);
    return () => {
        const date1 = argfs[0](), date2 = argfs[1](), part = argfs[2]();
        if ((typeof date1 !== 'string' && typeof date1 !== 'number')
                || (typeof date2 !== 'string' && typeof date2 !== 'number')
                || typeof part !== 'string')
            return null;
        return N1QL.date_diff(date1, date2, part);
    };
}


/** Compiles a dictionary/object, which evaluates to a dict with the same keys, and its values
 *  replaced by the result of evaluating them. */
function CompileDict(dict: ExprDict, ctx: EvalContext): CompiledExpr {
    const template = new Map<string,CompiledExpr | DefinedValue>();
    let nonliteralValues = false;
    for (const key of Object.getOwnPropertyNames(dict)) {
        const value = dict[key];
        if (ExprIsLiteral(value)) {
            template.set(key, value);
        } else {
            template.set(key, compile(value, ctx));
            nonliteralValues = true;
        }
    }
    if (nonliteralValues) {
        return (): Value => {
            const result: JSONObject = {};
            for (let [key, valOrFn] of template) {
                let val: Value;
                if (typeof valOrFn === 'function') {
                    val = valOrFn();
                    if (val === undefined) continue;
                } else {
                    val = valOrFn;
                }
                result[key] = val;
            }
            return result;
        };
    } else {
        Object.freeze(dict);
        return () => dict;
    }
}


/** Compiles both `IN` and `NOT IN`. */
function CompileIn([op, lhsx, arrayx]: Operation, ctx: EvalContext): CompiledExpr {
    checkExpr(Array.isArray(arrayx), "invalid right-hand-side of IN");
    const expected = (op === 'IN');
    const lhsf = compile(lhsx, ctx);
    if (arrayx[0] === '[]') {
        // RHS is an array literal:
        if (argsAreLiteral(arrayx)) {
            // Optimization if the RHS items are all literals:
            const items = new Set<Value>(arrayx.slice(1));
            return () => {
                const lhs = lhsf();
                if (lhs === undefined || lhs === null)
                    return lhs;
                return items.has(lhs) === expected;
            };
        } else {
            const arrayf = arrayx.map( item => compile(item, ctx) );
            return () => {
                const lhs = lhsf();
                if (lhs === undefined || lhs === null)
                    return lhs;
                return arrayf.some( item => N1QL.equals(item(), lhs) ) === expected;
            };
        }
    } else {
        // General case: equivalent to ARRAY_CONTAINS()
        const arrayf = compile(arrayx, ctx);
        return () => {
            const lhs = lhsf(), array = arrayf();
            if (lhs === undefined || array === undefined) return undefined;
            if (lhs === null || !Array.isArray(array)) return null;
            return N1QL.array_contains(array, lhs) === expected;
        };
    }
}


/** Compiles both `IS` and `IS NOT`, with special cases when the RHS is `NULL` or `MISSING`. */
function CompileIs([op, lhsx, rhs]: Operation, ctx: EvalContext): CompiledExpr {
    const expected = (op === 'IS');
    const lhsf = compile(lhsx, ctx);
    if (rhs === null) {
        // 'IS [NOT] NULL' is weird in that, when the LHS is MISSING, it returns MISSING.
        return (): Value => {
            const lhs = lhsf();
            return (lhs === undefined) ? undefined : ((lhs === null) === expected);
        };
    } else if (Array.isArray(rhs) && rhs[0] === 'MISSING') {
        // 'IS MISSING':
        return (): Value => (lhsf() === undefined) === expected;
    } else {
        const rhsf = compile(rhs, ctx);
        return (): Value => N1QL.equals(lhsf(), rhsf()) === expected;
    }
}


function CompileLike([_op, strx, patx]: Operation, ctx: EvalContext): CompiledExpr {
    // The RHS of LIKE is almost always a string literal, in which case we can optimize
    // by predetermining the mode, and precomputing the RegExp if necessary:
    const fstr = compile(strx, ctx);
    if (typeof patx === 'string') {
        const [mode, literal] = N1QL.likeMode(patx);
        switch (mode) {
            case 0:  return () => unaryStringOp(fstr, (str) => str === literal);
            case 1:  return () => unaryStringOp(fstr, (str) => str.startsWith(literal));
            case 2:  return () => unaryStringOp(fstr, (str) => str.endsWith(literal));
            default: {
                const regexp = N1QL.regexpFromLike(literal);
                return () => unaryStringOp(fstr, (str) => regexp.test(str));
            }
        }
    } else {
        const fpat = compile(patx, ctx);
        return () => binaryStringOp(fstr, fpat, N1QL.like);
    }
}


// Compiles a [".",...] expression.
function CompilePath([_op, alias, ...pathx]: Operation, ctx: EvalContext): CompiledExpr {
    // Assumes the path has been normalized to start with the collection/result alias,
    // and each path component is split into its own array item.
    alias = checkString(alias, "data source in '.'");
    const path = pathx as Array<string|number>;

    const resultExpr = ctx.results.get(alias);
    if (resultExpr !== undefined) {
        // If this is a reference to a result, use its value:
        if (path.length === 0)
            return resultExpr;
        else
            return () => follow(path, resultExpr());
    } else {
        // Otherwise it's from a data source:
        const isRevision = (ctx.sourceTypes.get(alias) !== 'unnest');
        return () => {
            let revOrValue = ctx.row?.dataSources.get(alias);
            if (revOrValue === undefined) {
                throw new MissingDataSourceError(`"${alias}" is not available, in property "${alias}.${path.join('.')}"`);
            }
            revOrValue = isRevision ? (revOrValue as LocalRevision).body : revOrValue;
            return follow(path, revOrValue as DefinedValue);
        };
    }
}


function CompileMillisTo([op, millisx, formatx]: Operation, ctx: EvalContext) {
    checkExpr(formatx === undefined, `format strings are not supported in ${op}`);  //TODO
    const millisf = compile(millisx, ctx);
    const fn = (op === 'MILLIS_TO_STR()') ? N1QL.millis_to_str : N1QL.millis_to_utc;
    return () => {
        const millis = millisf();
        if (typeof millis !== 'number')
            return null;
        return fn(millis);
    };
}


function CompileDateStrTo([op, datex, formatx]: Operation, ctx: EvalContext) {
    checkExpr(formatx === undefined, `format strings are not supported in ${op}`);  //TODO
    const datef = compile(datex, ctx);
    const fn = (op === 'STR_TO_MILLIS()') ? N1QL.str_to_millis : N1QL.str_to_utc;
    return () => {
        const date = datef();
        if (typeof date !== 'string')
            return null;
        return fn(date);
    };
}


function CompileRegexp([op, strx, rex]: Operation, ctx: EvalContext): CompiledExpr {
    const strf = compile(strx, ctx);
    let reStr = checkString(rex, `arg 2 of ${op}`);
    if (op === 'REGEXP_LIKE()')
        reStr = `^${reStr}$`;

    let regex: RegExp;
    try {
        regex = RegExp(reStr);
    } catch (x) {
        if (x instanceof SyntaxError)
            throw new N1QLParseError(`invalid regular expression "${rex as string}"`);
        else
            throw x;
    }

    if (op === 'REGEXP_POSITION()') {
        return () => {
            const str = strf();
            return typeof str === 'string' ? str.search(regex) : -1;
        };
    } else {
        return () => {
            const str = strf();
            return typeof str === 'string' && regex.test(str);
        };
    }
}


// Compiles a ["?",...] expression.
function CompileVar(expr: Operation, ctx: EvalContext): CompiledExpr {
    const name = checkString(expr[1], "?");
    const path = expr.slice(2) as Array<string|number>;
    return () => {
        const val = ctx.variables[name];
        if (val === undefined) throw new N1QLParseError(`undefined variable ?${name}`);
        return follow(path, val);
    };
}


// subroutine of CompilePath and CompileVar
function follow(path: Array<string|number>, value: Value): Value {
    for (const key of path) {
        if (Array.isArray(value)) {
            if (typeof key !== 'number')
                return undefined;
            else if (key >= 0)
                value = value[key];
            else
                value = value[value.length + key];
        } else if (typeof value === 'object' && value !== null) {
            if (typeof key !== 'string')
                return undefined;
            else
                value = value[key];
        } else {
            return undefined;
        }
    }
    return value;
}


//////// HELPER FUNCTIONS:


function checkExpr(assertion: boolean, message: string): asserts assertion {
    if (!assertion)
        throw new N1QLParseError(message);
}


export function checkNumber(val: unknown, what: string): number {
    checkExpr(typeof val === 'number', `${what} must be a number`);
    return val;
}


export function checkString(val: unknown, what: string): string {
    checkExpr(typeof val === 'string', `${what} must be a string`);
    return val;
}


/** Compiles each arg and returns them as an array. */
function compileArgs(expr: Operation, ctx: EvalContext): CompiledExpr[] {
    return expr.slice(1).map( a => compile(a, ctx) );
};


/** Returns true if all args are literals. */
function argsAreLiteral(expr: Operation): boolean {
    // (also checks the op at index 0, but that's always a literal string so it doesn't matter.)
    return expr.every(ExprIsLiteral);
};


/** If `argf` evaluates to a string, pass it to `fn`; else return null or undefined. */
function unaryStringOp(argf: CompiledExpr, fun: (a: string)=>Value): Value {
    const a = argf();
    if (typeof a === 'string') return fun(a);
    else if (a === undefined) return undefined;
    else return null;
}


/** If `fa` and `fb` evaluate to strings, pass them to `fn`; else return null or undefined. */
function binaryStringOp(fa: CompiledExpr, fb: CompiledExpr, fun: (a: string, b: string)=>Value): Value {
    const a = fa(), b = fb();
    if (typeof a === 'string' && typeof b === 'string') return fun(a, b);
    else if (a === undefined || b === undefined) return undefined;
    else return null;
}


/** Returns true if its argument is a dictionary/object. */
function isDictionary(val: Value) : val is JSONObject {
    return typeof val === "object" && !Array.isArray(val) && val !== null;
}

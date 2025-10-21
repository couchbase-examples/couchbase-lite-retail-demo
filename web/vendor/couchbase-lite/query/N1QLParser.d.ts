import { Expr, Operation, Select } from './schema';
/** Exception thrown by syntax or semantic errors in a N1QL query. */
export declare class N1QLParseError extends Error {
    constructor(message: string);
    constructor(message: string, sourceStart: number, sourceEnd: number);
    /** @internal */
    constructor(message: string, sourceOperation: Operation);
    sourceRange?: [number, number];
}
/** Parses a N1QL "SELECT" statement to JSON. */
export declare function ParseSelect(n1ql: string): Select;
/** Parses a N1QL expression to JSON. */
export declare function ParseExpression(n1ql: string): Expr;

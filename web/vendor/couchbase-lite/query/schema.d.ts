/** A parsed N1QL expression, in LiteCore's JSON query schema. */
export type Expr = Operation | LiteralExpr | ExprDict;
/** A nontrivial expression that isn't just a literal value. First item is the opcode.
 *  The `aliasAdded` property is set by Normalize() when it adds a source alias to a '.' op. */
export type Operation = [string, ...Expr[]] & OperationMeta;
/** A template object/dictionary whose values are Exprs to be evaluated. */
export type ExprDict = {
    [key: string]: Expr;
};
/** A literal, constant value as an Expr. */
export type LiteralExpr = null | boolean | number | string;
/** True if an Expr is a literal value. */
export declare function ExprIsLiteral(expr: Expr): expr is LiteralExpr;
/** Metadata properties attached to an Operation. */
export interface OperationMeta {
    sourceTextStart?: number;
    sourceTextEnd?: number;
    aliasAdded?: boolean;
}
/** A parsed SELECT statement, in LiteCore's JSON query schema.. */
export interface Select {
    WHAT: ResultColumn[];
    FROM: DataSource[];
    WHERE?: Expr;
    HAVING?: Expr;
    DISTINCT?: boolean;
    GROUP_BY?: Expr[];
    ORDER_BY?: Expr[];
    LIMIT?: Expr;
    OFFSET?: Expr;
}
/** An item of the WHAT property of a Select. */
export type ResultColumn = string | Expr | ['AS', Expr, string];
/** An item of the FROM property of a Select. */
export type DataSource = FromSource | JoinSource | UnnestSource;
export interface BaseDataSource {
    AS?: string;
}
export interface FromSource extends BaseDataSource {
    COLLECTION: string;
    SCOPE?: string;
}
export interface JoinSource extends FromSource {
    JOIN: JoinType;
    ON: Expr;
}
export interface UnnestSource extends BaseDataSource {
    UNNEST: Expr;
}
/** Supported join types. 'OUTER' is equivalent to 'RIGHT OUTER'. */
export type JoinType = 'INNER' | 'OUTER' | 'LEFT OUTER' | 'CROSS';

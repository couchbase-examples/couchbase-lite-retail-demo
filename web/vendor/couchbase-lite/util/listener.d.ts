/** A reference to a registered listener, which allows you to remove the listener by calling
 *  its `remove` method. In TypeScript you can also use it with the `using` keyword. */
export declare class ListenerToken {
    #private;
    constructor(destructor: () => void);
    remove(): void;
    [Symbol.dispose](): void;
}

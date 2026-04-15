/**
 * Public entrypoint for `@fest-lib/object`.
 *
 * This barrel re-exports the core reactive primitives, subscription helpers,
 * assignment/binding helpers, and the internal symbols/utilities that other
 * Fest packages rely on.
 */
export * from "./wrap/AssignObject";
export * from "./core/Assigned";
export * from "./core/Mainline";
export * from "./core/Primitives";

/** Internal symbols and low-level helpers that other packages sometimes need directly. */
export { $triggerLess, $trigger, $affected } from "./wrap/Symbol";
export { safe, unwrap, deref, addToCallChain, wrapSetAsArray } from "./wrap/Utils";
export { type refValid, type subValid } from "./wrap/Utils";

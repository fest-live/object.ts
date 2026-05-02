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
export type { AffectedCallback, AffectedConfig, AffectedOptions, EffectCallback, EffectConfig, EffectEvent, EffectOptions, TriggerControl, TriggerFilterList, TriggerName } from "./core/Subscript";

/** Internal symbols and low-level helpers that other packages sometimes need directly. */
export { $triggerLess, $triggerLock, $triggerControl, $trigger, $affected } from "./wrap/Symbol";
export { safe, unwrap, deref, addToCallChain, wrapSetAsArray } from "./wrap/Utils";
export { type observeValid, type subValid } from "./wrap/Utils";

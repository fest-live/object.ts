/**
 * Shared symbol registry for the `object.ts` reactive runtime.
 *
 * These symbols form the hidden protocol used across wrappers, proxies,
 * registries, and refs so internal bookkeeping does not collide with user keys.
 */
// @ts-ignore
Symbol.observable  ||= Symbol.for('observable'); // @ts-ignore
Symbol.subscribe   ||= Symbol.for("subscribe"); // @ts-ignore
Symbol.unsubscribe ||= Symbol.for("unsubscribe");

/** Internal symbol keys used by proxies, refs, and subscription registries. */
export const $fxy          = Symbol.for("@fix");
export const $value        = Symbol.for("@value");
export const $extractKey$  = Symbol.for("@extract");
export const $originalKey$ = Symbol.for("@origin");
export const $registryKey$ = Symbol.for("@registry");
export const $target       = Symbol.for("@target");
export const $rootKey$     = Symbol.for("@root");
export const $nodeKey$     = Symbol.for("@node");
export const $behavior     = Symbol.for("@behavior");
export const $promise      = Symbol.for("@promise");
export const $triggerLess  = Symbol.for("@trigger-less");
export const $triggerLock  = Symbol.for("@trigger-lock");
export const $trigger      = Symbol.for("@trigger");
export const $affected    = Symbol.for("@subscribe");
export const $isNotEqual   = Symbol.for("@isNotEqual");

// @ts-ignore
Symbol.observable  ||= Symbol.for('observable'); // @ts-ignore
Symbol.subscribe   ||= Symbol.for("subscribe"); // @ts-ignore
Symbol.unsubscribe ||= Symbol.for("unsubscribe");

//
export const $value        = Symbol.for("@value");
export const $extractKey$  = Symbol.for("@extract");
export const $originalKey$ = Symbol.for("@origin");
export const $registryKey$ = Symbol.for("@registry");
export const $rootKey$     = Symbol.for("@root");
export const $nodeKey$     = Symbol.for("@node");

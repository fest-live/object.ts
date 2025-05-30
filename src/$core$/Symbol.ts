// @ts-ignore
Symbol.observable ||= Symbol.for('observable')

// @ts-ignore
Symbol.subscribe ||= Symbol.for("subscribe");

// @ts-ignore
Symbol.unsubcribe ||= Symbol.for("unsubcribe");

//
export const $value = Symbol.for("@value");
export const $extractKey$  = Symbol.for("@extract");
export const $originalKey$ = Symbol.for("@origin");
export const $registryKey$ = Symbol.for("@registry");

# Planned for V2 (or V3)

- `affected` now uses the V2 callback shape: `(value, name, oldValue, op, trigger)`.
- `affected(..., triggersOrOptions?)` accepts either trigger lists or `{ affectTypes, triggerImmediately }`.
- Omitted trigger filters are `["*"]`, and `["*"]` / `["all"]` match every trigger.
- `triggerImmediately` controls the first snapshot callback, which is emitted as trigger `"initial"`.
- Current trigger names include `initial`, `setter`, and `manual`; custom trigger names can be added by passing the fifth argument to registry `trigger()`.
- Reactive values expose `$triggerControl` for enabling/disabling trigger types; `$trigger` can also emit custom trigger names.
- In general `subscribe` system will be re-written for more targetted and exact (typed) triggering.

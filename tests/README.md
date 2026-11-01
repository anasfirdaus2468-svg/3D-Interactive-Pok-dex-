# Verification plan

This folder plans verification for the Pokédex frontend, whose source and test runner are not yet imported. Select frontend tools after its D1 audit. The separate authentication API has runnable HTTP/configuration tests in [api/test/](../api/test/); run `npm test` from `api/`.

Prioritize checks that exercise behavior and failure paths:

- Device transitions for both variants, including the agreed lid/power/battery rules and pointer/touch/keyboard inputs.
- Consistent selected Pokémon/form and types/BST between device and overview; independent Entries and Tracker modes.
- Seen/caught, profile, badge, and customization persistence across reload, plus agreed export/import and migration behavior.
- Rotomaton grounded answers, out-of-scope questions, unavailable context/provider, and personality presets, including extreme/unhelpful moods.
- Sticker placement after rotation/zoom and switching variants; invalid/oversized upload rejection and deletion once supported.
- Bounded scene/texture/listener/animation use across repeated navigation and model switches.
- Accessible controls outside small 3D surfaces, the agreed lighter/error path, and reduced-motion behavior for companions.

Use the repeatable scenarios in [performance](../docs/performance.md) for profiling. Numeric pass/fail budgets remain OPEN (D4); do not invent baseline results.

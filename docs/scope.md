# Project scope

This records the established project context, not a source-code audit of the active prototype. The Pokédex frontend remains outside this repository. A separate, runnable [authentication API](../api/README.md) now provides account registration, login/logout, protected identity, password changes, and server-side sessions; frontend integration remains pending.

## Feature boundaries

| Area | Established prototype behavior | Work to carry into this repository |
| --- | --- | --- |
| Account authentication | New API implemented in this repository; not part of the imported prototype | Connect frontend forms and future account-owned trainer/tracker data; decide email verification/recovery delivery |
| Device variants | Dual-screen device with D-pad; Game Boy-like device with rotary knob | Import both models and document each variant's supported controls |
| Device interactions | Rotate, zoom, hover, open/close lid where applicable, power on/off, open/close rear cover, remove battery | Preserve interactions; specify state transitions and input handling |
| Entries | 2D artwork and 3D display; Pokémon types and base stat totals (BST) | Define catalog/form identifiers and keep device selection aligned with the website overview |
| Tracker Progress | Separate mode for seen/caught progress | Define persistence, export, and per-form behavior before wiring storage |
| Trainer profiles | Gym badge progress and Pokémon forms; customizable appearance | Generalize the sample profile and decide how profiles are stored |
| Rotomaton | Pokédex-only conversation with cheerful, grouchy, peckish, and childish personalities | Define grounding, provider/backend integration, and unavailable-answer behavior |
| Device customization | Color slider and sticker placement; repeated stickers used during prototyping | Replace repeated placeholders with a stock catalog and define placement persistence |
| Uploaded stickers | Planned | Specify supported formats, size limits, validation, storage, and removal |
| Pixel companions | Roaming Pokémon sprites inspired by Poké Pelago | Preserve the effect with bounded rendering work and motion controls |
| Pokémon model interaction | Display exists; additional interactions postponed | Keep deferred until the device performance gate is met |

## Data and presentation rules

- The website overview exposes Pokémon types and BST. The 3D device adds play and interaction; it is not the only place to access the data.
- The two application modes are Pokédex Entries and Tracker Progress. A different physical device variant does not imply a different catalog or tracker.
- The Pokémon model comes from the first Switch game that Pokémon appeared in. Under this rule, Mareanie and Toxapex use Sword/Shield models even though they also appear in Scarlet/Violet. Availability, form exceptions, and provenance still need an explicit manifest.
- Seiko Shinonome is a sample trainer for a reusable profile system. Her personalized Chingling has a subtly different ribbon color. Treat this as optional fixture content, not a universal species appearance or required trainer.
- Profiles are not restricted to a white theme. Device color and profile appearance are separate customization concerns.
- Repeating stickers in prototype screenshots do not define the final catalog.

## Rotomaton boundary

Rotomaton answers questions about content available in the Pokédex. General world knowledge is outside its intended scope. Personality changes presentation; the policy for missing information and extreme or deliberately unhelpful presets still needs a decision. The prototype may fail to provide information under a very low-information or "dummy"-like mood.

The integration must make that behavior explicit and testable. Do not silently assume a model provider, a browser-held API key, a retrieval service, or reliable answers from every preset. See D7 in the [decision register](decisions.md).

## Performance boundary

The interactive device already puts pressure on memory and runtime performance. No measured baseline or numeric budget is available in this repository. Start with the [performance investigation](performance.md), then choose targets based on supported devices.

Extra Pokémon-model interactions are deferred. They should not become a dependency for importing and stabilizing the existing device, entries, profiles, or tracker.

## Not decided by this scaffold

The frontend framework/renderer/state library, catalog source, trainer/tracker storage, hosting, AI provider, asset delivery, and license remain open. Account authentication uses Node.js, Express, Better Auth, and local SQLite (D10); that choice does not select the frontend stack or implement trainer/tracker cloud saves.

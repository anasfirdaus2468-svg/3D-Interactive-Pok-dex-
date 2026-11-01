# Interactive Pokédex

A Pokédex website built around a real-time, interactive 3D device, Pokémon entries, and collection progress. Trainer profiles, Rotomaton, and device customization make it personal.

**Repository status:** starter structure and planning only. An active prototype already exists, but its application source and assets have not been imported here. The folders below are placeholders, not working features. No framework, dependency versions, build commands, or deployment target have been selected for this repository.

## Established scope

- Two device variants: a dual-screen model with a D-pad and a Game Boy-like model with a rotary knob. Rotate, zoom, hover, power controls, lid controls where applicable, and rear battery interactions belong to the device layer.
- Two modes: **Pokédex Entries** and **Tracker Progress** for seen/caught status. Pokémon types and base stat totals also appear in the website overview; the 3D device is an interaction layer.
- 2D artwork and 3D Pokémon displays. Use the model from the first Switch title that Pokémon appeared in; Mareanie and Toxapex use Sword/Shield models under this project rule.
- Customizable trainer profiles with gym badges and Pokémon forms. Seiko Shinonome is a sample trainer, not a fixed protagonist; the profile theme is customizable.
- **Rotomaton** (Rotom + Automaton): a Pokédex-scoped AI assistant with cheerful, grouchy, peckish, and childish personalities.
- Device color sliders, sticker placement, and roaming pixel Pokémon companions. Repeated prototype stickers are placeholders; a stock catalog and user uploads still need work.
- The device already causes memory/performance pressure. Further interaction with the displayed Pokémon models is **deferred** until device performance is addressed.

See [project scope](docs/scope.md) for prototype status and boundaries.

## Repository layout

| Path | Purpose |
| --- | --- |
| `src/features/` | Device, entries/tracker, trainers, Rotomaton, customization, and companions |
| `src/data/` | Future Pokémon catalog, forms, statistics, and asset manifests |
| `src/shared/` | Shared state and utilities once the application is imported |
| `public/assets/` | Asset intake notes; no Pokémon artwork or models are included |
| `docs/` | Scope, open decisions, performance investigation, and issue index |
| `tests/` | Planned regression coverage; no test runner is configured |
| `.github/` | Feature, bug, and pull request templates |

## Start here

1. Work through the [initial issue list](docs/backlog.md), starting with the foundation, data/assets, and performance issues.
2. Resolve the relevant **OPEN** items in the [decision register](docs/decisions.md) before implementation. Record the outcome and rationale there.
3. Import the active prototype after confirming its stack and asset inventory. Document its real install, development, build, and test commands in this README.

There is no runnable application in this commit. Do not infer an npm command or a working backend from the folder names.

## Assets and licensing

Code licensing and third-party asset permissions are open decisions. No project license is selected in this starter. Record asset origins and redistribution terms before adding binaries; see [asset intake](public/assets/README.md).

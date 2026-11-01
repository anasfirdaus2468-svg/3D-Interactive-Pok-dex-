# Interactive Pokédex

A Pokédex website built around a real-time, interactive 3D device, Pokémon entries, and collection progress. Trainer profiles, Rotomaton, and device customization make it personal.

**Repository status:** a working email/password authentication API is available in [api/](api/README.md). The active Pokédex frontend prototype and its assets have not been imported; its feature folders remain placeholders. The API stack is selected, while frontend tooling and deployment remain open.

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
| `api/` | Node.js/Express/Better Auth login API, SQLite persistence, migrations, and HTTP tests |
| `src/features/` | Device, entries/tracker, trainers, Rotomaton, customization, and companions |
| `src/data/` | Future Pokémon catalog, forms, statistics, and asset manifests |
| `src/shared/` | Shared state and utilities once the application is imported |
| `public/assets/` | Asset intake notes; no Pokémon artwork or models are included |
| `docs/` | Scope, open decisions, performance investigation, and issue index |
| `tests/` | Planned Pokédex frontend regression coverage; API tests live in `api/test/` |
| `.github/` | Feature, bug, and pull request templates |

## Start here

Run the API with Node.js 24.15+ (24.x):

```sh
cd api
npm ci
npm run setup
npm run db:migrate
npm run dev
```

The default API origin is `http://localhost:3001`; `GET /api/health` checks it. Run `npm test` inside `api/`. See the [API guide](api/README.md) for endpoints, cookie-based frontend integration, configuration, and current limits. Email verification/recovery delivery and frontend login forms are still pending.

For the Pokédex frontend, start with the [issue list](docs/backlog.md), resolve the relevant [OPEN decisions](docs/decisions.md), and import the existing prototype after inspecting its actual stack. The API can be developed independently of that import.

## Assets and licensing

Code licensing and third-party asset permissions are open decisions. No project license is selected in this starter. Record asset origins and redistribution terms before adding binaries; see [asset intake](public/assets/README.md).

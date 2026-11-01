# Decision register

**OPEN** means no implementation choice has been made here; **PARTIAL** records a selected portion with remaining questions. Existing prototype behavior in [scope](scope.md) is established. Record decisions with their rationale, date, and relevant issue/PR. Proposed priorities live in the [backlog](backlog.md).

| ID | Status | Decision needed | Resolve before |
| --- | --- | --- | --- |
| D1 | PARTIAL | API runtime/tooling selected under D10. The active frontend prototype still needs inspection/import to confirm its framework, renderer, dependencies, build commands, and hosting needs. | Adding frontend dependencies, entry points, CI, or deployment configuration |
| D2 | OPEN | Select the catalog source and update process; define stable Pokémon/form identifiers, types/BST representation, display-model selection, and missing-data behavior. | Importing catalog data or implementing entry/tracker selection |
| D3 | OPEN | Inventory model/artwork/sprite/sticker origins, redistribution terms, attribution, formats, compression, and delivery. Decide ordinary Git vs large-file/external storage from actual sizes and permissions. | Committing or serving third-party assets |
| D4 | OPEN | Choose supported browsers/devices, test hardware, acceptable load time, interaction frame rate, memory/resource budgets, and behavior when 3D is unavailable. Measure the existing device first. | Declaring performance acceptable or adding Pokémon-model interaction |
| D5 | OPEN | Specify per-variant device states and inputs: power/battery/lid interactions, mode switching, rotation vs sticker placement, pointer/touch/keyboard mappings, and accessible alternatives. | Connecting controls to shared application state |
| D6 | PARTIAL | Account identity and sessions use the API's SQLite database (D10). Trainer/tracker/customization storage, ownership, per-form progress rules, sync, schema/versioning, badges, and export/import still need decisions. | Implementing trainer/tracker/customization saves or sync |
| D7 | OPEN | Confirm Rotomaton's AI provider/backend boundary, allowed Pokédex context, out-of-scope response, unavailable-answer policy, personality presets, and behavior under extreme/unhelpful moods. Define how errors and usage limits appear. | Implementing AI requests or claiming reliable responses across personalities |
| D8 | OPEN | Define sticker surface anchors/coordinates for both device variants, placement limits, color representation, and upload formats, size/dimension limits, validation, storage, and deletion. | Implementing saved placements or enabling uploads |
| D9 | OPEN | Choose a license for original code and document third-party attribution separately. Public visibility does not select a license. | Applying license terms or presenting third-party material as project-owned |
| D10 | DECIDED | Standalone email/password API: Node.js 24.15+ (24.x), ESM JavaScript, Express 5, Better Auth, built-in SQLite, npm lockfile, signed HTTP-only same-site cookies, explicit migrations, and Node HTTP integration tests. | Implemented in `api/`; connect the frontend when its source is available |
| D11 | OPEN | Choose an email sender and verification/recovery delivery flow. Existing accounts remain unverified; no mailbox-ownership claim or email recovery is provided. | Relying on verified email identity or enabling email recovery |

## D10 — Authentication API (2026-11-01)

The user requested a working login API independently of the unavailable frontend source ([#13](https://github.com/anasfirdaus2468-svg/3D-Interactive-Pok-dex-/issues/13)). Better Auth owns password hashing, validation, signed cookies, origin/CSRF checks, session lifecycle, and database-backed throttling. SQLite provides durable local account/session storage without an external service. Express supplies the HTTP boundary, body limits, trusted-proxy policy, and protected identity example. Runtime dependencies and migrations are pinned and tested.

Sessions last seven days by default with one-day renewal; cookie caching is disabled for immediate revocation. Production requires an explicit HTTPS API origin and uses Secure cookies. The API's local SQLite database and configuration are private runtime data, excluded from Git. See [API setup and integration](../api/README.md).

This selects the backend for account authentication, not the frontend framework, trainer/tracker storage, hosting, or an email provider. Those questions remain under D1/D6/D11. The current backend targets one Node process with persistent local storage.

## Recording an outcome

For each resolved row, add a short entry here containing:

- Decision ID and date.
- Selected approach and why it fits the existing prototype.
- Affected modules and data/asset migration, if any.
- Linked issue/PR and any follow-up question that remains open.

Do not mark an item resolved just because its suggested folder exists.

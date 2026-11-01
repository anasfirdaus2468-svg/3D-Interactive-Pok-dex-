# Decision register

**OPEN** means no implementation choice has been made here. Existing prototype behavior in [scope](scope.md) is established; the implementation and migration choices below are not. Close a decision by recording the selected option, rationale, date, and relevant issue/PR. Proposed priorities live in the [backlog](backlog.md).

| ID | Status | Decision needed | Resolve before |
| --- | --- | --- | --- |
| D1 | OPEN | Inspect/import the active prototype; confirm framework, language, 3D renderer, package manager, supported versions, build commands, and hosting needs. Preserve working behavior rather than selecting a replacement stack without evidence. | Adding dependencies, app entry points, CI, or deployment configuration |
| D2 | OPEN | Select the catalog source and update process; define stable Pokémon/form identifiers, types/BST representation, display-model selection, and missing-data behavior. | Importing catalog data or implementing entry/tracker selection |
| D3 | OPEN | Inventory model/artwork/sprite/sticker origins, redistribution terms, attribution, formats, compression, and delivery. Decide ordinary Git vs large-file/external storage from actual sizes and permissions. | Committing or serving third-party assets |
| D4 | OPEN | Choose supported browsers/devices, test hardware, acceptable load time, interaction frame rate, memory/resource budgets, and behavior when 3D is unavailable. Measure the existing device first. | Declaring performance acceptable or adding Pokémon-model interaction |
| D5 | OPEN | Specify per-variant device states and inputs: power/battery/lid interactions, mode switching, rotation vs sticker placement, pointer/touch/keyboard mappings, and accessible alternatives. | Connecting controls to shared application state |
| D6 | OPEN | Decide tracker/profile/customization persistence, local vs account sync, schema/versioning, seen/caught per-form rules, badge representation, export/import, and handling of personal profile content. | Implementing saves, accounts, or migration code |
| D7 | OPEN | Confirm Rotomaton's AI provider/backend boundary, allowed Pokédex context, out-of-scope response, unavailable-answer policy, personality presets, and behavior under extreme/unhelpful moods. Define how errors and usage limits appear. | Implementing AI requests or claiming reliable responses across personalities |
| D8 | OPEN | Define sticker surface anchors/coordinates for both device variants, placement limits, color representation, and upload formats, size/dimension limits, validation, storage, and deletion. | Implementing saved placements or enabling uploads |
| D9 | OPEN | Choose a license for original code and document third-party attribution separately. Public visibility does not select a license. | Applying license terms or presenting third-party material as project-owned |

## Recording an outcome

For each resolved row, add a short entry here containing:

- Decision ID and date.
- Selected approach and why it fits the existing prototype.
- Affected modules and data/asset migration, if any.
- Linked issue/PR and any follow-up question that remains open.

Do not mark an item resolved just because its suggested folder exists.

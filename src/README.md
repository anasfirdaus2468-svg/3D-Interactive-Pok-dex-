# Application source

The active Pokédex frontend prototype has not been imported. These feature folders are placeholders; resolve its D1 choices in [decisions](../docs/decisions.md) before adding frontend entry points or dependencies. The runnable account API is separate in [api/](../api/README.md).

| Folder | Intended responsibility |
| --- | --- |
| `features/device/` | Both 3D device variants, controls, power/lid/battery state, camera interactions |
| `features/pokedex/` | Entries and Tracker Progress views, selected Pokémon/form, overview data |
| `features/trainer/` | Reusable profiles, gym badges, form displays, optional demo trainer |
| `features/rotomaton/` | Pokédex-scoped assistant UI, grounding boundary, personality behavior |
| `features/customization/` | Device colors, stock/uploaded stickers, placement and removal |
| `features/companions/` | Roaming pixel Pokémon sprites and animation lifecycle |
| `data/` | Catalog/form identifiers, normalized types/BST, asset provenance and manifests |
| `shared/` | Only state/utilities demonstrably shared by imported features |

Keep the website overview and device connected to the same selection/progress state. Decide the state mechanism after inspecting the prototype. Keep the catalog separate from renderer resources so displaying information does not require mounting a 3D scene.

If an AI integration needs credentials, keep them behind the chosen backend boundary; never put secrets into browser code or committed configuration. The backend location and provider remain OPEN (D7).

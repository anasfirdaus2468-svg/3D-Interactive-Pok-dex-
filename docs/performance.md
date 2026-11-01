# Device performance investigation

**Known:** the active 3D device is already heavy on memory/performance. Further interaction with the displayed Pokémon model has been postponed.

**Unknown:** measured load cost, the resource bottleneck, supported hardware, and acceptable budgets. No benchmark has been run by this starter. D4 in the [decision register](decisions.md) must establish targets; numbers below remain unfilled until measured.

## Baseline record

Record the prototype revision, browser/version, OS, hardware, viewport, device variant, Pokémon/model, sprite count, and sticker count with every sample. Use a consistent scenario and several runs.

| Measurement | Baseline | Accepted target |
| --- | --- | --- |
| Time until overview usable / device interactive | Not measured | OPEN (D4) |
| Initial and on-demand asset transfer sizes | Not measured | OPEN (D4) |
| Frame time / FPS during rotation and zoom | Not measured | OPEN (D4) |
| Memory before load, after use, and after repeated switches | Not measured | OPEN (D4) |
| Renderer resource counts, draw calls, and texture sizes where available | Not measured | OPEN (D4) |
| Input delay with stickers and companions active | Not measured | OPEN (D4) |

Do not equate JavaScript heap size with GPU memory. Where direct GPU-memory measurement is unavailable, report the limitation and track renderer resources and texture dimensions as supporting evidence.

## Repeatable scenarios

1. Cold-load the overview and default device; note when data and controls become usable.
2. Rotate/zoom the device and operate its buttons, lid where supported, rear cover, and battery. Compare idle and active rendering.
3. Repeatedly switch device variants, Pokémon/forms, and Entries/Tracker modes. Check whether memory and resource counts stabilize after cleanup.
4. Add/remove stickers and change color. Compare with a fixed number of roaming sprites, then with companions disabled.
5. Navigate between profiles and the overview, then return. Check for retained scenes, listeners, animation loops, and textures.
6. Exercise the agreed low-capability/3D-unavailable path and verify the overview and collection data remain accessible.

## Candidate mitigations — evaluate after profiling

- Load device and Pokémon assets only when needed; define cache limits rather than retaining every model.
- Dispose of renderer resources, listeners, and animation work when their owner is removed.
- Compare compressed meshes/textures, reduced texture sizes, and appropriate model detail.
- Bound pixel ratio, sticker/sprite counts, and offscreen/hidden animation work.
- Provide a lighter presentation if the target environment cannot run the 3D view acceptably.

These are investigation options, not adopted architecture. Record the observed effect of each change against the same scenario.

## Gate for extra Pokémon-model interactions

Keep this work deferred until D4 has accepted targets, the existing device meets them on the agreed environments, repeated-use measurements show bounded resource use, and the lighter/error path has been verified. Re-measure the added interaction before enabling it broadly.

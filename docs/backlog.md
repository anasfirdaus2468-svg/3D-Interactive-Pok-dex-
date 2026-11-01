# Initial issue list

These GitHub issues contain acceptance criteria and dependencies. Priorities describe a proposed order, not committed dates: **P0** foundations, **P1** core stabilization, **P2** additions/polish, **Deferred** gated work.

| Priority | GitHub issue | Decision dependencies |
| --- | --- | --- |
| P0 | [#1: Inspect and import the active prototype; confirm the toolchain](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/1) | D1, D9 |
| P0 | [#2: Define Pokémon/form data and asset provenance manifests](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/2) | D2, D3 |
| P0 | [#3: Measure 3D device performance and agree budgets and fallback behavior](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/3) | D1, D4 |
| P1 | [#4: Preserve both device variants and define control/state transitions](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/4) | D1, D5 |
| P1 | [#5: Connect Pokédex Entries and Tracker Progress with persistent state](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/5) | D2, D5, D6 |
| P1 | [#6: Generalize trainer profiles, gym badges, and Pokémon forms](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/6) | D2, D6 |
| P1 | [#7: Define Rotomaton grounding, personalities, and unavailable-answer behavior](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/7) | D2, D7 |
| P1 | [#8: Preserve device colors and build a stock-sticker catalog](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/8) | D3, D6, D8 |
| P2 | [#9: Add validated user-uploaded stickers with storage and deletion](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/9) | D3, D6, D8 |
| P2 | [#10: Stabilize roaming pixel Pokémon companions within the rendering budget](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/10) | D3, D4, D5 |
| P1 | [#11: Establish regression, accessibility, persistence, and lifecycle checks](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/11) | D1, D4, D5, D6, D7 |
| Deferred | [#12: Add Pokémon-model interactions after the device performance gate](https://github.com/anasfirdaus2468-svg/ChatGPT/issues/12) | D4 |

Start with the three P0 investigations. Their findings should guide the prototype import and implementation work. Preserve features already working in the prototype; issue creation does not imply they need to be rebuilt from scratch.

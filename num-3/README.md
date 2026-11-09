# АЗС «Трембіта» v3 — Gas Station Simulator

Browser-based Ukrainian gas station management sim. Fully client-side: no backend, no database — the whole game lives in a zustand store driven by a tick engine.

Lab num-3 builds on the num-2 core with **interfaces**, **file-based logging** (input: JSON scenario import, output: NDJSON journal export), **testing** (`bun test`), and a **road network graph** — tankers now drive the route found by Dijkstra's algorithm.

## Run

```bash
bun install
bun dev
```

Build: `bun run build` · Lint: `bun run lint` · Typecheck: `bunx tsc --noEmit` · Tests: `bun test`

## Gameplay

Everything from num-1/num-2 stays: 4 pumps, 3 fuels, queues, wallets, ТСН news events, markup control, bankruptcy at −50 000 ₴.

New in v3:

- **Routing graph** — a tanker no longer pops onto the lane with a random ETA: ordering builds a weighted graph (depot → junctions → station, edge weight = travel ticks), `DijkstraRouteFinder` picks the cheapest route, and the «Дорожня мережа» panel draws it together with the tanker position. Arrival time is now deterministic in route length.
- **Files** — «Імпортувати сценарій» reads a JSON scenario (`version`, `balance`, `markup`, `reservoirs`; strict validation with Ukrainian error messages, loads paused), «Завантажити журнал» downloads the session journal as NDJSON. Example: `public/scenarios/default.json`.
- **Journal** — bounded (500 records, truncation disclosed with an explicit `journal-truncated` record): session starts, tick summaries, tanker departures/arrivals with route length, markup changes, game over.

## Interfaces

| Contract | File | Implementation |
|---|---|---|
| `ISimSystem` | `src/lib/sim/contracts/sim-system.ts` | `TickSystem` and all 7 subsystems; the engine holds `readonly ISimSystem[]` |
| `IRouteFinder` | `src/lib/sim/routing/route-finder.ts` | `DijkstraRouteFinder`, injected into `TankerSystem` |
| `ILogFileTransport` | `src/lib/files/log-file-transport.ts` | `BrowserLogFileTransport` (file picker reads, blob downloads) |
| `SimContext` | `src/lib/sim/sim-context.ts` | notification callback; `silentContext` for headless runs |

## Architecture notes

- Systems are stateless, one class per file; entities stay plain interfaces in `types.ts` (no class instances inside the store).
- A tanker journey is a single `route` + `departedTick` record in the state; ETA, progress and map position are derived values (`routing/route-selectors.ts`) — no competing counters.
- The journal holds plain records in the store state (immer-safe), appended at store action boundaries; notifications publish after the mutation completes.
- Road topology is immutable data in `constants.ts`, independent of the SVG coordinates of the map.

## Tests

`bun test` — 26 tests:

- Dijkstra: cheapest total beats the greedy first edge, disconnected target → `null`, equal cost → deterministic result, undirected links
- Tanker system: balance charge, no-route/no-charge guard, arrival exactly at `route.totalTicks`, single arrival notice, reservoir overflow cap
- Scenario codec: valid input, broken JSON, wrong version, non-finite numbers, out-of-range values, round-trip
- Journal: cap + truncation disclosure, tick summary scalars, NDJSON round-trip
- Regression: 3 seeds × 500 ticks against a committed golden fixture (`tests/fixtures/sim-baseline.json`; `UPDATE_BASELINE=1 bun test` rewrites it)

## Differences from num-2

Intentional: the random tanker ETA is replaced by graph routing (changed RNG stream → regenerated baseline), and the store gained the journal plus scenario import. num-2 stays frozen as a separate lab with its own parity guarantee to num-1.

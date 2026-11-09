# АЗС «Трембіта» v2 — Gas Station Simulator

Browser-based Ukrainian gas station management sim. Fully client-side: no backend, no database — the whole game lives in a zustand store driven by a tick engine.

Лабораторна №2: поведінка гри ідентична num-1, архітектура ядра переписана в ООП-стилі — модифікатори доступу, наслідування, поліморфізм, кожен клас в окремому файлі.

## Run

```bash
bun install
bun dev
```

Build: `bun run build` · Lint: `bun run lint` · Typecheck: `bunx tsc --noEmit`

## Gameplay

Unchanged from num-1:

- 4 fuel pumps serve 3 fuels (А-92, А-95, ДП), each with its own 2000 L reservoir
- Cars spawn per tick, queue, refuel, pay, leave — every car is a persistent entity with wallet, tank, stats and visit history (click any car to inspect)
- Order benzovozes (1000 L) to refill reservoirs; they arrive after 30–45 ticks
- Satirical ТСН news events drive the market: price multipliers on wholesale, demand spikes, pump breakdowns, VIP guests with fat wallets, and rare crisis events («Трамп вторгся в Іран»)
- Player controls the global markup (−20%…+80%)
- Bankruptcy at −50 000 ₴ → «Вас мобілізували»

## OOP architecture

Entities stay plain interfaces inside the store; classes are stateless systems that operate on the immer draft. One class per file, `src/lib/sim/systems/`:

| Class | Role |
|---|---|
| `TickSystem` | abstract base: public `run`, protected abstract `execute` |
| `NewsSystem` | event lifecycle, weighted pool pick, pump outages |
| `TankerSystem` | benzovoz orders and arrivals (public `order` + tick) |
| `SpawnSystem` | demand-driven car acquisition, roster reuse |
| `PumpAssignmentSystem` | queue-to-pump allocation, rejection paths |
| `RefuelSystem` | metered delivery, incremental payment |
| `QueueSystem` | patience decay, abandonment |
| `BankruptcySystem` | game-over threshold |
| `SimulationEngine` | composes the systems, polymorphic tick loop |

- **Access modifiers:** `public` on the system contract, `protected` on the `execute` hook, `private` on domain helpers (`acquireCar`, `finishRefuel`, `pickEvent`, …)
- **Inheritance:** seven concrete systems extend `TickSystem`
- **Polymorphism:** `SimulationEngine` runs a `readonly TickSystem[]` — dynamic dispatch, no concrete-type checks
- **Encapsulation:** zustand remains the single source of truth; market prices are derived selectors computed on read; systems never hold state

Notifications (sonner toasts) are emitted through a `SimContext` callback and published outside the immer recipe by the store actions.

News copy is pure data split by category (`news-categories/`), reassembled in `news-pool.ts`.

## Parity guarantee

The refactor was verified against num-1 with a seeded headless harness: 5 scenarios × 3 seeds × 3000 ticks, per-tick state snapshots and an RNG call counter — byte-identical runs, including the bankruptcy game-over path.

Tuning knobs: `src/lib/sim/constants.ts`.

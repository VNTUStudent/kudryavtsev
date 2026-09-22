# АЗС «Трембіта» — Gas Station Simulator

Browser-based Ukrainian gas station management sim. Fully client-side: no backend, no database — the whole game lives in a zustand store driven by a tick engine.

## Run

```bash
bun install
bun dev
```

Build: `bun run build` · Lint: `bun run lint` · Typecheck: `bunx tsc --noEmit`

## Gameplay

- 4 fuel pumps serve 3 fuels (А-92, А-95, ДП), each with its own 2000 L reservoir
- Cars spawn per tick, queue, refuel, pay, leave — every car is a persistent entity with wallet, tank, stats and visit history (click any car to inspect)
- Order benzovozes (1000 L) to refill reservoirs; they arrive after 30–45 ticks
- Satirical ТСН news events drive the market: price multipliers on wholesale, demand spikes, pump breakdowns, VIP guests with fat wallets, and rare crisis events («Трамп вторгся в Іран»)
- Player controls the global markup (−20%…+80%): overtaking customers scares them off, undercutting boosts traffic
- Bankruptcy at −50 000 ₴ → «Вас мобілізували»

## Architecture

Single source of truth: `src/lib/sim/store.ts` (zustand + immer). `SimDriver` component advances the engine on an interval scaled by speed. Everything else is derived:

- `engine.ts` — tick pipeline: news → tankers → spawn → pump assignment → pumping → queue → bankruptcy check
- `market.ts` — pure derived selectors: effective wholesale/retail prices and demand multipliers computed from active events (never cached)
- `spawn.ts` — car acquisition: persistent roster (~50 cars) with returning customers
- `refuel.ts` — metered pumping (6 L/tick, incremental payment)
- `news.ts` / `news-pool.ts` — event firing, expiry, and the 33-event pool (each with a satirical lead paragraph)
- `tanker.ts` — benzovoz orders and arrivals

UI is scene-first: a drawn side-view SVG station (`src/components/scene/`) with a day/night cycle, animated cars, pumps with live hoses and a price totem, topped by a ТСН breaking-news banner and marquee ticker (`src/components/news/`); management panels (fuel gauges, markup, benzovozes, client registry) sit below. shadcn/ui (Base UI primitives) elsewhere. Ukrainian only, ₴ currency.

Tuning knobs: `src/lib/sim/constants.ts`.

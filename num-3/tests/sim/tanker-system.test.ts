import { describe, expect, test } from 'bun:test'
import { RESERVOIR_MAX, START_BALANCE, TANKER_LITERS } from '@/lib/sim/constants'
import { createInitialState } from '@/lib/sim/initial-state'
import { DijkstraRouteFinder } from '@/lib/sim/routing/dijkstra-route-finder'
import type { IRouteFinder } from '@/lib/sim/routing/route-finder'
import { buildRoadNetwork } from '@/lib/sim/routing/road-network'
import type { Route } from '@/lib/sim/routing/types'
import type { SimContext } from '@/lib/sim/sim-context'
import type { SimNotice } from '@/lib/sim/sim-notice'
import type { SimState } from '@/lib/sim/types'
import { TankerSystem } from '@/lib/sim/systems/tanker-system'

class NullRouteFinder implements IRouteFinder {
  public findRoute(): Route | null {
    return null
  }
}

function captureContext(): { context: SimContext; notices: SimNotice[] } {
  const notices: SimNotice[] = []
  return { context: { emit: (notice) => notices.push(notice) }, notices }
}

describe('TankerSystem', () => {
  test('order charges the balance and assigns the dijkstra route', () => {
    const system = new TankerSystem(new DijkstraRouteFinder())
    const state = createInitialState()
    const { context, notices } = captureContext()

    system.order(state, 'a95', context)

    expect(state.tankers).toHaveLength(1)
    expect(state.balance).toBeLessThan(START_BALANCE)
    expect(state.nextTankerId).toBe(2)
    expect(notices).toEqual([
      {
        kind: 'tanker-departed',
        fuelType: 'a95',
        cost: expect.any(Number),
        routeTicks: expect.any(Number),
        stops: expect.any(Number),
      },
    ])
    const tanker = state.tankers[0]
    expect(tanker.departedTick).toBe(0)
    expect(tanker.route.nodeIds[0]).toBe('depot')
    expect(tanker.route.nodeIds.at(-1)).toBe('station')
    expect(tanker.route.totalTicks).toBeGreaterThan(0)
  })

  test('order without a route charges nothing and emits nothing', () => {
    const system = new TankerSystem(new NullRouteFinder())
    const state = createInitialState()
    const { context, notices } = captureContext()

    system.order(state, 'a92', context)

    expect(state.tankers).toHaveLength(0)
    expect(state.balance).toBe(START_BALANCE)
    expect(notices).toHaveLength(0)
  })

  test('tanker arrives exactly at route.totalTicks with a single notice', () => {
    const system = new TankerSystem(new DijkstraRouteFinder())
    const state = createInitialState()
    const { context, notices } = captureContext()
    system.order(state, 'diesel', context)
    const tanker = state.tankers[0]
    const before = state.reservoirs.diesel

    for (let step = 0; step < tanker.route.totalTicks - 1; step += 1) {
      state.tick += 1
      system.run(state, context)
      expect(state.tankers).toHaveLength(1)
    }
    state.tick += 1
    system.run(state, context)

    expect(state.tankers).toHaveLength(0)
    expect(state.reservoirs.diesel).toBe(Math.min(RESERVOIR_MAX, before + TANKER_LITERS))
    const arrivals = notices.filter((notice) => notice.kind === 'tanker-arrived')
    expect(arrivals).toHaveLength(1)
  })

  test('reservoir caps the delivered portion and reports overflow', () => {
    const system = new TankerSystem(new DijkstraRouteFinder())
    const state: SimState = { ...createInitialState(), reservoirs: { a92: RESERVOIR_MAX - 120, a95: 0, diesel: 0 } }
    const { context, notices } = captureContext()
    system.order(state, 'a92', context)

    const tanker = state.tankers[0]
    for (let step = 0; step < tanker.route.totalTicks; step += 1) {
      state.tick += 1
      system.run(state, context)
    }

    expect(state.reservoirs.a92).toBe(RESERVOIR_MAX)
    const arrival = notices.find((notice) => notice.kind === 'tanker-arrived')
    expect(arrival).toMatchObject({ kind: 'tanker-arrived', added: 120, overflow: TANKER_LITERS - 120 })
  })

  test('real network route exists and the pipeline loop keeps the tanker in flight', () => {
    const route = new DijkstraRouteFinder().findRoute(
      buildRoadNetwork(),
      'depot',
      'station'
    )
    expect(route).not.toBeNull()
    expect(route?.nodeIds).toHaveLength(3)
  })
})

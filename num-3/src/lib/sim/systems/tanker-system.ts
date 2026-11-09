import type { Draft } from 'immer'
import { DEPOT_NODE_ID, RESERVOIR_MAX, STATION_NODE_ID, TANKER_FEE, TANKER_LITERS } from '../constants'
import { wholesalePrice } from '../market'
import type { SimContext } from '../sim-context'
import type { FuelType, SimState } from '../types'
import { buildRoadNetwork } from '../routing/road-network'
import type { IRouteFinder } from '../routing/route-finder'
import { TickSystem } from './tick-system'

export class TankerSystem extends TickSystem {
  private readonly routeFinder: IRouteFinder
  private readonly network = buildRoadNetwork()

  public constructor(routeFinder: IRouteFinder) {
    super()
    this.routeFinder = routeFinder
  }

  public order(state: Draft<SimState>, fuelType: FuelType, context: SimContext): void {
    const route = this.routeFinder.findRoute(this.network, DEPOT_NODE_ID, STATION_NODE_ID)
    if (route === null) return
    const cost = Math.round(wholesalePrice(state, fuelType) * TANKER_LITERS + TANKER_FEE)
    state.tankers.push({
      id: `tanker-${state.nextTankerId}`,
      fuelType,
      liters: TANKER_LITERS,
      route,
      departedTick: state.tick,
      cost,
    })
    state.nextTankerId += 1
    state.balance -= cost
    context.emit({ kind: 'tanker-departed', fuelType, cost })
  }

  protected execute(state: Draft<SimState>, context: SimContext): void {
    for (const tanker of [...state.tankers]) {
      if (state.tick - tanker.departedTick < tanker.route.totalTicks) continue
      const current = state.reservoirs[tanker.fuelType]
      const added = Math.min(RESERVOIR_MAX - current, tanker.liters)
      state.reservoirs[tanker.fuelType] = current + added
      state.tankers.splice(state.tankers.indexOf(tanker), 1)
      const overflow = tanker.liters - added
      context.emit({ kind: 'tanker-arrived', fuelType: tanker.fuelType, added, overflow })
    }
  }
}

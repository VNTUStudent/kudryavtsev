import type { Draft } from 'immer'
import { RESERVOIR_MAX, TANKER_ETA_MAX, TANKER_ETA_MIN, TANKER_FEE, TANKER_LITERS } from '../constants'
import { wholesalePrice } from '../market'
import { randInt } from '../rng'
import type { SimContext } from '../sim-context'
import type { FuelType, SimState } from '../types'
import { TickSystem } from './TickSystem'

export class TankerSystem extends TickSystem {
  public order(state: Draft<SimState>, fuelType: FuelType, context: SimContext): void {
    const cost = Math.round(wholesalePrice(state, fuelType) * TANKER_LITERS + TANKER_FEE)
    state.tankers.push({
      id: `tanker-${state.nextTankerId}`,
      fuelType,
      liters: TANKER_LITERS,
      etaTicks: randInt(TANKER_ETA_MIN, TANKER_ETA_MAX),
      cost,
    })
    state.nextTankerId += 1
    state.balance -= cost
    context.emit({ kind: 'tanker-departed', fuelType, cost })
  }

  protected execute(state: Draft<SimState>, context: SimContext): void {
    for (const tanker of [...state.tankers]) {
      tanker.etaTicks -= 1
      if (tanker.etaTicks > 0) continue
      const current = state.reservoirs[tanker.fuelType]
      const added = Math.min(RESERVOIR_MAX - current, tanker.liters)
      state.reservoirs[tanker.fuelType] = current + added
      state.tankers.splice(state.tankers.indexOf(tanker), 1)
      const overflow = tanker.liters - added
      context.emit({ kind: 'tanker-arrived', fuelType: tanker.fuelType, added, overflow })
    }
  }
}

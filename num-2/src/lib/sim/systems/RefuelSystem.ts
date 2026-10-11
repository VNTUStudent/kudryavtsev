import type { Draft } from 'immer'
import { FLOW_PER_TICK, FUEL_LABELS, REFUEL_EPSILON } from '../constants'
import { fmtLiters, fmtMoney } from '../format'
import { pushHistory } from '../history'
import { retailPrice } from '../market'
import type { Car, Pump, SimState } from '../types'
import { TickSystem } from './TickSystem'

export class RefuelSystem extends TickSystem {
  protected execute(state: Draft<SimState>): void {
    for (const pump of state.pumps) {
      if (pump.outTicks > 0) {
        pump.outTicks -= 1
        continue
      }
      if (pump.carId === null) continue
      const car = state.cars[pump.carId]
      if (car === undefined) {
        this.resetPump(pump)
        continue
      }
      const remaining = pump.requested - pump.delivered
      const flow = Math.min(FLOW_PER_TICK, remaining)
      const portion = Math.min(flow, state.reservoirs[car.fuelType])
      if (portion > 0) {
        const cost = portion * retailPrice(state, car.fuelType)
        pump.delivered += portion
        pump.spent += cost
        state.reservoirs[car.fuelType] -= portion
        state.balance += cost
        state.stats.revenue += cost
        car.wallet -= cost
        car.fuelLevel += portion
      }
      const reservoirEmpty = portion < flow
      if (pump.delivered >= pump.requested - REFUEL_EPSILON || reservoirEmpty) {
        this.finishRefuel(state, pump, car, reservoirEmpty)
      }
    }
  }

  private finishRefuel(state: Draft<SimState>, pump: Pump, car: Car, cutShort: boolean): void {
    car.stats.litersBought += pump.delivered
    car.stats.totalSpent += pump.spent
    const note = cutShort ? ' - пальне скінчилось' : ''
    pushHistory(
      car,
      state.tick,
      'refueled',
      `Залив ${fmtLiters(pump.delivered)} ${FUEL_LABELS[car.fuelType]} за ${fmtMoney(pump.spent)}${note}`
    )
    state.stats.served += 1
    this.resetPump(pump)
  }

  private resetPump(pump: Pump): void {
    pump.carId = null
    pump.requested = 0
    pump.delivered = 0
    pump.spent = 0
  }
}

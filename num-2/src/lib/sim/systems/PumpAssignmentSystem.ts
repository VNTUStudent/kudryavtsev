import type { Draft } from 'immer'
import { FUEL_LABELS, MIN_PURCHASE_LITERS } from '../constants'
import { pushHistory } from '../history'
import { retailPrice } from '../market'
import type { Car, SimState } from '../types'
import { TickSystem } from './TickSystem'

export class PumpAssignmentSystem extends TickSystem {
  protected execute(state: Draft<SimState>): void {
    for (const pump of state.pumps) {
      if (pump.carId !== null || pump.outTicks > 0) continue
      const carId = state.queue.shift()
      if (carId === undefined) return
      const car = state.cars[carId]
      if (car === undefined) continue
      if (car.tankSize - car.fuelLevel < MIN_PURCHASE_LITERS) {
        this.leave(state, car, 'Поїхав - бак і так повен', false)
        continue
      }
      if (state.reservoirs[car.fuelType] < MIN_PURCHASE_LITERS) {
        this.leave(state, car, `Поїхав - ${FUEL_LABELS[car.fuelType]} немає`, true)
        continue
      }
      const affordable = car.wallet / retailPrice(state, car.fuelType)
      if (affordable < MIN_PURCHASE_LITERS) {
        this.leave(state, car, 'Поїхав - грошей не вистачило', true)
        continue
      }
      pump.carId = car.id
      pump.requested = Math.min(
        car.tankSize - car.fuelLevel,
        affordable,
        state.reservoirs[car.fuelType]
      )
      pump.delivered = 0
      pump.spent = 0
    }
  }

  private leave(state: Draft<SimState>, car: Car, reason: string, countLost: boolean): void {
    pushHistory(car, state.tick, 'left', reason)
    if (countLost) state.stats.lost += 1
  }
}

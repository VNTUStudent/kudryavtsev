import type { Draft } from 'immer'
import { pushHistory } from '../history'
import type { SimState } from '../types'
import { TickSystem } from './TickSystem'

export class QueueSystem extends TickSystem {
  protected execute(state: Draft<SimState>): void {
    for (const carId of [...state.queue]) {
      const car = state.cars[carId]
      if (car === undefined) {
        this.removeFromQueue(state, carId)
        continue
      }
      car.patience -= 1
      if (car.patience <= 0) {
        this.removeFromQueue(state, carId)
        pushHistory(car, state.tick, 'left', 'Не дочекався - «тут же пів години стояти»')
        state.stats.lost += 1
      }
    }
  }

  private removeFromQueue(state: Draft<SimState>, carId: string): void {
    const index = state.queue.indexOf(carId)
    if (index >= 0) state.queue.splice(index, 1)
  }
}

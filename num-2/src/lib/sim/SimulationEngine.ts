import type { Draft } from 'immer'
import type { SimContext } from './sim-context'
import type { FuelType, SimState } from './types'
import { BankruptcySystem } from './systems/BankruptcySystem'
import { NewsSystem } from './systems/NewsSystem'
import { PumpAssignmentSystem } from './systems/PumpAssignmentSystem'
import { QueueSystem } from './systems/QueueSystem'
import { RefuelSystem } from './systems/RefuelSystem'
import { SpawnSystem } from './systems/SpawnSystem'
import { TankerSystem } from './systems/TankerSystem'
import type { TickSystem } from './systems/TickSystem'

export class SimulationEngine {
  private readonly tanker = new TankerSystem()

  private readonly systems: readonly TickSystem[] = [
    new NewsSystem(),
    this.tanker,
    new SpawnSystem(),
    new PumpAssignmentSystem(),
    new RefuelSystem(),
    new QueueSystem(),
    new BankruptcySystem(),
  ]

  public advance(state: Draft<SimState>, context: SimContext): void {
    if (state.gameOver) return
    state.tick += 1
    for (const system of this.systems) {
      system.run(state, context)
    }
  }

  public orderTanker(state: Draft<SimState>, fuelType: FuelType, context: SimContext): void {
    this.tanker.order(state, fuelType, context)
  }
}

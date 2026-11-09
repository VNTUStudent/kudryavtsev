import type { Draft } from 'immer'
import type { ISimSystem } from './contracts/sim-system'
import type { SimContext } from './sim-context'
import type { FuelType, SimState } from './types'
import { BankruptcySystem } from './systems/bankruptcy-system'
import { NewsSystem } from './systems/news-system'
import { PumpAssignmentSystem } from './systems/pump-assignment-system'
import { QueueSystem } from './systems/queue-system'
import { RefuelSystem } from './systems/refuel-system'
import { SpawnSystem } from './systems/spawn-system'
import { TankerSystem } from './systems/tanker-system'
import { DijkstraRouteFinder } from './routing/dijkstra-route-finder'

export class SimulationEngine {
  private readonly tanker = new TankerSystem(new DijkstraRouteFinder())

  private readonly systems: readonly ISimSystem[] = [
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

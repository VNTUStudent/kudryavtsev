import { silentContext } from './sim-context'
import type { SimState } from './types'
import { PumpAssignmentSystem } from './systems/pump-assignment-system'
import { QueueSystem } from './systems/queue-system'
import { RefuelSystem } from './systems/refuel-system'

const pumpAssignmentSystem = new PumpAssignmentSystem()
const queueSystem = new QueueSystem()
const refuelSystem = new RefuelSystem()

export function assignPumps(state: SimState): void {
  pumpAssignmentSystem.run(state, silentContext)
}

export function tickPumps(state: SimState): void {
  refuelSystem.run(state, silentContext)
}

export function tickQueue(state: SimState): void {
  queueSystem.run(state, silentContext)
}

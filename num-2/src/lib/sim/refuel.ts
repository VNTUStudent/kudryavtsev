import { silentContext } from './sim-context'
import type { SimState } from './types'
import { PumpAssignmentSystem } from './systems/PumpAssignmentSystem'
import { QueueSystem } from './systems/QueueSystem'
import { RefuelSystem } from './systems/RefuelSystem'

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

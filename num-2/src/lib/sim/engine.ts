import { SimulationEngine } from './simulation-engine'
import type { SimContext } from './sim-context'
import type { FuelType, SimState } from './types'

const simulationEngine = new SimulationEngine()

export function advanceTick(state: SimState, context: SimContext): void {
  simulationEngine.advance(state, context)
}

export function orderTanker(state: SimState, fuelType: FuelType, context: SimContext): void {
  simulationEngine.orderTanker(state, fuelType, context)
}

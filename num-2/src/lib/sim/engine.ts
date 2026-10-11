import { publishNotice } from './notifications'
import { SimulationEngine } from './SimulationEngine'
import type { FuelType, SimState } from './types'

const simulationEngine = new SimulationEngine()

export function advanceTick(state: SimState): void {
  simulationEngine.advance(state, { emit: publishNotice })
}

export function orderTanker(state: SimState, fuelType: FuelType): void {
  simulationEngine.orderTanker(state, fuelType, { emit: publishNotice })
}

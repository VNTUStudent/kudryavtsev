import { publishNotice } from './notifications'
import type { FuelType, SimState } from './types'
import { TankerSystem } from './systems/TankerSystem'

const tankerSystem = new TankerSystem()

export function orderTanker(state: SimState, fuelType: FuelType): void {
  tankerSystem.order(state, fuelType, { emit: publishNotice })
}

export function tickTankers(state: SimState): void {
  tankerSystem.run(state, { emit: publishNotice })
}

import type { FuelType } from './types'

export type SimNotice =
  | { kind: 'tanker-departed'; fuelType: FuelType; cost: number }
  | { kind: 'tanker-arrived'; fuelType: FuelType; added: number; overflow: number }
  | { kind: 'mobilized' }

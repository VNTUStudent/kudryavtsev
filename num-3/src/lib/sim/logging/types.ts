import type { FuelType } from '../types'

export type JournalOrigin = 'default' | 'imported'

export type JournalRecord =
  | { kind: 'session-start'; tick: number; origin: JournalOrigin; balance: number; markup: number }
  | {
      kind: 'tick'
      tick: number
      balance: number
      queueLength: number
      served: number
      lost: number
    }
  | {
      kind: 'tanker-departed'
      tick: number
      fuelType: FuelType
      cost: number
      routeTicks: number
      stops: number
    }
  | { kind: 'tanker-arrived'; tick: number; fuelType: FuelType; added: number; overflow: number }
  | { kind: 'markup-changed'; tick: number; markup: number }
  | { kind: 'game-over'; tick: number }
  | { kind: 'journal-truncated'; tick: number; dropped: number }

import type { FuelType } from './types'

export const FUEL_TYPES: FuelType[] = ['a92', 'a95', 'diesel']

export const FUEL_LABELS: Record<FuelType, string> = {
  a92: 'А-92',
  a95: 'А-95',
  diesel: 'ДП',
}

export const FUEL_HEX: Record<FuelType, string> = {
  a92: '#f59e0b',
  a95: '#10b981',
  diesel: '#0ea5e9',
}

export const FUEL_BASE_PRICE: Record<FuelType, number> = {
  a92: 48,
  a95: 51,
  diesel: 53,
}

export const FUEL_DEMAND_WEIGHT: Record<FuelType, number> = {
  a92: 0.4,
  a95: 0.35,
  diesel: 0.25,
}

export const RESERVOIR_MAX = 2000
export const RESERVOIR_START = 1000
export const OP_COST_PER_LITER = 1.5
export const PUMP_COUNT = 4
export const FLOW_PER_TICK = 6
export const TICK_MS = 700
export const MINUTES_PER_TICK = 5
export const MINUTES_PER_DAY = 1440
export const WALLET_MIN = 2000
export const WALLET_MAX = 6000
export const INCOME_MIN = 800
export const INCOME_MAX = 2500
export const WALLET_CAP = 30000
export const PATIENCE_MIN = 8
export const PATIENCE_MAX = 20
export const QUEUE_LIMIT = 8
export const SPAWN_RATE = 0.35
export const MIN_PURCHASE_LITERS = 5
export const TANKER_LITERS = 1000
export const TANKER_FEE = 2000
export const TANKER_ETA_MIN = 30
export const TANKER_ETA_MAX = 45
export const START_BALANCE = 150000
export const BANKRUPTCY_LIMIT = -50000
export const MARKUP_MIN = -0.2
export const MARKUP_MAX = 0.8
export const MARKUP_DEFAULT = 0.05
export const NEWS_CHANCE_PER_TICK = 0.022
export const HISTORY_CAP = 30
export const NEWS_FEED_CAP = 50
export const ROSTER_TARGET = 50
export const START_HOUR = 8

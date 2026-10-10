export type FuelType = 'a92' | 'a95' | 'diesel'

export type NewsCategory =
  | 'market-up'
  | 'market-down'
  | 'demand'
  | 'operational'
  | 'vip'
  | 'crisis'

export interface NewsEventEffects {
  priceMul?: Partial<Record<FuelType, number>>
  demandMul?: Partial<Record<FuelType, number>>
  pumpOutTicks?: number
  vipWalletMul?: number
}

export interface NewsEvent {
  id: string
  category: NewsCategory
  source: string
  headline: string
  body?: string
  effects: NewsEventEffects
  durationTicks: number
  weight: number
}

export interface ActiveEvent {
  event: NewsEvent
  ticksLeft: number
}

export interface NewsItem {
  id: string
  event: NewsEvent
  tick: number
}

export type HistoryKind = 'arrived' | 'refueled' | 'left'

export interface HistoryEntry {
  tick: number
  kind: HistoryKind
  text: string
}

export interface CarStats {
  visits: number
  litersBought: number
  totalSpent: number
}

export interface Car {
  id: string
  name: string
  model: string
  fuelType: FuelType
  tankSize: number
  fuelLevel: number
  wallet: number
  patience: number
  lastVisit: number
  stats: CarStats
  history: HistoryEntry[]
}

export interface Pump {
  id: number
  carId: string | null
  requested: number
  delivered: number
  spent: number
  outTicks: number
}

export interface Tanker {
  id: string
  fuelType: FuelType
  liters: number
  etaTicks: number
  cost: number
}

export interface GlobalStats {
  served: number
  lost: number
  driveBy: number
  revenue: number
}

export interface SimState {
  tick: number
  running: boolean
  speed: number
  balance: number
  markup: number
  reservoirs: Record<FuelType, number>
  cars: Record<string, Car>
  nextCarId: number
  nextTankerId: number
  queue: string[]
  pumps: Pump[]
  tankers: Tanker[]
  activeEvents: ActiveEvent[]
  news: NewsItem[]
  stats: GlobalStats
  gameOver: boolean
}

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  MARKUP_DEFAULT,
  MARKUP_MAX,
  MARKUP_MIN,
  PUMP_COUNT,
  RESERVOIR_START,
  START_BALANCE,
} from './constants'
import { advanceTick } from './engine'
import { orderTanker as orderTankerDraft } from './tanker'
import type { FuelType, SimState } from './types'

export interface SimStore extends SimState {
  toggleRunning: () => void
  setSpeed: (speed: number) => void
  setMarkup: (markup: number) => void
  orderTanker: (fuelType: FuelType) => void
  restart: () => void
  advance: () => void
}

export function createInitialState(): SimState {
  return {
    tick: 0,
    running: false,
    speed: 1,
    balance: START_BALANCE,
    markup: MARKUP_DEFAULT,
    reservoirs: { a92: RESERVOIR_START, a95: RESERVOIR_START, diesel: RESERVOIR_START },
    cars: {},
    nextCarId: 1,
    nextTankerId: 1,
    queue: [],
    pumps: Array.from({ length: PUMP_COUNT }, (_, index) => ({
      id: index + 1,
      carId: null,
      requested: 0,
      delivered: 0,
      spent: 0,
      outTicks: 0,
    })),
    tankers: [],
    activeEvents: [],
    news: [],
    stats: { served: 0, lost: 0, driveBy: 0, revenue: 0 },
    gameOver: false,
  }
}

export const useSimStore = create<SimStore>()(
  immer((set) => ({
    ...createInitialState(),
    toggleRunning: () =>
      set((state) => {
        if (!state.gameOver) state.running = !state.running
      }),
    setSpeed: (speed) =>
      set((state) => {
        state.speed = speed
      }),
    setMarkup: (markup) =>
      set((state) => {
        state.markup = Math.min(MARKUP_MAX, Math.max(MARKUP_MIN, markup))
      }),
    orderTanker: (fuelType) => set((state) => orderTankerDraft(state, fuelType)),
    restart: () =>
      set((state) => {
        Object.assign(state, createInitialState())
      }),
    advance: () => set((state) => advanceTick(state)),
  }))
)

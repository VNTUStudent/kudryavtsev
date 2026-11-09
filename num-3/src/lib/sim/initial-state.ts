import {
  MARKUP_DEFAULT,
  PUMP_COUNT,
  RESERVOIR_START,
  START_BALANCE,
} from './constants'
import type { SimState } from './types'

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

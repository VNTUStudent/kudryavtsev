import { HISTORY_CAP } from './constants'
import type { Car, HistoryKind } from './types'

export function pushHistory(car: Car, tick: number, kind: HistoryKind, text: string): void {
  car.history.push({ tick, kind, text })
  if (car.history.length > HISTORY_CAP) car.history.splice(0, car.history.length - HISTORY_CAP)
}

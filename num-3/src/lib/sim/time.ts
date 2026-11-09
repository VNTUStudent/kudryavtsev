import { MINUTES_PER_DAY, MINUTES_PER_TICK, START_HOUR } from './constants'

export function gameDay(tick: number): number {
  return Math.floor((tick * MINUTES_PER_TICK + START_HOUR * 60) / MINUTES_PER_DAY) + 1
}

export function gameClock(tick: number): string {
  const minutes = (tick * MINUTES_PER_TICK + START_HOUR * 60) % MINUTES_PER_DAY
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

export function gameHour(tick: number): number {
  return Math.floor((tick * MINUTES_PER_TICK + START_HOUR * 60) % MINUTES_PER_DAY) / 60
}

export function gameClockFull(tick: number): string {
  return `День ${gameDay(tick)}, ${gameClock(tick)}`
}

export function etaLabel(ticks: number): string {
  return `≈${ticks * MINUTES_PER_TICK} хв`
}

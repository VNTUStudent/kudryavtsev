import {
  BANKRUPTCY_LIMIT,
  FUEL_TYPES,
  MARKUP_MAX,
  MARKUP_MIN,
  RESERVOIR_MAX,
  SCENARIO_MAX_BALANCE,
  SCENARIO_VERSION,
} from '../sim/constants'
import type { FuelType, SimState } from '../sim/types'

export interface ScenarioConfig {
  balance: number
  markup: number
  reservoirs: Record<FuelType, number>
}

function fail(detail: string): never {
  throw new Error(`Сценарій: ${detail}`)
}

function readFiniteNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key]
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail(`поле «${key}» має бути скінченним числом`)
  }
  return value
}

export function parseScenario(text: string): ScenarioConfig {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    fail('файл не є валідним JSON')
  }
  if (typeof data !== 'object' || data === null) fail('очікується JSON-об\'єкт')
  const source = data as Record<string, unknown>
  if (source.version !== SCENARIO_VERSION) {
    fail(`підтримується лише формат versія ${SCENARIO_VERSION}`)
  }
  const balance = readFiniteNumber(source, 'balance')
  if (balance < 0 || balance > SCENARIO_MAX_BALANCE) {
    fail(`баланс має бути в межах 0..${SCENARIO_MAX_BALANCE}`)
  }
  if (balance <= BANKRUPTCY_LIMIT) fail('станція одразу збанкрутує з таким балансом')
  const markup = readFiniteNumber(source, 'markup')
  const reservoirsSource = source.reservoirs
  if (typeof reservoirsSource !== 'object' || reservoirsSource === null) {
    fail('очікується об\'єкт «reservoirs»')
  }
  const reservoirsInput = reservoirsSource as Record<string, unknown>
  const reservoirs = Object.fromEntries(
    FUEL_TYPES.map((fuelType) => {
      const level = readFiniteNumber(reservoirsInput, fuelType)
      if (level < 0 || level > RESERVOIR_MAX) {
        fail(`рівень ${fuelType} має бути в межах 0..${RESERVOIR_MAX}`)
      }
      return [fuelType, level]
    })
  ) as Record<FuelType, number>
  return { balance, markup, reservoirs }
}

export function applyScenario(state: SimState, config: ScenarioConfig): void {
  state.balance = config.balance
  state.markup = Math.min(MARKUP_MAX, Math.max(MARKUP_MIN, config.markup))
  state.reservoirs = { ...config.reservoirs }
}

export function serializeScenario(config: ScenarioConfig): string {
  return `${JSON.stringify({ version: SCENARIO_VERSION, ...config }, null, 2)}\n`
}

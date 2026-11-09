import { describe, expect, test } from 'bun:test'
import {
  MARKUP_MAX,
  MARKUP_MIN,
  RESERVOIR_MAX,
  RESERVOIR_START,
  SCENARIO_VERSION,
  START_BALANCE,
} from '@/lib/sim/constants'
import {
  applyScenario,
  parseScenario,
  serializeScenario,
} from '@/lib/files/scenario-codec'
import { createInitialState } from '@/lib/sim/initial-state'

const VALID = {
  version: SCENARIO_VERSION,
  balance: 120000,
  markup: 0.2,
  reservoirs: { a92: 800, a95: 1200, diesel: 400 },
}

const validText = JSON.stringify(VALID)

describe('scenario codec', () => {
  test('parses a valid scenario', () => {
    expect(parseScenario(validText)).toEqual({
      balance: 120000,
      markup: 0.2,
      reservoirs: { a92: 800, a95: 1200, diesel: 400 },
    })
  })

  test('rejects broken json with a Ukrainian error', () => {
    expect(() => parseScenario('{oops')).toThrow('валідним JSON')
  })

  test('rejects wrong format version', () => {
    expect(() => parseScenario(JSON.stringify({ ...VALID, version: 99 }))).toThrow('versія')
  })

  test('rejects unknown fields and non-finite numbers', () => {
    expect(() => parseScenario(JSON.stringify({ ...VALID, fuel: 'x' }))).not.toThrow()
    expect(() =>
      parseScenario(JSON.stringify({ ...VALID, balance: Number.POSITIVE_INFINITY }))
    ).toThrow('скінченним числом')
    expect(() => parseScenario(JSON.stringify({ ...VALID, markup: 'cheap' }))).toThrow('markup')
  })

  test('rejects out-of-range balance and reservoir levels', () => {
    expect(() => parseScenario(JSON.stringify({ ...VALID, balance: -5 }))).toThrow('баланс')
    expect(() =>
      parseScenario(JSON.stringify({ ...VALID, reservoirs: { a92: -10, a95: 0, diesel: 0 } }))
    ).toThrow('a92')
    expect(() =>
      parseScenario(JSON.stringify({ ...VALID, reservoirs: { a92: 99999, a95: 0, diesel: 0 } }))
    ).toThrow('a92')
  })

  test('applyScenario clamps markup and copies reservoirs onto fresh state', () => {
    const state = createInitialState()
    applyScenario(state, {
      balance: 90000,
      markup: 99,
      reservoirs: { a92: RESERVOIR_MAX, a95: 0, diesel: RESERVOIR_START },
    })
    expect(state.balance).toBe(90000)
    expect(state.markup).toBe(Math.min(MARKUP_MAX, Math.max(MARKUP_MIN, 99)))
    expect(state.reservoirs).toEqual({
      a92: RESERVOIR_MAX,
      a95: 0,
      diesel: RESERVOIR_START,
    })
    expect(state.tick).toBe(0)
    expect(state.gameOver).toBe(false)
  })

  test('serialize then parse round-trips', () => {
    const config = parseScenario(validText)
    expect(parseScenario(serializeScenario(config))).toEqual(config)
  })

  test('default scenario example matches the initial state numbers', () => {
    const example = parseScenario(
      JSON.stringify({
        version: SCENARIO_VERSION,
        balance: START_BALANCE,
        markup: 0.05,
        reservoirs: { a92: 1000, a95: 1000, diesel: 1000 },
      })
    )
    expect(example.balance).toBe(START_BALANCE)
    expect(example.markup).toBeGreaterThanOrEqual(MARKUP_MIN)
  })
})

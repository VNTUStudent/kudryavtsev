import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { advanceTick, orderTanker } from '@/lib/sim/engine'
import { createInitialState } from '@/lib/sim/initial-state'
import { silentContext } from '@/lib/sim/sim-context'
import type { FuelType, SimState } from '@/lib/sim/types'
import { withSeededRandom } from '../support/seeded-run'

const SEEDS = [7, 42, 2026]
const TICKS = 500
const SNAPSHOT_EVERY = 25
const FIXTURE_PATH = join(import.meta.dir, '../fixtures/sim-baseline.json')

interface TankerOrder {
  atTick: number
  fuelType: FuelType
}

const ORDERS: TankerOrder[] = [
  { atTick: 50, fuelType: 'a92' },
  { atTick: 150, fuelType: 'diesel' },
  { atTick: 250, fuelType: 'a95' },
]

const MARKUP_STEPS: TankerOrder[] = [
  { atTick: 100, fuelType: 'a92' },
  { atTick: 200, fuelType: 'diesel' },
  { atTick: 300, fuelType: 'a95' },
]

const MARKUP_BY_TICK = new Map(MARKUP_STEPS.map((step) => [step.atTick, step.fuelType]))

function snapshot(state: SimState) {
  return {
    tick: state.tick,
    balance: Math.round(state.balance * 100) / 100,
    markup: state.markup,
    reservoirs: {
      a92: Math.round(state.reservoirs.a92 * 100) / 100,
      a95: Math.round(state.reservoirs.a95 * 100) / 100,
      diesel: Math.round(state.reservoirs.diesel * 100) / 100,
    },
    queueLength: state.queue.length,
    tankersInFlight: state.tankers.map((tanker) => tanker.fuelType).sort(),
    pumps: state.pumps.map((pump) => ({
      carId: pump.carId,
      requested: Math.round(pump.requested * 100) / 100,
      delivered: Math.round(pump.delivered * 100) / 100,
    })),
    stats: { ...state.stats, revenue: Math.round(state.stats.revenue * 100) / 100 },
    gameOver: state.gameOver,
  }
}

function runScenario(seed: number) {
  const frames: unknown[] = []
  withSeededRandom(seed, () => {
    const state = createInitialState()
    for (let step = 1; step <= TICKS; step += 1) {
      if (state.tick === 0 && step === 1) {
        for (const order of ORDERS) {
          if (order.atTick === 0) orderTanker(state, order.fuelType, silentContext)
        }
      }
      advanceTick(state, silentContext)
      const order = ORDERS.find((entry) => entry.atTick === state.tick)
      if (order) orderTanker(state, order.fuelType, silentContext)
      const markupStep = MARKUP_BY_TICK.get(state.tick)
      if (markupStep !== undefined) {
        state.markup = markupStep === 'a92' ? 0.3 : markupStep === 'diesel' ? 0 : 0.5
      }
      if (state.tick % SNAPSHOT_EVERY === 0) frames.push(snapshot(state))
    }
  })
  return frames
}

describe('sim regression baseline', () => {
  test('matches the frozen golden master', () => {
    if (process.env.UPDATE_BASELINE === '1') {
      const recorded = Object.fromEntries(SEEDS.map((seed) => [String(seed), runScenario(seed)]))
      writeFileSync(FIXTURE_PATH, `${JSON.stringify(recorded, null, 2)}\n`)
      console.info(`baseline rewritten: ${FIXTURE_PATH}`)
      return
    }
    const recorded = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'))
    for (const seed of SEEDS) {
      expect(runScenario(seed)).toEqual(recorded[String(seed)])
    }
  })
})

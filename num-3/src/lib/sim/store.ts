import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { JOURNAL_TICK_INTERVAL, MARKUP_MAX, MARKUP_MIN } from './constants'
import { applyScenario, type ScenarioConfig } from '../files/scenario-codec'
import { advanceTick, orderTanker as orderTankerDraft } from './engine'
import { appendJournal, createJournal, tickSummaryRecord } from './logging/journal'
import type { JournalRecord } from './logging/types'
import { publishNotice } from './notifications'
import { createInitialState } from './initial-state'
import type { SimNotice } from './sim-notice'
import type { FuelType, SimState } from './types'

export interface SimStore extends SimState {
  journal: JournalRecord[]
  toggleRunning: () => void
  setSpeed: (speed: number) => void
  setMarkup: (markup: number) => void
  orderTanker: (fuelType: FuelType) => void
  importScenario: (config: ScenarioConfig) => void
  restart: () => void
  advance: () => void
}

type SetState = (updater: (state: SimStore) => void) => void

function recordForNotice(notice: SimNotice, tick: number): JournalRecord {
  if (notice.kind === 'tanker-departed') {
    return {
      kind: 'tanker-departed',
      tick,
      fuelType: notice.fuelType,
      cost: notice.cost,
      routeTicks: notice.routeTicks,
      stops: notice.stops,
    }
  }
  if (notice.kind === 'tanker-arrived') {
    return {
      kind: 'tanker-arrived',
      tick,
      fuelType: notice.fuelType,
      added: notice.added,
      overflow: notice.overflow,
    }
  }
  return { kind: 'game-over', tick }
}

function runWithNotices(set: SetState, update: (emit: (notice: SimNotice) => void) => void): void {
  const notices: SimNotice[] = []
  update((notice) => notices.push(notice))
  for (const notice of notices) publishNotice(notice)
  if (notices.length === 0) return
  set((state) => {
    state.journal = notices.reduce(
      (log, notice) => appendJournal(log, recordForNotice(notice, state.tick)),
      state.journal
    )
  })
}

export const useSimStore = create<SimStore>()(
  immer((set) => ({
    ...createInitialState(),
    journal: createJournal('default', createInitialState()),
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
        const clamped = Math.min(MARKUP_MAX, Math.max(MARKUP_MIN, markup))
        if (clamped !== state.markup) {
          state.markup = clamped
          state.journal = appendJournal(state.journal, {
            kind: 'markup-changed',
            tick: state.tick,
            markup: clamped,
          })
        }
      }),
    orderTanker: (fuelType) =>
      runWithNotices(set, (emit) => set((state) => orderTankerDraft(state, fuelType, { emit }))),
    importScenario: (config) =>
      set((state) => {
        Object.assign(state, createInitialState())
        applyScenario(state, config)
        state.journal = createJournal('imported', state)
      }),
    restart: () =>
      set((state) => {
        Object.assign(state, createInitialState())
        state.journal = createJournal('default', state)
      }),
    advance: () =>
      runWithNotices(set, (emit) =>
        set((state) => {
          advanceTick(state, { emit })
          if (state.tick % JOURNAL_TICK_INTERVAL === 0 && !state.gameOver) {
            state.journal = appendJournal(state.journal, tickSummaryRecord(state))
          }
        })
      ),
  }))
)

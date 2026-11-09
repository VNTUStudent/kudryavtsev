import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { MARKUP_MAX, MARKUP_MIN } from './constants'
import { advanceTick, orderTanker as orderTankerDraft } from './engine'
import { createInitialState } from './initial-state'
import { publishNotice } from './notifications'
import type { SimNotice } from './sim-notice'
import type { FuelType, SimState } from './types'

export interface SimStore extends SimState {
  toggleRunning: () => void
  setSpeed: (speed: number) => void
  setMarkup: (markup: number) => void
  orderTanker: (fuelType: FuelType) => void
  restart: () => void
  advance: () => void
}

function runWithNotices(update: (emit: (notice: SimNotice) => void) => void): void {
  const notices: SimNotice[] = []
  update((notice) => notices.push(notice))
  for (const notice of notices) publishNotice(notice)
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
    orderTanker: (fuelType) =>
      runWithNotices((emit) =>
        set((state) => orderTankerDraft(state, fuelType, { emit }))
      ),
    restart: () =>
      set((state) => {
        Object.assign(state, createInitialState())
      }),
    advance: () =>
      runWithNotices((emit) => set((state) => advanceTick(state, { emit }))),
  }))
)

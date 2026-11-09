import type { SimNotice } from './sim-notice'

export interface SimContext {
  emit: (notice: SimNotice) => void
}

export const silentContext: SimContext = { emit: () => {} }

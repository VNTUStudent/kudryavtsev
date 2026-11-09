import type { Draft } from 'immer'
import type { SimContext } from '../sim-context'
import type { SimState } from '../types'

export interface ISimSystem {
  run(state: Draft<SimState>, context: SimContext): void
}

import type { Draft } from 'immer'
import type { SimContext } from '../sim-context'
import type { SimState } from '../types'

export abstract class TickSystem {
  public run(state: Draft<SimState>, context: SimContext): void {
    this.execute(state, context)
  }

  protected abstract execute(state: Draft<SimState>, context: SimContext): void
}

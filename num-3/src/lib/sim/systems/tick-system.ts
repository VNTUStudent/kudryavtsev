import type { Draft } from 'immer'
import type { ISimSystem } from '../contracts/sim-system'
import type { SimContext } from '../sim-context'
import type { SimState } from '../types'

export abstract class TickSystem implements ISimSystem {
  public run(state: Draft<SimState>, context: SimContext): void {
    this.execute(state, context)
  }

  protected abstract execute(state: Draft<SimState>, context: SimContext): void
}

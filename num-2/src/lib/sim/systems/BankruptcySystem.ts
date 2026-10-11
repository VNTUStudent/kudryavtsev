import type { Draft } from 'immer'
import { BANKRUPTCY_LIMIT } from '../constants'
import type { SimContext } from '../sim-context'
import type { SimState } from '../types'
import { TickSystem } from './TickSystem'

export class BankruptcySystem extends TickSystem {
  protected execute(state: Draft<SimState>, context: SimContext): void {
    if (state.balance < BANKRUPTCY_LIMIT) {
      state.gameOver = true
      state.running = false
      context.emit({ kind: 'mobilized' })
    }
  }
}

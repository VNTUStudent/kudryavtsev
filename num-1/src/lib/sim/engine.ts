import { toast } from 'sonner'
import { BANKRUPTCY_LIMIT } from './constants'
import { tickNews } from './news'
import { assignPumps, tickPumps, tickQueue } from './refuel'
import { tickSpawn } from './spawn'
import { tickTankers } from './tanker'
import type { SimState } from './types'

export function advanceTick(state: SimState): void {
  if (state.gameOver) return
  state.tick += 1
  tickNews(state)
  tickTankers(state)
  tickSpawn(state)
  assignPumps(state)
  tickPumps(state)
  tickQueue(state)
  if (state.balance < BANKRUPTCY_LIMIT) {
    state.gameOver = true
    state.running = false
    toast.error('Вас мобілізували', {
      description: 'Місцеві олігархи не простили борги',
      duration: 10000,
    })
  }
}

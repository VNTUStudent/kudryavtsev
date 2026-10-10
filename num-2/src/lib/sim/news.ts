import { silentContext } from './sim-context'
import type { SimState } from './types'
import { NewsSystem } from './systems/news-system'

const newsSystem = new NewsSystem()

export function tickNews(state: SimState): void {
  newsSystem.run(state, silentContext)
}

import { silentContext } from './sim-context'
import type { SimState } from './types'
import { SpawnSystem } from './systems/SpawnSystem'

const spawnSystem = new SpawnSystem()

export function tickSpawn(state: SimState): void {
  spawnSystem.run(state, silentContext)
}

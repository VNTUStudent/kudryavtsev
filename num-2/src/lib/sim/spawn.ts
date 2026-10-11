import { silentContext } from './sim-context'
import type { SimState } from './types'
import { SpawnSystem } from './systems/spawn-system'

const spawnSystem = new SpawnSystem()

export function tickSpawn(state: SimState): void {
  spawnSystem.run(state, silentContext)
}

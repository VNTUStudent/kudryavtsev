import type { RoadNetwork, Route } from './types'
import type { IRouteFinder } from './route-finder'

export class DijkstraRouteFinder implements IRouteFinder {
  public findRoute(network: RoadNetwork, from: string, to: string): Route | null {
    if (from === to) return { nodeIds: [from], totalTicks: 0 }
    const adjacency = this.buildAdjacency(network)
    const distances = new Map<string, number>()
    const predecessors = new Map<string, string>()
    const visited = new Set<string>()
    for (const node of network.nodes) distances.set(node.id, Infinity)
    distances.set(from, 0)
    for (;;) {
      const current = this.pickCheapest(distances, visited, network)
      if (current === null) return null
      if (current === to) break
      visited.add(current)
      for (const [neighbour, ticks] of adjacency.get(current) ?? []) {
        if (visited.has(neighbour)) continue
        const candidate = (distances.get(current) ?? Infinity) + ticks
        if (candidate < (distances.get(neighbour) ?? Infinity)) {
          distances.set(neighbour, candidate)
          predecessors.set(neighbour, current)
        }
      }
    }
    return { nodeIds: this.reconstruct(predecessors, from, to), totalTicks: distances.get(to) ?? 0 }
  }

  private buildAdjacency(network: RoadNetwork): Map<string, [string, number][]> {
    const adjacency = new Map<string, [string, number][]>()
    for (const node of network.nodes) adjacency.set(node.id, [])
    for (const link of network.links) {
      adjacency.get(link.from)?.push([link.to, link.ticks])
      adjacency.get(link.to)?.push([link.from, link.ticks])
    }
    return adjacency
  }

  private pickCheapest(
    distances: Map<string, number>,
    visited: Set<string>,
    network: RoadNetwork
  ): string | null {
    let bestId: string | null = null
    let bestDistance = Infinity
    for (const node of network.nodes) {
      if (visited.has(node.id)) continue
      const distance = distances.get(node.id) ?? Infinity
      if (distance < bestDistance || (distance === bestDistance && bestId !== null && node.id < bestId)) {
        bestId = node.id
        bestDistance = distance
      }
    }
    return bestId
  }

  private reconstruct(predecessors: Map<string, string>, from: string, to: string): string[] {
    const path: string[] = [to]
    let current = to
    while (current !== from) {
      const previous = predecessors.get(current)
      if (previous === undefined) return []
      path.unshift(previous)
      current = previous
    }
    return path
  }
}

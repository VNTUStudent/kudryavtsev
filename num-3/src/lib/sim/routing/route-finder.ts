import type { RoadNetwork, Route } from './types'

export interface IRouteFinder {
  findRoute(network: RoadNetwork, from: string, to: string): Route | null
}

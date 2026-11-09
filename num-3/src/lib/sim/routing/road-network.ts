import {
  DEPOT_NODE_ID,
  ROAD_LINKS,
  ROAD_NODE_LABELS,
  STATION_NODE_ID,
} from '../constants'
import type { RoadNetwork, RouteNode } from './types'

export const ROUTE_ENDPOINTS = { depot: DEPOT_NODE_ID, station: STATION_NODE_ID } as const

export function buildRoadNetwork(): RoadNetwork {
  const nodes: RouteNode[] = Object.keys(ROAD_NODE_LABELS).map((id) => ({
    id,
    label: ROAD_NODE_LABELS[id],
  }))
  return {
    nodes,
    links: ROAD_LINKS.map(([from, to, ticks]) => ({ from, to, ticks })),
  }
}

export interface RouteNode {
  id: string
  label: string
}

export interface RoadLink {
  from: string
  to: string
  ticks: number
}

export interface RoadNetwork {
  nodes: RouteNode[]
  links: RoadLink[]
}

export interface Route {
  nodeIds: string[]
  totalTicks: number
}

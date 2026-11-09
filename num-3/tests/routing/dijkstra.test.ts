import { describe, expect, test } from 'bun:test'
import { DEPOT_NODE_ID, STATION_NODE_ID } from '@/lib/sim/constants'
import { DijkstraRouteFinder } from '@/lib/sim/routing/dijkstra-route-finder'
import { buildRoadNetwork } from '@/lib/sim/routing/road-network'
import type { RoadNetwork } from '@/lib/sim/routing/types'

const finder = new DijkstraRouteFinder()

function network(links: [string, string, number][], nodes: string[]): RoadNetwork {
  return {
    nodes: nodes.map((id) => ({ id, label: id })),
    links: links.map(([from, to, ticks]) => ({ from, to, ticks })),
  }
}

describe('DijkstraRouteFinder', () => {
  test('prefers the cheapest total, not the cheapest first edge', () => {
    const net = network(
      [
        ['a', 'b', 2],
        ['b', 'd', 3],
        ['a', 'c', 3],
        ['c', 'd', 1],
      ],
      ['a', 'b', 'c', 'd']
    )
    expect(finder.findRoute(net, 'a', 'd')).toEqual({
      nodeIds: ['a', 'c', 'd'],
      totalTicks: 4,
    })
  })

  test('walks more edges when the sum is smaller', () => {
    const net = network(
      [
        ['a', 'b', 1],
        ['b', 'e', 10],
        ['a', 'c', 4],
        ['c', 'd', 2],
        ['d', 'e', 2],
      ],
      ['a', 'b', 'c', 'd', 'e']
    )
    expect(finder.findRoute(net, 'a', 'e')?.totalTicks).toBe(8)
    expect(finder.findRoute(net, 'a', 'e')?.nodeIds).toEqual(['a', 'c', 'd', 'e'])
  })

  test('returns null when the destination is disconnected', () => {
    const net = network([['a', 'b', 5]], ['a', 'b', 'island'])
    expect(finder.findRoute(net, 'a', 'island')).toBeNull()
  })

  test('same source and destination is a zero route', () => {
    const net = network([['a', 'b', 5]], ['a', 'b'])
    expect(finder.findRoute(net, 'a', 'a')).toEqual({ nodeIds: ['a'], totalTicks: 0 })
  })

  test('is deterministic on equal-cost alternatives', () => {
    const links: [string, string, number][] = [
      ['a', 'b', 3],
      ['b', 'd', 3],
      ['a', 'c', 2],
      ['c', 'd', 4],
    ]
    const net = network(links, ['a', 'b', 'c', 'd'])
    const first = finder.findRoute(net, 'a', 'd')
    const second = finder.findRoute(net, 'a', 'd')
    expect(first).toEqual(second)
    expect(first?.totalTicks).toBe(6)
  })

  test('traverses undirected links in both directions', () => {
    const net = network([['depot', 'mid', 5], ['mid', 'station', 4]], ['depot', 'mid', 'station'])
    expect(finder.findRoute(net, 'station', 'depot')?.totalTicks).toBe(9)
  })

  test('game network: cheapest depot-to-station route costs 26 ticks', () => {
    expect(finder.findRoute(buildRoadNetwork(), DEPOT_NODE_ID, STATION_NODE_ID)).toEqual({
      nodeIds: ['depot', 'junction-highway', 'station'],
      totalTicks: 26,
    })
  })
})

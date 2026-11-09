import type { Route } from './types'
import type { Tanker } from '../types'

export function tankerElapsedTicks(tanker: Tanker, tick: number): number {
  return Math.max(0, tick - tanker.departedTick)
}

export function tankerRemainingTicks(tanker: Tanker, tick: number): number {
  return Math.max(0, tanker.route.totalTicks - tankerElapsedTicks(tanker, tick))
}

export function tankerProgress(tanker: Tanker, tick: number): number {
  if (tanker.route.totalTicks <= 0) return 1
  return Math.min(1, tankerElapsedTicks(tanker, tick) / tanker.route.totalTicks)
}

export function routeLegs(route: Route): [string, string][] {
  const legs: [string, string][] = []
  for (let index = 0; index < route.nodeIds.length - 1; index += 1) {
    legs.push([route.nodeIds[index], route.nodeIds[index + 1]])
  }
  return legs
}

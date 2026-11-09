export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1))
}

export function chance(probability: number): boolean {
  return Math.random() < probability
}

export function pick<T>(items: readonly T[]): T {
  return items[randInt(0, items.length - 1)]
}

export function weightedPick<T>(entries: readonly [T, number][]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = Math.random() * total
  for (const [item, weight] of entries) {
    roll -= weight
    if (roll <= 0) return item
  }
  return entries[entries.length - 1][0]
}

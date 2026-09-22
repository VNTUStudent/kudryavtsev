import { NEWS_CHANCE_PER_TICK, NEWS_FEED_CAP } from './constants'
import { NEWS_POOL } from './news-pool'
import { chance, pick, weightedPick } from './rng'
import type { NewsEvent, SimState } from './types'

export function tickNews(state: SimState): void {
  for (const active of state.activeEvents) active.ticksLeft -= 1
  const expired = state.activeEvents.filter((active) => active.ticksLeft <= 0)
  for (const active of expired) {
    state.activeEvents.splice(state.activeEvents.indexOf(active), 1)
  }
  if (!chance(NEWS_CHANCE_PER_TICK)) return
  const event = pickEvent(state)
  if (event) fireEvent(state, event)
}

function pickEvent(state: SimState): NewsEvent | null {
  const activeIds = new Set(state.activeEvents.map((active) => active.event.id))
  const entries = NEWS_POOL.filter((event) => !activeIds.has(event.id)).map(
    (event) => [event, event.weight] as [NewsEvent, number]
  )
  if (entries.length === 0) return null
  return weightedPick(entries)
}

function fireEvent(state: SimState, event: NewsEvent): void {
  state.activeEvents.push({ event, ticksLeft: event.durationTicks })
  state.news.unshift({ id: `${event.id}-${state.tick}`, event, tick: state.tick })
  if (state.news.length > NEWS_FEED_CAP) state.news.splice(NEWS_FEED_CAP)
  if (event.effects.pumpOutTicks) {
    const candidates = state.pumps.filter((pump) => pump.carId === null && pump.outTicks === 0)
    if (candidates.length > 0) pick(candidates).outTicks = event.effects.pumpOutTicks
  }
}

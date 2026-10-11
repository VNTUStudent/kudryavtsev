import type { NewsEvent } from './types'
import { MARKET_UP_EVENTS } from './news-categories/market-up'
import { MARKET_DOWN_EVENTS } from './news-categories/market-down'
import { DEMAND_EVENTS } from './news-categories/demand'
import { OPERATIONAL_EVENTS } from './news-categories/operational'
import { VIP_EVENTS } from './news-categories/vip'
import { CRISIS_EVENTS } from './news-categories/crisis'

export const NEWS_POOL: NewsEvent[] = [
  ...MARKET_UP_EVENTS,
  ...MARKET_DOWN_EVENTS,
  ...DEMAND_EVENTS,
  ...OPERATIONAL_EVENTS,
  ...VIP_EVENTS,
  ...CRISIS_EVENTS,
]

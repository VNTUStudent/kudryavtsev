import { all } from './shared'
import type { NewsEvent } from '../types'

export const CRISIS_EVENTS: NewsEvent[] = [
  {
    id: 'crisis-01',
    category: 'crisis',
    source: 'ТСН: надзвичайні новини',
    headline: 'ЕКСКЛЮЗИВ: Трамп вторгся в Іран - барель підскочив, грн впав, дід Панас уже в черзі з трьома каністрами',
    body: 'Барель підскочив, гривня впала, дід Панас - уже в черзі. ТСН тримає руку на пульсі - і на бензоколонці.',
    effects: { priceMul: all(2.2), demandMul: all(1.8) },
    durationTicks: 60,
    weight: 1,
  },
  {
    id: 'crisis-02',
    category: 'crisis',
    source: 'ТСН: міжнародний огляд',
    headline: 'Надзвичайні новини: ОПЕК назавжди посварилася - кожен міністр сказав «хай подорожчає», але кожен про своє',
    body: 'Кожен міністр сказав «хай подорожчає», але кожен про своє. Нафтотрейдери вже потирають руки.',
    effects: { priceMul: all(1.9), demandMul: all(1.5) },
    durationTicks: 72,
    weight: 2,
  },
  {
    id: 'crisis-03',
    category: 'crisis',
    source: 'ТСН розслідує',
    headline: 'ТСН розслідує: паніка в Малинівці - заливають три баки, «а раптом Трамп і до нас»',
    body: 'Малинівка заливає три баки одночасно. На питання «навіщо три» відповідають: «а раптом Трамп і до нас».',
    effects: { priceMul: all(1.5), demandMul: all(2) },
    durationTicks: 45,
    weight: 2,
  },
]

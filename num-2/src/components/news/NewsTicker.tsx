'use client'

import { FUEL_LABELS, FUEL_TYPES } from '@/lib/sim/constants'
import { retailPrice } from '@/lib/sim/market'
import { useSimStore } from '@/lib/sim/store'
import { CATEGORY_META } from './news-meta'

const SLOGANS = [
  'ТСН: барель стабільний - як і наші ціни',
  'Дід Панас передає привіт і просить ще каністру',
  'Експерти радять заправлятися до четверга',
  'У Малинівці знову черга - знову без причини',
  'Трамп поки не вторгся, але ТСН тримає в курсі',
  'ОПЕК обіцяє подумати над цінами',
  'Прогноз погоди: вітер у кармані',
  'Не забудьте передати привіт бабці',
]

export function NewsTicker() {
  const state = useSimStore()
  const prices = FUEL_TYPES.map(
    (fuel) => `${FUEL_LABELS[fuel]} ${retailPrice(state, fuel).toFixed(2).replace('.', ',')} ₴/л`
  )
  const events = state.activeEvents.map((active) =>
    CATEGORY_META[active.event.category].label.toUpperCase()
  )
  const slogan = SLOGANS[state.tick % SLOGANS.length]
  const text = [...prices, ...events, slogan].join('  •  ')

  return (
    <div className="relative flex items-center overflow-hidden bg-black py-1.5">
      <span className="z-10 ml-2 shrink-0 rounded bg-red-700 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white">
        ТСН
      </span>
      <div className="animate-ticker flex w-max">
        <span className="px-4 text-[11px] whitespace-nowrap text-amber-300 tabular-nums">
          {text}
        </span>
        <span className="px-4 text-[11px] whitespace-nowrap text-amber-300 tabular-nums" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  )
}

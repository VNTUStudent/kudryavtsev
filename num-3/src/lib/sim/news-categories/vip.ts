import { all, gas } from './shared'
import type { NewsEvent } from '../types'

export const VIP_EVENTS: NewsEvent[] = [
  {
    id: 'vip-01',
    category: 'vip',
    source: 'ТСН: світські новини',
    headline: 'ЕКСКЛЮЗИВ: голова ОПЕК приїхав у Гадяч - 9 важливих авто раптом захотіли А-92',
    body: 'Голова ОПЕК приїхав до Гадяча «просто в гості». Дев’ять важливих авто одразу згадали про повний бак.',
    effects: { priceMul: all(1.1), demandMul: all(1.2), vipWalletMul: 2.5 },
    durationTicks: 46,
    weight: 3,
  },
  {
    id: 'vip-02',
    category: 'vip',
    source: 'ТСН: особливий гість',
    headline: 'ТСН розслідує: 11 важливих гостей із Полтави замовили А-95, як на весілля на 200 людей',
    body: 'Гості замовили А-95 із розмахом весілля на 200 людей. Дехто з них - ще й із каністрами.',
    effects: { priceMul: gas(1.12), demandMul: gas(1.35), vipWalletMul: 2 },
    durationTicks: 54,
    weight: 5,
  },
  {
    id: 'vip-03',
    category: 'vip',
    source: 'ТСН: ексклюзив',
    headline: 'Надзвичайні новини: 42 водії з Кременчука побачили табличку «нема здачі» - і взяли більше А-95',
    body: 'Табличка «нема здачі» подіяла краще за будь-яку знижку. Водії беруть більше - «аби не рахувати».',
    effects: { priceMul: gas(1.08), demandMul: gas(1.28), vipWalletMul: 2 },
    durationTicks: 38,
    weight: 4,
  },
  {
    id: 'vip-04',
    category: 'vip',
    source: 'ТСН: аграрний ексклюзив',
    headline: 'ЕКСКЛЮЗИВ: 7 МТЗ із Лубен зустріли важливий фургон - ДП пішов галопом',
    body: 'Важливий фургон і сім МТЗ - це вже не черга, а парад. Дизель пішов галопом.',
    effects: { priceMul: { diesel: 1.16 }, demandMul: { diesel: 1.3 }, vipWalletMul: 3 },
    durationTicks: 60,
    weight: 3,
  },
]

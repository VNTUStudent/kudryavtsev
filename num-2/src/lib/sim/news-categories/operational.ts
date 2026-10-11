import type { NewsEvent } from '../types'

export const OPERATIONAL_EVENTS: NewsEvent[] = [
  {
    id: 'operational-01',
    category: 'operational',
    source: 'ТСН: події на АЗС',
    headline: 'ЕКСКЛЮЗИВ: насос №2 на АЗС «Трембіта» образився на 200-літрову каністру',
    body: 'Насос №2 відмовився працювати з 200-літровою каністрою: «я не бензовоз», мовляв. Профілактика - 20 хвилин.',
    effects: { pumpOutTicks: 20 },
    durationTicks: 20,
    weight: 8,
  },
  {
    id: 'operational-02',
    category: 'operational',
    source: 'ТСН: комунальний ефір',
    headline: 'ТСН розслідує: насос №4 у Калинівці просить 15 хвилин тиші - причина «профілактика»',
    body: 'Технік каже: насос просто втомився. П’ятнадцять хвилин тиші прописали офіційно.',
    effects: { pumpOutTicks: 26 },
    durationTicks: 26,
    weight: 6,
  },
  {
    id: 'operational-03',
    category: 'operational',
    source: 'ТСН: місцеві новини',
    headline: 'ЕКСКЛЮЗИВ: ЖЕК Зінькова о 07:30 перекрив під’їзд до колонки №3',
    body: 'Ремонт труби «ще з минулого року» нарешті почався. Під’їзд відкриють, коли скінчиться профілактика.',
    effects: { pumpOutTicks: 34 },
    durationTicks: 34,
    weight: 4,
  },
  {
    id: 'operational-04',
    category: 'operational',
    source: 'ТСН: надзвичайні події',
    headline: 'Надзвичайні новини: насос №6 побачив чек на 80 л у Ніжині й узяв вихідний',
    body: 'Насос побачив чек на 80 літрів і зрозумів: йому теж потрібен відпочинок. Повернеться за 20 хвилин.',
    effects: { pumpOutTicks: 20 },
    durationTicks: 20,
    weight: 7,
  },
]

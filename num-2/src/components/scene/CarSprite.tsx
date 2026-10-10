'use client'

import type { CarBody } from '@/lib/sim/names'
import type { ReactElement } from 'react'

const WINDOW = '#b8dcf0'
const TIRE = '#23262c'
const HUB = '#aab2bd'

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={TIRE} />
      <circle cx={cx} cy={cy} r={r * 0.42} fill={HUB} />
    </g>
  )
}

function Sedan({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M8 30 Q8 23 16 21.5 L44 21 L52 7 Q54 6 57 6 L79 6 Q83 6 85 9 L92 21 L110 23.5 Q118 25.5 118 32 L118 42 Q118 47 112 47 L14 47 Q8 47 8 42 Z"
        fill={color}
      />
      <path d="M46 21 L54 6 L79 6 L90 21 Z" fill={WINDOW} />
      <rect x="63" y="6" width="4.5" height="15" fill={color} />
      <rect x="6" y="28" width="5.5" height="6" rx="1.5" fill="#ffdf6b" />
      <rect x="117" y="28" width="4" height="6" rx="1.5" fill="#e04141" />
      <rect x="60" y="28" width="9" height="2.5" rx="1" fill="rgba(0,0,0,0.25)" />
      <Wheel cx={34} cy={47} r={10.5} />
      <Wheel cx={94} cy={47} r={10.5} />
    </g>
  )
}

function Hatch({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M10 30 Q10 24 18 22.5 L38 20.5 L46 8 Q48 6 52 6 L74 6 Q84 6 86 15 L90 20.5 L110 23.5 Q118 25.5 118 32 L118 42 Q118 47 112 47 L16 47 Q10 47 10 42 Z"
        fill={color}
      />
      <path d="M50 20.5 L54 6 L72 6 Q79 6 81 13 L84 20.5 Z" fill={WINDOW} />
      <rect x="61" y="6" width="4" height="14.5" fill={color} />
      <rect x="8" y="28" width="5.5" height="6" rx="1.5" fill="#ffdf6b" />
      <rect x="117" y="28" width="4" height="6" rx="1.5" fill="#e04141" />
      <rect x="58" y="28" width="8" height="2.5" rx="1" fill="rgba(0,0,0,0.25)" />
      <Wheel cx={32} cy={47} r={10} />
      <Wheel cx={96} cy={47} r={10} />
    </g>
  )
}

function Taxi({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M8 30 Q8 23 16 21.5 L44 21 L52 7 Q54 6 57 6 L79 6 Q83 6 85 9 L92 21 L110 23.5 Q118 25.5 118 32 L118 42 Q118 47 112 47 L14 47 Q8 47 8 42 Z"
        fill={color}
      />
      <path d="M46 21 L54 6 L79 6 L90 21 Z" fill={WINDOW} />
      <rect x="63" y="6" width="4.5" height="15" fill={color} />
      <rect x="55" y="0" width="20" height="7" rx="2" fill="#17191d" />
      <text x="65" y="5.4" textAnchor="middle" fontSize="4.6" fontWeight="800" fill="#ffd23f">
        TAXI
      </text>
      <rect x="16" y="33" width="94" height="5" fill="#17191d" />
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <rect key={index} x={18 + index * 15.6} y="34.2" width="7.5" height="2.6" fill="#ffffff" />
      ))}
      <rect x="6" y="28" width="5.5" height="6" rx="1.5" fill="#ffdf6b" />
      <rect x="117" y="28" width="4" height="6" rx="1.5" fill="#e04141" />
      <Wheel cx={34} cy={47} r={10.5} />
      <Wheel cx={94} cy={47} r={10.5} />
    </g>
  )
}

function Van({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M8 47 L8 26 Q8 18 16 16 L32 14.5 L34 5 Q34.5 4 37 4 L112 4 Q116 4 116 8 L116 47 Z"
        fill={color}
      />
      <path d="M12 22 L30 20.5 L31 30 L12 31.5 Z" fill={WINDOW} />
      <rect x="39" y="8" width="28" height="15" rx="2" fill={WINDOW} />
      <path d="M36 14.5 L36 47" stroke="rgba(0,0,0,0.14)" strokeWidth="1.5" />
      <rect x="6" y="24" width="5" height="6" rx="1.5" fill="#ffdf6b" />
      <rect x="113" y="24" width="4" height="6" rx="1.5" fill="#e04141" />
      <Wheel cx={30} cy={47} r={10} />
      <Wheel cx={98} cy={47} r={10} />
    </g>
  )
}

function Tractor({ color }: { color: string }) {
  return (
    <g>
      <rect x="12" y="42" width="94" height="6" fill="#2b2f36" />
      <rect x="10" y="28" width="42" height="15" rx="2" fill={color} />
      <path d="M56 42 L56 12 Q56 9 59 9 L82 9 Q86 9 86 13 L86 42 Z" fill={color} />
      <rect x="60" y="13" width="21" height="16" rx="1.5" fill={WINDOW} />
      <rect x="62" y="0" width="5" height="11" rx="2" fill="#3a3f46" />
      <rect x="59" y="0" width="11" height="3" rx="1.5" fill="#3a3f46" />
      <rect x="8" y="30" width="4" height="5" rx="1" fill="#ffdf6b" />
      <Wheel cx={90} cy={44} r={17} />
      <Wheel cx={24} cy={46} r={10} />
    </g>
  )
}

function Combine({ color }: { color: string }) {
  return (
    <g>
      <path d="M98 11 L122 1" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M36 42 L36 13 Q36 9 40 9 L98 9 Q103 9 103 14 L103 42 Z" fill={color} />
      <rect x="42" y="14" width="22" height="12" rx="1.5" fill={WINDOW} />
      <rect x="1" y="38" width="30" height="12" rx="2" fill="#c9a23a" />
      <circle cx="7" cy="44" r="7" fill="#9c7c33" stroke="#6d5526" strokeWidth="2" />
      <rect x="4" y="34" width="26" height="4" rx="2" fill="#7a7f88" />
      <rect x="10" y="26" width="4" height="5" rx="1" fill="#ffdf6b" />
      <Wheel cx={42} cy={45} r={14} />
      <Wheel cx={95} cy={47} r={9} />
    </g>
  )
}

const SPRITES: Record<CarBody, (props: { color: string }) => ReactElement> = {
  hatch: Hatch,
  sedan: Sedan,
  taxi: Taxi,
  van: Van,
  tractor: Tractor,
  combine: Combine,
}

export function CarSprite({
  body,
  color,
  night,
}: {
  body: CarBody
  color: string
  night: boolean
}) {
  const Sprite = SPRITES[body]
  return (
    <svg viewBox="0 0 128 64" className="h-auto w-full overflow-visible" role="img">
      {night && (
        <>
          <polygon points="2,28 -58,16 -58,46" fill="rgba(255,226,140,0.28)" />
          <circle cx="9" cy="31" r="3.5" fill="#ffe9a3" />
        </>
      )}
      <Sprite color={color} />
    </svg>
  )
}

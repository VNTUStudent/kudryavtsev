'use client'

import { FUEL_HEX, FUEL_LABELS, FUEL_TYPES } from '@/lib/sim/constants'
import { retailPrice } from '@/lib/sim/market'
import { useSimStore } from '@/lib/sim/store'

const ROW_Y = [244, 284, 324]

export function PriceTotem({ night }: { night: number }) {
  const state = useSimStore()
  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <rect x="1480" y="392" width="18" height="80" fill="#6b7280" />
      <rect
        x="1425"
        y="160"
        width="130"
        height="238"
        rx="9"
        fill={night > 0.4 ? '#1b2f55' : '#14213d'}
        stroke="#0c1526"
        strokeWidth="4"
      />
      <text
        x="1490"
        y="190"
        textAnchor="middle"
        fontSize="16.5"
        fontWeight="800"
        fill="#ffd23f"
        letterSpacing="1"
      >
        ТРЕМБІТА
      </text>
      <rect x="1438" y="202" width="104" height="3" rx="1.5" fill="#2c3a5c" />
      {FUEL_TYPES.map((fuel, index) => (
        <g key={fuel}>
          <text
            x="1440"
            y={ROW_Y[index]}
            fontSize="15"
            fontWeight="700"
            fill={FUEL_HEX[fuel]}
            dominantBaseline="central"
          >
            {FUEL_LABELS[fuel]}
          </text>
          <text
            x="1540"
            y={ROW_Y[index]}
            textAnchor="end"
            fontSize="15"
            fontWeight="700"
            fill="#ffffff"
            dominantBaseline="central"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {retailPrice(state, fuel).toFixed(2).replace('.', ',')}
          </text>
        </g>
      ))}
      <text x="1490" y="378" textAnchor="middle" fontSize="18" fill="#8fa0c4">
        ₴ / л
      </text>
    </svg>
  )
}

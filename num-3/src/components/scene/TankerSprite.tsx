'use client'

import { FUEL_HEX } from '@/lib/sim/constants'
import type { Tanker } from '@/lib/sim/types'
import { TANKER_BOTTOM, tankerX } from './car-layout'

export function TankerSprite({
  tanker,
  progress,
  night,
}: {
  tanker: Tanker
  progress: number
  night: boolean
}) {
  return (
    <div
      className="pointer-events-none absolute z-15 -translate-x-1/2"
      style={{
        left: `${tankerX(progress)}%`,
        bottom: `${TANKER_BOTTOM}%`,
        width: '12%',
        transition: 'left var(--tick-ms) linear',
      }}
    >
      <svg viewBox="0 0 128 64" className="h-auto w-full overflow-visible" role="img">
        {night && (
          <>
            <polygon points="2,26 -42,14 -42,44" fill="rgba(255,226,140,0.28)" />
            <circle cx="6" cy="29" r="3" fill="#ffe9a3" />
          </>
        )}
        <path d="M4 47 L4 26 Q4 17 13 15 L27 14 L29 21 L40 21 L40 47 Z" fill="#2a4d8f" />
        <path d="M8 24 L25 23 L26 31 L8 32 Z" fill="#b8dcf0" />
        <rect x="40" y="12" width="78" height="30" rx="14" fill={FUEL_HEX[tanker.fuelType]} />
        <rect
          x="40"
          y="12"
          width="78"
          height="30"
          rx="14"
          fill="none"
          stroke="#3a3f46"
          strokeWidth="3"
        />
        <rect x="48" y="21" width="62" height="5" rx="2.5" fill="#ffffff" opacity="0.35" />
        <rect x="34" y="40" width="88" height="6" fill="#2b2f36" />
        <rect x="2" y="26" width="4" height="5" rx="1.5" fill="#ffdf6b" />
        <rect x="121" y="26" width="4" height="5" rx="1.5" fill="#e04141" />
        {[
          { cx: 20 },
          { cx: 54 },
          { cx: 74 },
          { cx: 102 },
        ].map((wheel) => (
          <g key={wheel.cx}>
            <circle cx={wheel.cx} cy={47} r={9} fill="#23262c" />
            <circle cx={wheel.cx} cy={47} r={3.8} fill="#aab2bd" />
          </g>
        ))}
      </svg>
    </div>
  )
}

'use client'

import { FUEL_HEX } from '@/lib/sim/constants'
import type { Car, Pump } from '@/lib/sim/types'
import { PUMP_X } from './car-layout'

export function HoseLayer({ pumps, carsByPump }: { pumps: Pump[]; carsByPump: (Car | null)[] }) {
  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-25 h-full w-full"
    >
      {pumps.map((pump, index) => {
        const car = carsByPump[index]
        if (pump.carId === null || pump.outTicks > 0 || !car) return null
        const px = PUMP_X[index] * 16
        const path = `M ${px + 36} 446 C ${px + 122} 452, ${px + 124} 545, ${px + 42} 572`
        return (
          <g key={pump.id}>
            <path d={path} fill="none" stroke="#23272e" strokeWidth="7" strokeLinecap="round" />
            <path
              d={path}
              fill="none"
              stroke={FUEL_HEX[car.fuelType]}
              strokeWidth="2.6"
              strokeLinecap="round"
              className="hose-flow"
            />
            <circle cx={px + 42} cy={572} r="7" fill="#3a3f46" />
          </g>
        )
      })}
    </svg>
  )
}

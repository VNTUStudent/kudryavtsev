'use client'

import { FUEL_HEX } from '@/lib/sim/constants'
import { fmtMoney } from '@/lib/sim/format'
import type { Car, FuelType, Pump } from '@/lib/sim/types'

export function PumpSprite({
  pump,
  x,
  fuelType,
}: {
  pump: Pump
  x: number
  fuelType: FuelType | null
}) {
  const out = pump.outTicks > 0
  const busy = pump.carId !== null && !out
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2"
      style={{ left: `${x}%`, bottom: '33.4%', width: '4.8%' }}
    >
      <svg viewBox="0 0 50 112" className="h-auto w-full overflow-visible">
        <rect x="7" y="103" width="36" height="8" rx="2" fill="#2f3238" />
        <rect x="11" y="6" width="28" height="97" rx="5" fill={out ? '#b7b1a6' : '#f5f7f9'} />
        <rect x="11" y="6" width="28" height="16" rx="5" fill={out ? '#8d887e' : '#2a4d8f'} />
        <rect x="11" y="17" width="28" height="5" fill={out ? '#8d887e' : '#2a4d8f'} />
        <text x="25" y="18.5" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#ffffff">
          {pump.id}
        </text>
        <rect x="15" y="29" width="20" height="14" rx="2" fill="#0d1712" />
        {busy ? (
          <text
            x="25"
            y="38.5"
            textAnchor="middle"
            fontSize="7"
            fill="#7cffb2"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {Math.round(pump.delivered)} л
          </text>
        ) : (
          <circle cx="25" cy="36" r="3.2" fill={out ? '#5f5b53' : '#6ee7a0'} />
        )}
        {busy && fuelType && (
          <rect x="15" y="46" width="20" height="4" rx="2" fill={FUEL_HEX[fuelType]} />
        )}
        <rect x="40" y="32" width="7" height="12" rx="2" fill="#3a3f46" />
        <rect x="36" y="44" width="4" height="10" rx="2" fill="#3a3f46" />
        {out && (
          <g>
            <line x1="14" y1="9" x2="36" y2="100" stroke="#d97706" strokeWidth="4" />
            <line x1="36" y1="9" x2="14" y2="100" stroke="#d97706" strokeWidth="4" />
            <path d="M46 104 L62 104 L54 88 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <rect x="49" y="98" width="9" height="3" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  )
}

export function RefuelBadge({
  pump,
  car,
  x,
  onSelectCar,
}: {
  pump: Pump
  car: Car
  x: number
  onSelectCar: (carId: string) => void
}) {
  const percent =
    pump.requested > 0 ? Math.min(100, Math.round((pump.delivered / pump.requested) * 100)) : 0
  return (
    <button
      type="button"
      onClick={() => onSelectCar(car.id)}
      className="absolute z-30 -translate-x-1/2 cursor-pointer rounded-lg border border-white/15 bg-black/75 px-2 py-1 text-left shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
      style={{ left: `${x}%`, bottom: '17.5%' }}
    >
      <div className="flex items-center gap-1.5 text-[10px] leading-none font-semibold whitespace-nowrap text-white tabular-nums">
        <span className="size-1.5 rounded-full" style={{ background: FUEL_HEX[car.fuelType] }} />
        {car.name}
      </div>
      <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, background: FUEL_HEX[car.fuelType] }}
        />
      </div>
      <div className="mt-1 text-[9px] leading-none text-white/70 tabular-nums">
        {Math.round(pump.delivered)} / {Math.round(pump.requested)} л · {fmtMoney(pump.spent)}
      </div>
    </button>
  )
}

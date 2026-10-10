'use client'

import { Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FUEL_HEX, FUEL_LABELS, FUEL_TYPES, RESERVOIR_MAX } from '@/lib/sim/constants'
import { fmtLiters } from '@/lib/sim/format'
import { activePriceMul, demandMul, retailPrice, wholesalePrice } from '@/lib/sim/market'
import { useSimStore } from '@/lib/sim/store'

export function FuelCard() {
  const state = useSimStore()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Пальне і резервуари</CardTitle>
        <CardDescription>Тотем біля в’їзду показує ті самі ціни</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {FUEL_TYPES.map((fuelType) => {
          const reservoir = state.reservoirs[fuelType]
          const percent = Math.round((reservoir / RESERVOIR_MAX) * 100)
          const priceMul = activePriceMul(state, fuelType)
          const demand = demandMul(state, fuelType)
          const low = reservoir < RESERVOIR_MAX * 0.15
          return (
            <div key={fuelType} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: FUEL_HEX[fuelType] }}
                  />
                  <span className="font-heading text-sm font-semibold">
                    {FUEL_LABELS[fuelType]}
                  </span>
                  {low && (
                    <Badge variant="destructive" className="h-4 px-1.5 text-[9px]">
                      мало!
                    </Badge>
                  )}
                  {demand > 1.01 && (
                    <Badge variant="secondary" className="h-4 gap-0.5 px-1.5 text-[9px]">
                      <Flame className="size-2.5" />
                      ×{demand.toFixed(2)}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-base font-bold tabular-nums">
                    {retailPrice(state, fuelType).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-muted-foreground text-[10px]">₴/л</span>
                  <span
                    className={`text-[10px] tabular-nums ${
                      priceMul > 1.01
                        ? 'text-destructive'
                        : priceMul < 0.99
                          ? 'text-emerald-600'
                          : 'text-muted-foreground'
                    }`}
                  >
                    опт {wholesalePrice(state, fuelType).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="text-muted-foreground mt-0.5 text-[10px] tabular-nums">
                  {fmtLiters(reservoir)} / {RESERVOIR_MAX} л
                </div>
              </div>
              <div className="relative h-16 w-3.5 shrink-0 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-700"
                  style={{
                    height: `${percent}%`,
                    background: FUEL_HEX[fuelType],
                    opacity: low ? 0.55 : 1,
                  }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

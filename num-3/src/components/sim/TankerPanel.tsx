'use client'

import { Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FUEL_LABELS, FUEL_TYPES, TANKER_FEE, TANKER_LITERS } from '@/lib/sim/constants'
import { fmtLiters, fmtMoney } from '@/lib/sim/format'
import { wholesalePrice } from '@/lib/sim/market'
import { useSimStore } from '@/lib/sim/store'
import { etaLabel } from '@/lib/sim/time'

export function TankerPanel() {
  const state = useSimStore()
  const orderTanker = useSimStore((store) => store.orderTanker)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Бензовози</CardTitle>
        <CardDescription>
          {fmtLiters(TANKER_LITERS)} доставки + {fmtMoney(TANKER_FEE)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {FUEL_TYPES.map((fuelType) => {
          const cost = Math.round(wholesalePrice(state, fuelType) * TANKER_LITERS + TANKER_FEE)
          return (
            <div key={fuelType} className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{FUEL_LABELS[fuelType]}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={state.gameOver}
                onClick={() => orderTanker(fuelType)}
              >
                <Truck data-icon="inline-start" />
                {fmtMoney(cost)}
              </Button>
            </div>
          )
        })}
        {state.tankers.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t pt-2">
            {state.tankers.map((tanker) => (
              <div
                key={tanker.id}
                className="text-muted-foreground flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <Truck className="size-3.5" />
                  {FUEL_LABELS[tanker.fuelType]} · {fmtLiters(tanker.liters)}
                </span>
                <Badge variant="secondary">Через {etaLabel(tanker.etaTicks)}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

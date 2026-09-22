'use client'

import { Fuel, Wallet } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { FuelBadge } from '@/components/sim/FuelBadge'
import { fmtLiters, fmtMoney } from '@/lib/sim/format'
import { useSimStore } from '@/lib/sim/store'
import { gameClockFull } from '@/lib/sim/time'
import type { HistoryKind } from '@/lib/sim/types'

const KIND_COLOR: Record<HistoryKind, string> = {
  arrived: 'bg-muted-foreground',
  refueled: 'bg-emerald-500',
  left: 'bg-rose-400',
}

export function CarDetailSheet({ carId, onClose }: { carId: string | null; onClose: () => void }) {
  const car = useSimStore((state) => (carId ? state.cars[carId] : null))

  return (
    <Sheet
      open={carId !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {car && (
          <>
            <SheetHeader>
              <SheetTitle>{car.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                {car.model}
                <FuelBadge fuelType={car.fuelType} />
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted p-2">
                  <div className="text-muted-foreground text-xs">Візити</div>
                  <div className="font-heading font-semibold tabular-nums">
                    {car.stats.visits}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <div className="text-muted-foreground text-xs">Куплено</div>
                  <div className="font-heading font-semibold tabular-nums">
                    {fmtLiters(car.stats.litersBought)}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <div className="text-muted-foreground text-xs">Витратив</div>
                  <div className="font-heading font-semibold tabular-nums">
                    {fmtMoney(car.stats.totalSpent)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <Fuel className="text-muted-foreground size-4" />
                    Бак
                  </span>
                  <span className="tabular-nums">
                    {Math.round(car.fuelLevel)} / {car.tankSize} л
                  </span>
                </div>
                <Progress value={Math.round((car.fuelLevel / car.tankSize) * 100)} />
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="text-muted-foreground size-4" />
                    Гаманець
                  </span>
                  <span className="tabular-nums">{fmtMoney(car.wallet)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium">Історія</div>
                {car.history.length === 0 && (
                  <div className="text-muted-foreground text-xs">Порожньо</div>
                )}
                {[...car.history].reverse().map((entry, index) => (
                  <div key={index} className="flex gap-2.5 text-sm">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${KIND_COLOR[entry.kind]}`}
                    />
                    <div className="leading-snug">
                      <span className="text-muted-foreground">{gameClockFull(entry.tick)} - </span>
                      {entry.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { Badge } from '@/components/ui/badge'
import { FUEL_LABELS } from '@/lib/sim/constants'
import type { FuelType } from '@/lib/sim/types'

const FUEL_CLASS: Record<FuelType, string> = {
  a92: 'bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300',
  a95: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-300',
  diesel: 'bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-sky-300',
}

export function FuelBadge({ fuelType }: { fuelType: FuelType }) {
  return (
    <Badge variant="outline" className={FUEL_CLASS[fuelType]}>
      {FUEL_LABELS[fuelType]}
    </Badge>
  )
}

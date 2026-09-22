import { toast } from 'sonner'
import {
  FUEL_LABELS,
  RESERVOIR_MAX,
  TANKER_ETA_MAX,
  TANKER_ETA_MIN,
  TANKER_FEE,
  TANKER_LITERS,
} from './constants'
import { fmtLiters, fmtMoney } from './format'
import { wholesalePrice } from './market'
import { randInt } from './rng'
import type { FuelType, SimState } from './types'

export function orderTanker(state: SimState, fuelType: FuelType): void {
  const cost = Math.round(wholesalePrice(state, fuelType) * TANKER_LITERS + TANKER_FEE)
  state.tankers.push({
    id: `tanker-${state.nextTankerId}`,
    fuelType,
    liters: TANKER_LITERS,
    etaTicks: randInt(TANKER_ETA_MIN, TANKER_ETA_MAX),
    cost,
  })
  state.nextTankerId += 1
  state.balance -= cost
  toast(`Бензовоз ${FUEL_LABELS[fuelType]} виїхав`, {
    description: `Сплачено ${fmtMoney(cost)} · 1 000 л у дорозі`,
  })
}

export function tickTankers(state: SimState): void {
  for (const tanker of [...state.tankers]) {
    tanker.etaTicks -= 1
    if (tanker.etaTicks > 0) continue
    const current = state.reservoirs[tanker.fuelType]
    const added = Math.min(RESERVOIR_MAX - current, tanker.liters)
    state.reservoirs[tanker.fuelType] = current + added
    state.tankers.splice(state.tankers.indexOf(tanker), 1)
    const overflow = tanker.liters - added
    toast(`Бензовоз ${FUEL_LABELS[tanker.fuelType]} приїхав`, {
      description:
        overflow > 1 ? `Залив ${fmtLiters(added)} - ${fmtLiters(overflow)} не влізло` : `Залив ${fmtLiters(added)}`,
    })
  }
}

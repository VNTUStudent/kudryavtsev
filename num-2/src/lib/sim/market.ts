import { FUEL_BASE_PRICE, OP_COST_PER_LITER } from './constants'
import type { FuelType, SimState } from './types'

export function activePriceMul(state: SimState, fuelType: FuelType): number {
  return state.activeEvents.reduce(
    (mul, active) => mul * (active.event.effects.priceMul?.[fuelType] ?? 1),
    1
  )
}

export function demandMul(state: SimState, fuelType: FuelType): number {
  return state.activeEvents.reduce(
    (mul, active) => mul * (active.event.effects.demandMul?.[fuelType] ?? 1),
    1
  )
}

export function wholesalePrice(state: SimState, fuelType: FuelType): number {
  return FUEL_BASE_PRICE[fuelType] * activePriceMul(state, fuelType)
}

export function retailPrice(state: SimState, fuelType: FuelType): number {
  return (wholesalePrice(state, fuelType) + OP_COST_PER_LITER) * (1 + state.markup)
}

export function vipWalletMul(state: SimState): number {
  return state.activeEvents.reduce(
    (mul, active) => Math.max(mul, active.event.effects.vipWalletMul ?? 1),
    1
  )
}

export function joinChance(state: SimState): number {
  return Math.min(1.45, Math.max(0.15, 1.3 - 1.2 * state.markup))
}

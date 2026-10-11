import type { FuelType } from '../types'

export const all = (mul: number): Partial<Record<FuelType, number>> => ({ a92: mul, a95: mul, diesel: mul })
export const gas = (mul: number): Partial<Record<FuelType, number>> => ({ a92: mul, a95: mul })

import { CAR_MODELS, type CarBody } from '@/lib/sim/names'
import type { Car } from '@/lib/sim/types'

export const PUMP_X = [21, 31.5, 42, 52.5]
export const PUMP_WIDTH = 4.8
export const QUEUE_START = 62
export const QUEUE_STEP = 6
export const CAR_BOTTOM = 6
export const TANKER_BOTTOM = 24
export const TANKER_PARK_X = 9
export const TANKER_ENTER_X = 108
export const EXIT_X = -14

const BODY_BY_MODEL = new Map(CAR_MODELS.map((model) => [model.name, model.body]))

const BODY_WIDTH: Record<CarBody, number> = {
  hatch: 6.4,
  sedan: 7.4,
  taxi: 7.4,
  van: 7.8,
  tractor: 7,
  combine: 9,
}

const CAR_COLORS = [
  '#d94f4f',
  '#e58e3a',
  '#e3b53a',
  '#7cb342',
  '#3aa76d',
  '#4fb3bf',
  '#4f7fd9',
  '#7a6bd9',
  '#c96bb8',
  '#8d99ae',
  '#c7cdd6',
  '#5d6d7e',
]

const FIXED_COLORS: Partial<Record<CarBody, string>> = {
  taxi: '#f2c230',
  tractor: '#59a832',
  combine: '#d94f2f',
}

export function carBody(car: Car): CarBody {
  return BODY_BY_MODEL.get(car.model) ?? 'sedan'
}

export function carWidth(body: CarBody): number {
  return BODY_WIDTH[body]
}

export function carColor(car: Car): string {
  const fixed = FIXED_COLORS[carBody(car)]
  if (fixed) return fixed
  return CAR_COLORS[hashId(car.id) % CAR_COLORS.length]
}

export function queueX(index: number): number {
  return QUEUE_START + index * QUEUE_STEP
}

export function tankerX(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress))
  return TANKER_ENTER_X - clamped * (TANKER_ENTER_X - TANKER_PARK_X)
}

function hashId(id: string): number {
  let hash = 7
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

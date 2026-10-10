import {
  FUEL_DEMAND_WEIGHT,
  FUEL_LABELS,
  FUEL_TYPES,
  INCOME_MAX,
  INCOME_MIN,
  PATIENCE_MAX,
  PATIENCE_MIN,
  QUEUE_LIMIT,
  ROSTER_TARGET,
  SPAWN_RATE,
  WALLET_CAP,
  WALLET_MAX,
  WALLET_MIN,
} from './constants'
import { pushHistory } from './history'
import { demandMul, joinChance, vipWalletMul } from './market'
import { CAR_MODELS, CAR_NAMES } from './names'
import { chance, pick, rand, randInt, weightedPick } from './rng'
import type { Car, FuelType, SimState } from './types'

export function tickSpawn(state: SimState): void {
  const totalDemand = FUEL_TYPES.reduce(
    (sum, fuel) => sum + FUEL_DEMAND_WEIGHT[fuel] * demandMul(state, fuel),
    0
  )
  if (!chance(SPAWN_RATE * totalDemand)) return
  if (state.queue.length >= QUEUE_LIMIT || !chance(joinChance(state))) {
    state.stats.driveBy += 1
    return
  }
  const car = acquireCar(state, pickFuel(state))
  state.queue.push(car.id)
}

function pickFuel(state: SimState): FuelType {
  const entries = FUEL_TYPES.map(
    (fuel) => [fuel, FUEL_DEMAND_WEIGHT[fuel] * demandMul(state, fuel)] as [FuelType, number]
  )
  return weightedPick(entries)
}

function acquireCar(state: SimState, fuelType: FuelType): Car {
  const idle = Object.values(state.cars).filter(
    (car) => car.fuelType === fuelType && !isVisiting(state, car.id)
  )
  const rosterFull = Object.keys(state.cars).length >= ROSTER_TARGET
  const car =
    idle.length > 0 && (rosterFull || chance(0.65))
      ? refreshCar(pick(idle), state)
      : createCar(state, fuelType)
  car.patience = randInt(PATIENCE_MIN, PATIENCE_MAX)
  car.lastVisit = state.tick
  car.stats.visits += 1
  pushHistory(car, state.tick, 'arrived', `Прибув на заправку - ${FUEL_LABELS[car.fuelType]}`)
  return car
}

function createCar(state: SimState, fuelType: FuelType): Car {
  const model = pick(CAR_MODELS.filter((entry) => entry.fuels.includes(fuelType)))
  const tankSize = randInt(model.tank[0], model.tank[1])
  const car: Car = {
    id: `car-${state.nextCarId}`,
    name: pick(CAR_NAMES),
    model: model.name,
    fuelType,
    tankSize,
    fuelLevel: Math.round(tankSize * rand(0.05, 0.4)),
    wallet: Math.round(rand(WALLET_MIN, WALLET_MAX) * vipWalletMul(state)),
    patience: 0,
    lastVisit: state.tick,
    stats: { visits: 0, litersBought: 0, totalSpent: 0 },
    history: [],
  }
  state.nextCarId += 1
  state.cars[car.id] = car
  return car
}

function refreshCar(car: Car, state: SimState): Car {
  const income = randInt(INCOME_MIN, INCOME_MAX)
  car.wallet = Math.min(Math.round((car.wallet + income) * vipWalletMul(state)), WALLET_CAP)
  car.fuelLevel = Math.round(car.tankSize * rand(0.05, 0.4))
  return car
}

function isVisiting(state: SimState, carId: string): boolean {
  return state.queue.includes(carId) || state.pumps.some((pump) => pump.carId === carId)
}

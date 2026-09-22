import { FLOW_PER_TICK, FUEL_LABELS, MIN_PURCHASE_LITERS } from './constants'
import { fmtLiters, fmtMoney } from './format'
import { pushHistory } from './history'
import { retailPrice } from './market'
import type { Car, Pump, SimState } from './types'

export function assignPumps(state: SimState): void {
  for (const pump of state.pumps) {
    if (pump.carId !== null || pump.outTicks > 0) continue
    const carId = state.queue.shift()
    if (carId === undefined) return
    const car = state.cars[carId]
    if (car === undefined) continue
    if (car.tankSize - car.fuelLevel < MIN_PURCHASE_LITERS) {
      leave(state, car, 'Поїхав - бак і так повен', false)
      continue
    }
    if (state.reservoirs[car.fuelType] < MIN_PURCHASE_LITERS) {
      leave(state, car, `Поїхав - ${FUEL_LABELS[car.fuelType]} немає`, true)
      continue
    }
    const affordable = car.wallet / retailPrice(state, car.fuelType)
    if (affordable < MIN_PURCHASE_LITERS) {
      leave(state, car, 'Поїхав - грошей не вистачило', true)
      continue
    }
    pump.carId = car.id
    pump.requested = Math.min(
      car.tankSize - car.fuelLevel,
      affordable,
      state.reservoirs[car.fuelType]
    )
    pump.delivered = 0
    pump.spent = 0
  }
}

export function tickPumps(state: SimState): void {
  for (const pump of state.pumps) {
    if (pump.outTicks > 0) {
      pump.outTicks -= 1
      continue
    }
    if (pump.carId === null) continue
    const car = state.cars[pump.carId]
    if (car === undefined) {
      resetPump(pump)
      continue
    }
    const remaining = pump.requested - pump.delivered
    const flow = Math.min(FLOW_PER_TICK, remaining)
    const portion = Math.min(flow, state.reservoirs[car.fuelType])
    if (portion > 0) {
      const cost = portion * retailPrice(state, car.fuelType)
      pump.delivered += portion
      pump.spent += cost
      state.reservoirs[car.fuelType] -= portion
      state.balance += cost
      state.stats.revenue += cost
      car.wallet -= cost
      car.fuelLevel += portion
    }
    const reservoirEmpty = portion < flow
    if (pump.delivered >= pump.requested - 0.01 || reservoirEmpty) {
      finishRefuel(state, pump, car, reservoirEmpty)
    }
  }
}

export function tickQueue(state: SimState): void {
  for (const carId of [...state.queue]) {
    const car = state.cars[carId]
    if (car === undefined) {
      removeFromQueue(state, carId)
      continue
    }
    car.patience -= 1
    if (car.patience <= 0) {
      removeFromQueue(state, carId)
      pushHistory(car, state.tick, 'left', 'Не дочекався - «тут же пів години стояти»')
      state.stats.lost += 1
    }
  }
}

function finishRefuel(state: SimState, pump: Pump, car: Car, cutShort: boolean): void {
  car.stats.litersBought += pump.delivered
  car.stats.totalSpent += pump.spent
  const note = cutShort ? ' - пальне скінчилось' : ''
  pushHistory(
    car,
    state.tick,
    'refueled',
    `Залив ${fmtLiters(pump.delivered)} ${FUEL_LABELS[car.fuelType]} за ${fmtMoney(pump.spent)}${note}`
  )
  state.stats.served += 1
  resetPump(pump)
}

function resetPump(pump: Pump): void {
  pump.carId = null
  pump.requested = 0
  pump.delivered = 0
  pump.spent = 0
}

function leave(state: SimState, car: Car, reason: string, countLost: boolean): void {
  pushHistory(car, state.tick, 'left', reason)
  if (countLost) state.stats.lost += 1
}

function removeFromQueue(state: SimState, carId: string): void {
  const index = state.queue.indexOf(carId)
  if (index >= 0) state.queue.splice(index, 1)
}

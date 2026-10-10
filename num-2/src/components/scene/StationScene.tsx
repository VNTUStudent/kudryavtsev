'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { BreakingBanner } from '@/components/news/BreakingBanner'
import { TICK_MS } from '@/lib/sim/constants'
import { useSimStore } from '@/lib/sim/store'
import { gameHour } from '@/lib/sim/time'
import type { Car, SimState } from '@/lib/sim/types'
import { Backdrop } from './Backdrop'
import { Canopy } from './Canopy'
import { CAR_BOTTOM, EXIT_X, PUMP_X, carBody, carColor, carWidth, queueX } from './car-layout'
import { CarSprite } from './CarSprite'
import { dayNight } from './day-night'
import { HoseLayer } from './HoseLayer'
import { PriceTotem } from './PriceTotem'
import { PumpSprite, RefuelBadge } from './PumpSprite'
import { Shop } from './Shop'
import { Sky } from './Sky'
import { TankerSprite } from './TankerSprite'

interface SceneCar {
  car: Car
  x: number
  exiting: boolean
}

export function StationScene({ onSelectCar }: { onSelectCar: (carId: string) => void }) {
  const state = useSimStore()
  const phase = dayNight(gameHour(state.tick))
  const night = phase.nightFactor > 0.45

  const carsByPump = useMemo(
    () =>
      state.pumps.map((pump) => {
        if (pump.carId === null) return null
        return state.cars[pump.carId] ?? null
      }),
    [state.pumps, state.cars]
  )

  const activeCars = useMemo<SceneCar[]>(() => {
    const list: SceneCar[] = []
    state.pumps.forEach((pump, index) => {
      const car = pump.carId ? state.cars[pump.carId] : null
      if (car) list.push({ car, x: PUMP_X[index], exiting: false })
    })
    state.queue.forEach((carId, index) => {
      const car = state.cars[carId]
      if (car) list.push({ car, x: queueX(index), exiting: false })
    })
    return list
  }, [state.pumps, state.queue, state.cars])

  const [ghosts, setGhosts] = useState<Car[]>([])
  const [tankerStarts, setTankerStarts] = useState<Record<string, number>>({})

  useEffect(() => {
    const unsubscribe = useSimStore.subscribe((snapshot, previous) => {
      if (snapshot.tick < previous.tick) setTankerStarts({})
      setTankerStarts((starts) => {
        let changed = false
        const next = { ...starts }
        for (const tanker of snapshot.tankers) {
          if (next[tanker.id] === undefined) {
            next[tanker.id] = tanker.etaTicks
            changed = true
          }
        }
        return changed ? next : starts
      })
      const currentIds = new Set(collectCars(snapshot).map((car) => car.id))
      const gone = collectCars(previous).filter((car) => !currentIds.has(car.id))
      if (gone.length === 0) return
      setGhosts((existing) => [
        ...existing,
        ...gone.filter((car) => !existing.some((ghost) => ghost.id === car.id)),
      ])
      setTimeout(() => {
        setGhosts((existing) => existing.filter((car) => !gone.some((g) => g.id === car.id)))
      }, 1300)
    })
    return unsubscribe
  }, [])

  const activeIds = new Set(activeCars.map((entry) => entry.car.id))
  const ghostCars: SceneCar[] = ghosts
    .filter((car) => !activeIds.has(car.id))
    .map((car) => ({ car, x: EXIT_X, exiting: true }))
  const allCars: SceneCar[] = [...activeCars, ...ghostCars]

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden bg-[#5aaee4] md:aspect-[16/7]"
      style={{ '--tick-ms': `${Math.round(TICK_MS / state.speed)}ms` } as CSSProperties}
    >
      <Sky phase={phase} tick={state.tick} />
      <Backdrop />
      <Canopy night={phase.nightFactor} />
      <Shop night={phase.nightFactor} />
      <PriceTotem night={phase.nightFactor} />
      {state.pumps.map((pump, index) => (
        <PumpSprite
          key={pump.id}
          pump={pump}
          x={PUMP_X[index]}
          fuelType={carsByPump[index]?.fuelType ?? null}
        />
      ))}
      {state.tankers.map((tanker) => {
        const start = tankerStarts[tanker.id] ?? tanker.etaTicks
        return (
          <TankerSprite
            key={tanker.id}
            tanker={tanker}
            progress={1 - tanker.etaTicks / start}
            night={night}
          />
        )
      })}
      {allCars.map(({ car, x, exiting }) => (
        <CarView
          key={car.id}
          car={car}
          x={x}
          exiting={exiting}
          night={night}
          onSelectCar={onSelectCar}
        />
      ))}
      <HoseLayer pumps={state.pumps} carsByPump={carsByPump} />
      {state.pumps.map((pump, index) => {
        const car = carsByPump[index]
        if (!car || pump.outTicks > 0) return null
        return (
          <RefuelBadge
            key={pump.id}
            pump={pump}
            car={car}
            x={PUMP_X[index]}
            onSelectCar={onSelectCar}
          />
        )
      })}
      {state.activeEvents.some((active) => active.event.category === 'crisis') && (
        <div className="crisis-vignette pointer-events-none absolute inset-0 z-35 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(180,20,20,0.55))]" />
      )}
      <BreakingBanner />
    </div>
  )
}

function CarView({
  car,
  x,
  exiting,
  night,
  onSelectCar,
}: {
  car: Car
  x: number
  exiting: boolean
  night: boolean
  onSelectCar: (carId: string) => void
}): ReactNode {
  const [entering, setEntering] = useState(true)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntering(false))
    return () => cancelAnimationFrame(frame)
  }, [])
  const body = carBody(car)
  return (
    <button
      type="button"
      title={car.name}
      aria-label={`${car.name} - ${car.model}`}
      onClick={() => onSelectCar(car.id)}
      className="absolute z-20 -translate-x-1/2 cursor-pointer"
      style={{
        left: `${entering ? 115 : x}%`,
        bottom: `${CAR_BOTTOM}%`,
        width: `${carWidth(body)}%`,
        opacity: exiting ? 0 : 1,
        transition: 'left var(--tick-ms) linear, opacity 480ms ease',
      }}
    >
      <CarSprite body={body} color={carColor(car)} night={night} />
    </button>
  )
}

function collectCars(state: SimState): Car[] {
  const list: Car[] = []
  state.pumps.forEach((pump) => {
    const car = pump.carId !== null ? state.cars[pump.carId] : null
    if (car) list.push(car)
  })
  state.queue.forEach((carId) => {
    const car = state.cars[carId]
    if (car) list.push(car)
  })
  return list
}

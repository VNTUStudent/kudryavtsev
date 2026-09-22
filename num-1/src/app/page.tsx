'use client'

import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { NewsBroadcast } from '@/components/news/NewsBroadcast'
import { StationScene } from '@/components/scene/StationScene'
import { CarDetailSheet } from '@/components/sim/CarDetailSheet'
import { CarsTable } from '@/components/sim/CarsTable'
import { ControlsBar } from '@/components/sim/ControlsBar'
import { FuelCard } from '@/components/sim/FuelCard'
import { GameOver } from '@/components/sim/GameOver'
import { MarkupSlider } from '@/components/sim/MarkupSlider'
import { SimDriver } from '@/components/sim/SimDriver'
import { StationStats } from '@/components/sim/StationStats'
import { TankerPanel } from '@/components/sim/TankerPanel'

export default function Home() {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ControlsBar />
      <main className="mx-auto w-full max-w-7xl flex-1 p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl border">
          <StationScene onSelectCar={setSelectedCarId} />
          {/*<NewsTicker />*/}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <FuelCard />
            <MarkupSlider />
            <TankerPanel />
            <StationStats />
          </div>
          <div className="lg:relative">
            <div className="flex flex-col gap-4 lg:absolute lg:inset-0">
              <NewsBroadcast />
              <CarsTable onSelectCar={setSelectedCarId} />
            </div>
          </div>
        </div>
      </main>
      <CarDetailSheet carId={selectedCarId} onClose={() => setSelectedCarId(null)} />
      <SimDriver />
      <GameOver />
      <Toaster position="bottom-right" />
    </div>
  )
}

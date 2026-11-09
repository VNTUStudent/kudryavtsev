'use client'

import { useEffect, useState } from 'react'
import { useSimStore } from '@/lib/sim/store'
import { gameClockFull } from '@/lib/sim/time'
import type { NewsItem } from '@/lib/sim/types'

const HIDE_AFTER_MS = 8000

export function BreakingBanner() {
  const [shown, setShown] = useState<NewsItem | null>(null)

  useEffect(() => {
    const unsubscribe = useSimStore.subscribe((state, previous) => {
      const current = state.news[0]
      if (current?.id === previous.news[0]?.id) return
      if (!current) {
        setShown(null)
        return
      }
      setShown(current)
      setTimeout(() => {
        setShown((existing) => (existing?.id === current.id ? null : existing))
      }, HIDE_AFTER_MS)
    })
    return unsubscribe
  }, [])

  if (!shown) return null
  const crisis = shown.event.category === 'crisis'

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center px-4 pt-3">
      <div
        className={`animate-banner-drop flex w-full max-w-3xl items-stretch overflow-hidden rounded-lg shadow-2xl ${
          crisis ? 'animate-pulse ring-4 ring-red-500/70' : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center bg-red-700 px-3 py-2">
          <span className="font-heading text-sm font-black tracking-widest text-white">ТСН</span>
          <span className="text-[8px] font-bold tracking-[0.25em] text-red-200">НАДЗВИЧАЙНІ</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center bg-black/85 px-3 py-2 backdrop-blur-sm">
          <p className="truncate text-xs font-semibold text-white sm:text-sm">
            {shown.event.headline}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-white/60">
            {shown.event.source} · {gameClockFull(shown.tick)}
          </p>
        </div>
      </div>
    </div>
  )
}

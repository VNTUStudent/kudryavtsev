'use client'

import { useEffect } from 'react'
import { TICK_MS } from '@/lib/sim/constants'
import { useSimStore } from '@/lib/sim/store'

export function SimDriver() {
  const running = useSimStore((state) => state.running)
  const speed = useSimStore((state) => state.speed)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(
      () => useSimStore.getState().advance(),
      Math.round(TICK_MS / speed)
    )
    return () => clearInterval(interval)
  }, [running, speed])

  return null
}

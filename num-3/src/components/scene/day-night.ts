export interface DayNight {
  nightFactor: number
  warmFactor: number
  sun: { x: number; y: number } | null
  moon: { x: number; y: number } | null
}

export function dayNight(hour: number): DayNight {
  return {
    nightFactor: nightFade(hour),
    warmFactor: warmPeak(hour),
    sun: celestial(hour, 6, 20),
    moon: celestial(hour >= 12 ? hour : hour + 24, 21, 29),
  }
}

function nightFade(hour: number): number {
  if (hour < 5) return 1
  if (hour < 8) return 1 - (hour - 5) / 3
  if (hour < 17) return 0
  if (hour < 21) return (hour - 17) / 4
  return 1
}

function warmPeak(hour: number): number {
  return Math.max(1 - Math.abs(hour - 6.5) / 2, 1 - Math.abs(hour - 19) / 2, 0)
}

function celestial(hour: number, from: number, to: number): { x: number; y: number } | null {
  if (hour < from || hour > to) return null
  const progress = (hour - from) / (to - from)
  return {
    x: 8 + progress * 84,
    y: 56 - Math.sin(progress * Math.PI) * 46,
  }
}

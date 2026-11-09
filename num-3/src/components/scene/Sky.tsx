'use client'

import type { DayNight } from './day-night'

const STARS = [
  { x: 90, y: 60, r: 2.2 },
  { x: 240, y: 130, r: 1.6 },
  { x: 330, y: 50, r: 2.6 },
  { x: 480, y: 95, r: 1.8 },
  { x: 560, y: 180, r: 1.4 },
  { x: 650, y: 45, r: 2 },
  { x: 760, y: 140, r: 2.4 },
  { x: 880, y: 70, r: 1.7 },
  { x: 960, y: 190, r: 2.1 },
  { x: 1080, y: 55, r: 2.3 },
  { x: 1180, y: 150, r: 1.5 },
  { x: 1280, y: 90, r: 2.5 },
  { x: 1390, y: 40, r: 1.8 },
  { x: 1470, y: 170, r: 2 },
  { x: 1540, y: 80, r: 2.2 },
  { x: 180, y: 210, r: 1.5 },
  { x: 420, y: 230, r: 1.7 },
  { x: 700, y: 250, r: 1.4 },
  { x: 1020, y: 240, r: 1.6 },
  { x: 1330, y: 260, r: 1.5 },
]

const CLOUDS = [
  { top: '8%', width: '15%', period: 171, offset: 43, base: 0.95 },
  { top: '19%', width: '10%', period: 221, offset: 130, base: 0.7 },
  { top: '4%', width: '7%', period: 129, offset: 79, base: 0.8 },
]

const CLOUD_ENTRY_X = -28
const CLOUD_SPAN = 156
const CLOUD_TRANSITION = 'left var(--tick-ms) linear, opacity var(--tick-ms) linear'
const CELESTIAL_TRANSITION = 'transform var(--tick-ms) linear'

export function Sky({ phase, tick }: { phase: DayNight; tick: number }) {
  return (
    <>
      <svg
        viewBox="0 0 1600 700"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5aaee4" />
            <stop offset="1" stopColor="#b8dff5" />
          </linearGradient>
          <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d1838" />
            <stop offset="1" stopColor="#2c3a68" />
          </linearGradient>
          <linearGradient id="sky-warm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff9d5c" />
            <stop offset="1" stopColor="#ffd9a0" />
          </linearGradient>
        </defs>
        <rect width="1600" height="700" fill="url(#sky-day)" />
        <rect
          width="1600"
          height="700"
          fill="url(#sky-night)"
          style={{ opacity: phase.nightFactor, transition: CELESTIAL_TRANSITION }}
        />
        <rect
          width="1600"
          height="700"
          fill="url(#sky-warm)"
          style={{ opacity: phase.warmFactor * 0.45, transition: CELESTIAL_TRANSITION }}
        />
        {phase.nightFactor > 0.15 &&
          STARS.map((star, index) => (
            <circle
              key={`${star.x}-${star.y}`}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="#ffffff"
              className="scene-star"
              opacity={phase.nightFactor}
              style={{ animationDelay: `${(index % 7) * 0.45}s` }}
            />
          ))}
        {phase.sun && (
          <g
            style={{
              transform: `translate(${phase.sun.x * 16}px, ${phase.sun.y * 7}px)`,
              transition: CELESTIAL_TRANSITION,
            }}
          >
            <circle r="66" fill="#ffd93d" opacity="0.3" />
            <circle r="42" fill="#ffd93d" />
          </g>
        )}
        {phase.moon && (
          <g
            style={{
              transform: `translate(${phase.moon.x * 16}px, ${phase.moon.y * 7}px)`,
              transition: CELESTIAL_TRANSITION,
            }}
          >
            <circle r="52" fill="#e8ecf5" opacity="0.25" />
            <circle r="34" fill="#e8ecf5" />
            <circle cx="-10" cy="-6" r="6" fill="#cdd4e4" />
            <circle cx="8" cy="9" r="4" fill="#cdd4e4" />
          </g>
        )}
      </svg>
      {CLOUDS.map((cloud) => {
        const cycle = tick + cloud.offset
        const progress = (cycle % cloud.period) / cloud.period
        return (
          <div
            key={`${cloud.top}-${Math.floor(cycle / cloud.period)}`}
            className="absolute"
            style={{
              top: cloud.top,
              width: cloud.width,
              left: `${CLOUD_ENTRY_X + progress * CLOUD_SPAN}%`,
              opacity: cloud.base * (1 - phase.nightFactor * 0.65),
              transition: CLOUD_TRANSITION,
            }}
          >
            <svg viewBox="0 0 100 36" className="h-auto w-full">
              <g fill="#ffffff">
                <ellipse cx="28" cy="24" rx="21" ry="11" />
                <ellipse cx="54" cy="17" rx="24" ry="13" />
                <ellipse cx="76" cy="25" rx="19" ry="10" />
                <rect x="10" y="22" width="76" height="12" rx="6" />
              </g>
            </svg>
          </div>
        )
      })}
    </>
  )
}

'use client'

import { Moon, Pause, Play, RotateCcw, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORY_META } from '@/components/news/news-meta'
import { MINUTES_PER_TICK } from '@/lib/sim/constants'
import { fmtMoney } from '@/lib/sim/format'
import { useSimStore } from '@/lib/sim/store'
import { gameClock, gameDay, gameHour } from '@/lib/sim/time'

const SPEEDS = [1, 2, 4]

export function ControlsBar() {
  const tick = useSimStore((state) => state.tick)
  const running = useSimStore((state) => state.running)
  const speed = useSimStore((state) => state.speed)
  const balance = useSimStore((state) => state.balance)
  const activeEvents = useSimStore((state) => state.activeEvents)
  const gameOver = useSimStore((state) => state.gameOver)
  const toggleRunning = useSimStore((state) => state.toggleRunning)
  const setSpeed = useSimStore((state) => state.setSpeed)
  const restart = useSimStore((state) => state.restart)

  const hour = gameHour(tick)
  const DayNightIcon = hour >= 6 && hour < 20 ? Sun : Moon

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 p-3">
        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/60 px-2.5 py-1">
          <DayNightIcon
            className={`size-4 ${hour >= 6 && hour < 20 ? 'text-amber-500' : 'text-indigo-400'}`}
          />
          <div className="leading-none">
            <div className="text-muted-foreground text-[10px]">День {gameDay(tick)}</div>
            <div className="text-sm font-semibold tabular-nums">{gameClock(tick)}</div>
          </div>
        </div>
        {activeEvents.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeEvents.map((active) => {
              const meta = CATEGORY_META[active.event.category]
              const Icon = meta.icon
              return (
                <div
                  key={active.event.id}
                  className="flex items-center gap-1.5 rounded-lg border bg-muted/60 px-2.5 py-1"
                >
                  <Icon className="size-4 shrink-0" style={{ color: meta.hex }} />
                  <div className="leading-none">
                    <div className="text-muted-foreground text-[10px]">{meta.label}</div>
                    <div className="text-sm font-semibold tabular-nums">
                      ще {active.ticksLeft * MINUTES_PER_TICK} хв
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-muted-foreground text-xs">Каса</div>
            <div
              className={`font-heading text-base leading-tight font-semibold tabular-nums ${
                balance < 0 ? 'text-destructive' : 'text-emerald-600'
              }`}
            >
              {fmtMoney(balance)}
            </div>
          </div>
          <Button
            onClick={toggleRunning}
            disabled={gameOver}
            variant={running ? 'outline' : 'default'}
            size="icon"
            aria-label={running ? 'Пауза' : 'Запустити'}
          >
            {running ? <Pause /> : <Play />}
          </Button>
          <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
            {SPEEDS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSpeed(option)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  speed === option
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {option}×
              </button>
            ))}
          </div>
          <Button onClick={restart} variant="ghost" size="icon" aria-label="Почати заново">
            <RotateCcw />
          </Button>
        </div>
      </div>
    </header>
  )
}

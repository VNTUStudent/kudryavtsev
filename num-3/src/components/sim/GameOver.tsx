'use client'

import { OctagonX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { fmtMoney } from '@/lib/sim/format'
import { useSimStore } from '@/lib/sim/store'

export function GameOver() {
  const gameOver = useSimStore((state) => state.gameOver)
  const stats = useSimStore((state) => state.stats)
  const restart = useSimStore((state) => state.restart)

  if (!gameOver) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-sm text-center shadow-lg">
        <CardHeader className="items-center">
          <OctagonX className="text-destructive mx-auto size-12" />
          <CardTitle className="text-xl">Вас мобілізували</CardTitle>
          <CardDescription>Місцеві олігархи не простили борги.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted p-2">
            <div className="text-muted-foreground text-xs">Обслужено</div>
            <div className="font-heading font-semibold tabular-nums">{stats.served}</div>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <div className="text-muted-foreground text-xs">Витяг</div>
            <div className="font-heading font-semibold tabular-nums">
              {fmtMoney(stats.revenue)}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={restart}>
            Почати заново
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

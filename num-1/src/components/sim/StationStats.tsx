'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fmtMoney } from '@/lib/sim/format'
import { useSimStore } from '@/lib/sim/store'

export function StationStats() {
  const stats = useSimStore((state) => state.stats)

  const cells = [
    { label: 'Обслужено', value: String(stats.served) },
    { label: 'Втрати', value: String(stats.lost) },
    { label: 'Проїхали мимо', value: String(stats.driveBy) },
    { label: 'Витяг', value: fmtMoney(stats.revenue) },
  ]

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Статистика</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {cells.map((cell) => (
          <div key={cell.label} className="rounded-lg bg-muted p-2">
            <div className="text-muted-foreground text-xs">{cell.label}</div>
            <div className="font-heading text-sm font-semibold tabular-nums">{cell.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { FuelBadge } from '@/components/sim/FuelBadge'
import { fmtLiters, fmtMoney } from '@/lib/sim/format'
import { useSimStore } from '@/lib/sim/store'
import { gameClockFull } from '@/lib/sim/time'
import { Users } from 'lucide-react'
import type { Car, SimState } from '@/lib/sim/types'

type SortKey = 'name' | 'wallet' | 'visits' | 'litersBought' | 'totalSpent' | 'lastVisit'

function carStatus(state: SimState, car: Car): string {
  const pump = state.pumps.find((entry) => entry.carId === car.id)
  if (pump) return `Колонка №${pump.id}`
  if (state.queue.includes(car.id)) return 'В черзі'
  return 'Десь їздить'
}

export function CarsTable({ onSelectCar }: { onSelectCar: (carId: string) => void }) {
  const state = useSimStore()
  const [sortKey, setSortKey] = useState<SortKey>('visits')
  const [ascending, setAscending] = useState(false)

  const direction = ascending ? 1 : -1
  const cars = Object.values(state.cars).sort((a, b) => {
    if (sortKey === 'name') return a.name.localeCompare(b.name, 'uk') * direction
    if (sortKey === 'wallet') return (a.wallet - b.wallet) * direction
    if (sortKey === 'litersBought') return (a.stats.litersBought - b.stats.litersBought) * direction
    if (sortKey === 'totalSpent') return (a.stats.totalSpent - b.stats.totalSpent) * direction
    if (sortKey === 'lastVisit') return (a.lastVisit - b.lastVisit) * direction
    return (a.stats.visits - b.stats.visits) * direction
  })

  const header = (key: SortKey, label: string) => (
    <TableHead
      className="cursor-pointer select-none"
      onClick={() => {
        if (sortKey === key) setAscending(!ascending)
        else {
          setSortKey(key)
          setAscending(false)
        }
      }}
    >
      {label}
      {sortKey === key ? (ascending ? ' ↑' : ' ↓') : ''}
    </TableHead>
  )

  return (
    <Card size="sm" className="min-h-0 flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Постійні клієнти
          <Badge variant="secondary">{cars.length}</Badge>
        </CardTitle>
        <CardDescription>Кожен з них - особистість з історією</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-auto">
        {cars.length === 0 ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="size-4" />
              </EmptyMedia>
              <EmptyTitle>Ще нікого</EmptyTitle>
              <EmptyDescription>Розпочніть симуляцію та почекайте на перших клієнтів</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {header('name', 'Клієнт')}
                <TableHead>Авто</TableHead>
                <TableHead>Пальне</TableHead>
                <TableHead>Статус</TableHead>
                {header('wallet', 'Гаманець')}
                {header('visits', 'Візити')}
                {header('litersBought', 'Куплено')}
                {header('totalSpent', 'Витратив')}
                {header('lastVisit', 'Останній візит')}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow
                  key={car.id}
                  className="cursor-pointer"
                  onClick={() => onSelectCar(car.id)}
                >
                  <TableCell className="font-medium">{car.name}</TableCell>
                  <TableCell className="text-muted-foreground">{car.model}</TableCell>
                  <TableCell>
                    <FuelBadge fuelType={car.fuelType} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{carStatus(state, car)}</TableCell>
                  <TableCell className="tabular-nums">{fmtMoney(car.wallet)}</TableCell>
                  <TableCell className="tabular-nums">{car.stats.visits}</TableCell>
                  <TableCell className="tabular-nums">{fmtLiters(car.stats.litersBought)}</TableCell>
                  <TableCell className="tabular-nums">{fmtMoney(car.stats.totalSpent)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {gameClockFull(car.lastVisit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

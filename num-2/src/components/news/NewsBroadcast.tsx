'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Radio } from 'lucide-react'
import { useSimStore } from '@/lib/sim/store'
import { gameClockFull } from '@/lib/sim/time'
import type { NewsItem } from '@/lib/sim/types'
import { CATEGORY_META } from './news-meta'

export function NewsBroadcast() {
  const news = useSimStore((state) => state.news)

  return (
    <Card size="sm" className="min-h-0 flex-1 p-0 gap-px">
      <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-red-900 via-red-700 to-red-900 px-3 py-2">
        <span className="rounded bg-white px-1.5 py-0.5 font-heading text-sm font-black text-red-700">
          ТСН
        </span>
        <span className="font-heading text-sm font-semibold text-white">Надзвичайно потужний ефір</span>
      </div>
      <CardContent className="flex max-h-[34rem] min-h-0 flex-1 flex-col gap-px overflow-y-auto p-0 lg:max-h-none">
        {news.length === 0 ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Radio className="size-4" />
              </EmptyMedia>
              <EmptyTitle>Ефір пустий</EmptyTitle>
              <EmptyDescription>Стежте за новинами</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          news.map((item, index) => <Report key={item.id} item={item} featured={index === 0} />)
        )}
      </CardContent>
    </Card>
  )
}

function Report({ item, featured }: { item: NewsItem; featured: boolean }) {
  const meta = CATEGORY_META[item.event.category]
  const Icon = meta.icon
  return (
    <article
      className={`border-l-4 ${meta.borderClass} rounded-r-md bg-muted/40 py-2 pr-2 pl-2.5 ${
        featured ? '' : 'opacity-75'
      }`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: meta.hex }}>
        <Icon className="size-3" />
        {meta.label.toUpperCase()}
      </div>
      <h3
        className={`mt-1 leading-snug font-semibold ${featured ? 'text-sm' : 'text-xs'}`}
      >
        {item.event.headline}
      </h3>
      {item.event.body && (
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{item.event.body}</p>
      )}
      <div className="text-muted-foreground mt-1.5 text-[10px]">
        {item.event.source} · {gameClockFull(item.tick)}
      </div>
    </article>
  )
}

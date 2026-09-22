'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { MARKUP_MAX, MARKUP_MIN } from '@/lib/sim/constants'
import { useSimStore } from '@/lib/sim/store'

export function MarkupSlider() {
  const markup = useSimStore((state) => state.markup)
  const setMarkup = useSimStore((state) => state.setMarkup)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Націнка</CardTitle>
        <CardDescription>
          {markup > 0.35
            ? 'Обдирати таксистів - святе, але черга рідшає'
            : markup < 0
              ? 'Продаєте майже в збиток - люди це оцінять'
              : 'Справедлива ціна для чесної АЗС'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Slider
          min={MARKUP_MIN * 100}
          max={MARKUP_MAX * 100}
          step={5}
          value={[Math.round(markup * 100)]}
          onValueChange={(value) => setMarkup((Array.isArray(value) ? value[0] : value) / 100)}
        />
        <div className="font-heading text-center text-lg font-semibold tabular-nums">
          {markup >= 0 ? '+' : ''}
          {Math.round(markup * 100)}%
        </div>
      </CardContent>
    </Card>
  )
}

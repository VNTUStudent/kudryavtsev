'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FUEL_HEX, ROAD_LINKS, ROAD_NODE_LABELS } from '@/lib/sim/constants'
import { routeLegs, tankerProgress } from '@/lib/sim/routing/route-selectors'
import { useSimStore } from '@/lib/sim/store'

const VIEW_WIDTH = 320
const VIEW_HEIGHT = 170

const NODE_POS: Record<string, { x: number; y: number }> = {
  depot: { x: 34, y: 96 },
  'junction-highway': { x: 122, y: 42 },
  'junction-bridge': { x: 122, y: 142 },
  'junction-ring': { x: 212, y: 96 },
  station: { x: 288, y: 60 },
}

const LINK_KEY = (from: string, to: string) => [from, to].sort().join('|')

function legPoint(from: string, to: string, ratio: number): { x: number; y: number } {
  const a = NODE_POS[from]
  const b = NODE_POS[to]
  return { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio }
}

export function RouteMap() {
  const tankers = useSimStore((state) => state.tankers)
  const tick = useSimStore((state) => state.tick)
  const activeLegs = new Set(
    tankers.flatMap((tanker) =>
      routeLegs(tanker.route).map(([from, to]) => LINK_KEY(from, to))
    )
  )

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Дорожня мережа</CardTitle>
        <CardDescription>Граф маршруту бензовоза · вага = тики шляху</CardDescription>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full"
          role="img"
          aria-label="Граф дорожньої мережі"
        >
          {ROAD_LINKS.map(([from, to, ticks]) => {
            const a = NODE_POS[from]
            const b = NODE_POS[to]
            const active = activeLegs.has(LINK_KEY(from, to))
            const mid = legPoint(from, to, 0.5)
            return (
              <g key={LINK_KEY(from, to)}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={active ? '#f59e0b' : '#9ca3af'}
                  strokeWidth={active ? 4 : 2}
                  strokeDasharray={active ? undefined : '5 4'}
                />
                <text
                  x={mid.x}
                  y={mid.y - 5}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-semibold"
                >
                  {ticks}
                </text>
              </g>
            )
          })}
          {Object.entries(NODE_POS).map(([id, pos]) => (
            <g key={id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={id === 'station' || id === 'depot' ? 9 : 6}
                fill={id === 'station' ? '#10b981' : id === 'depot' ? '#0ea5e9' : '#6b7280'}
                stroke="#1f2937"
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y + (id === 'junction-bridge' ? 22 : -14)}
                textAnchor="middle"
                className="fill-foreground text-[11px] font-medium"
              >
                {ROAD_NODE_LABELS[id]}
              </text>
            </g>
          ))}
          {tankers.map((tanker) => {
            const legs = routeLegs(tanker.route)
            if (legs.length === 0) return null
            const progress = tankerProgress(tanker, tick) * legs.length
            const index = Math.min(Math.floor(progress), legs.length - 1)
            const point = legPoint(legs[index][0], legs[index][1], progress - index)
            return (
              <circle
                key={tanker.id}
                cx={point.x}
                cy={point.y}
                r={7}
                fill={FUEL_HEX[tanker.fuelType]}
                stroke="#1f2937"
                strokeWidth="2.5"
              />
            )
          })}
        </svg>
        {tankers.length > 0 ? (
          <div className="text-muted-foreground mt-1 text-xs">
            {tankers.length === 1
              ? 'Бензовоз у дорозі — виділена ділянка, кружечок = позиція'
              : `${tankers.length} бензовози в дорозі`}
          </div>
        ) : (
          <div className="text-muted-foreground mt-1 text-xs">
            Замовте бензовоза — маршрут через граф рахує Дейкстра
          </div>
        )}
      </CardContent>
    </Card>
  )
}

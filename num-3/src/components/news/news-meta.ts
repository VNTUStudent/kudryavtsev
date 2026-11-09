import {
  Crown,
  Flame,
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { NewsCategory } from '@/lib/sim/types'

export interface CategoryMeta {
  label: string
  icon: LucideIcon
  hex: string
  borderClass: string
}

export const CATEGORY_META: Record<NewsCategory, CategoryMeta> = {
  'market-up': {
    label: 'Ціни ростуть',
    icon: TrendingUp,
    hex: '#ef4444',
    borderClass: 'border-l-red-500',
  },
  'market-down': {
    label: 'Ціни падають',
    icon: TrendingDown,
    hex: '#10b981',
    borderClass: 'border-l-emerald-500',
  },
  demand: {
    label: 'Ажіотаж',
    icon: Users,
    hex: '#f59e0b',
    borderClass: 'border-l-amber-500',
  },
  operational: {
    label: 'Поломка',
    icon: Wrench,
    hex: '#64748b',
    borderClass: 'border-l-slate-500',
  },
  vip: {
    label: 'Важливі гості',
    icon: Crown,
    hex: '#8b5cf6',
    borderClass: 'border-l-violet-500',
  },
  crisis: {
    label: 'Криза',
    icon: Flame,
    hex: '#dc2626',
    borderClass: 'border-l-red-700',
  },
}

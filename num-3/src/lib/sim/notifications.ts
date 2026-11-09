import { toast } from 'sonner'
import { FUEL_LABELS } from './constants'
import { fmtLiters, fmtMoney } from './format'
import type { SimNotice } from './sim-notice'

export function publishNotice(notice: SimNotice): void {
  if (notice.kind === 'tanker-departed') {
    toast(`Бензовоз ${FUEL_LABELS[notice.fuelType]} виїхав`, {
      description: `Сплачено ${fmtMoney(notice.cost)} · 1 000 л у дорозі`,
    })
    return
  }
  if (notice.kind === 'tanker-arrived') {
    toast(`Бензовоз ${FUEL_LABELS[notice.fuelType]} приїхав`, {
      description:
        notice.overflow > 1
          ? `Залив ${fmtLiters(notice.added)} - ${fmtLiters(notice.overflow)} не влізло`
          : `Залив ${fmtLiters(notice.added)}`,
    })
    return
  }
  toast.error('Вас мобілізували', {
    description: 'Місцеві олігархи не простили борги',
    duration: 10000,
  })
}

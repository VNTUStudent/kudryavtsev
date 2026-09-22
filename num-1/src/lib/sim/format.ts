const moneyFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 })
const priceFormat = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function fmtMoney(value: number): string {
  return `${moneyFormat.format(Math.round(value))} ₴`
}

export function fmtPrice(value: number): string {
  return `${priceFormat.format(value)} ₴/л`
}

export function fmtLiters(value: number): string {
  return `${moneyFormat.format(Math.round(value))} л`
}

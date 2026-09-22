import type { FuelType } from './types'

export const CAR_NAMES = [
  'Тарас Бондаренко',
  'Оксана Ковальчук',
  'Микола Мельник',
  'Богдан Ткачук',
  'Ірина Поліщук',
  'Галя Лисенко',
  'Дмитро Савченко',
  'Марічка Петренко',
  'Панас Кравчук',
  'Леся Бойко',
  'Устим Гончаренко',
  'Одарка Шевчук',
  'Віталій Демченко',
  'Соломія Мазур',
  'Іван Сич',
  'Гордій Панасюк',
  'Дід Михайло',
  'Баба Параска',
  'Таксист Віталік',
  'Агроном Степан',
  'Фермер Гриць',
  'Кума Ганна',
  'Пан Богдан',
  'Господиня Ярина',
  'Омелько Кушнір',
  'Маруся Бондар',
  'Козак Сірко',
  'Василь Хмара',
  'Ярина Соколова',
  'Ніна Дзюба',
  'Славко Коцур',
  'Люба Калина',
]

export type CarBody = 'hatch' | 'sedan' | 'taxi' | 'van' | 'tractor' | 'combine'

export interface CarModel {
  name: string
  fuels: FuelType[]
  tank: [number, number]
  body: CarBody
}

export const CAR_MODELS: CarModel[] = [
  { name: 'ЗАЗ Славута', fuels: ['a92'], tank: [32, 38], body: 'hatch' },
  { name: 'Daewoo Lanos', fuels: ['a92'], tank: [40, 45], body: 'sedan' },
  { name: 'Богдан-2310', fuels: ['a92'], tank: [40, 50], body: 'sedan' },
  { name: 'Daewoo Matiz', fuels: ['a92'], tank: [28, 35], body: 'hatch' },
  { name: 'Renault Logan (таксі)', fuels: ['a92', 'a95'], tank: [43, 50], body: 'taxi' },
  { name: 'Skoda Octavia (таксі)', fuels: ['a95'], tank: [50, 55], body: 'taxi' },
  { name: 'VW Passat B5', fuels: ['a95'], tank: [55, 62], body: 'sedan' },
  { name: 'Mercedes W124 «комбайн»', fuels: ['a95'], tank: [60, 70], body: 'sedan' },
  { name: 'Chevrolet Lacetti', fuels: ['a95'], tank: [45, 55], body: 'sedan' },
  { name: 'Toyota Corolla', fuels: ['a95'], tank: [45, 50], body: 'sedan' },
  { name: 'ГАЗель', fuels: ['diesel'], tank: [50, 60], body: 'van' },
  { name: 'Трактор МТЗ-82', fuels: ['diesel'], tank: [110, 130], body: 'tractor' },
  { name: 'Peugeot Boxer', fuels: ['diesel'], tank: [60, 70], body: 'van' },
  { name: 'Комбайн «Клавдія»', fuels: ['diesel'], tank: [90, 130], body: 'combine' },
  { name: 'Ford Transit', fuels: ['diesel'], tank: [55, 65], body: 'van' },
]

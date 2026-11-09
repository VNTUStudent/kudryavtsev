import type { JournalRecord } from './types'

export function serializeNdjson(records: readonly JournalRecord[]): string {
  if (records.length === 0) return ''
  return `${records.map((record) => JSON.stringify(record)).join('\n')}\n`
}

export function parseNdjson(text: string): JournalRecord[] {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as JournalRecord)
}

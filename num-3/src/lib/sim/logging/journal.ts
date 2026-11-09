import { JOURNAL_CAP } from '../constants'
import type { SimState } from '../types'
import type { JournalOrigin, JournalRecord } from './types'

export function appendJournal(
  log: readonly JournalRecord[],
  record: JournalRecord
): JournalRecord[] {
  const next = [...log, record]
  if (next.length <= JOURNAL_CAP) return next
  const dropped = next.length - JOURNAL_CAP + 1
  return [...next.slice(dropped), { kind: 'journal-truncated', tick: record.tick, dropped }]
}

export function createJournal(
  origin: JournalOrigin,
  state: SimState
): JournalRecord[] {
  return [{ kind: 'session-start', tick: state.tick, origin, balance: state.balance, markup: state.markup }]
}

export function tickSummaryRecord(state: SimState): JournalRecord {
  return {
    kind: 'tick',
    tick: state.tick,
    balance: Math.round(state.balance * 100) / 100,
    queueLength: state.queue.length,
    served: state.stats.served,
    lost: state.stats.lost,
  }
}

import { describe, expect, test } from 'bun:test'
import { JOURNAL_CAP } from '@/lib/sim/constants'
import { appendJournal, createJournal, tickSummaryRecord } from '@/lib/sim/logging/journal'
import { parseNdjson, serializeNdjson } from '@/lib/sim/logging/ndjson-codec'
import type { JournalRecord } from '@/lib/sim/logging/types'
import { createInitialState } from '@/lib/sim/initial-state'

const record = (tick: number): JournalRecord => ({ kind: 'game-over', tick })

describe('journal', () => {
  test('createJournal opens with a session-start record', () => {
    const log = createJournal('imported', createInitialState())
    expect(log).toHaveLength(1)
    expect(log[0]).toMatchObject({
      kind: 'session-start',
      origin: 'imported',
      tick: 0,
      balance: 150000,
    })
  })

  test('appendJournal caps the log and discloses the drop', () => {
    let log = createJournal('default', createInitialState())
    const target = JOURNAL_CAP + 20
    for (let tick = 1; tick <= target; tick += 1) {
      log = appendJournal(log, record(tick))
    }
    expect(log.length).toBeLessThanOrEqual(JOURNAL_CAP)
    const truncation = log.filter((entry) => entry.kind === 'journal-truncated')
    expect(truncation.length).toBeGreaterThan(0)
    expect(truncation.at(-1)).toMatchObject({ kind: 'journal-truncated', tick: target })
  })

  test('tick summary captures plain scalars only', () => {
    const state = { ...createInitialState() }
    state.stats.served = 7
    const entry = tickSummaryRecord(state)
    expect(entry).toEqual({
      kind: 'tick',
      tick: 0,
      balance: 150000,
      queueLength: 0,
      served: 7,
      lost: 0,
    })
    expect(JSON.stringify(entry)).not.toContain('pumps')
  })

  test('ndjson serialize then parse round-trips', () => {
    const log = [
      ...createJournal('default', createInitialState()),
      tickSummaryRecord(createInitialState()),
      record(1),
    ]
    const text = serializeNdjson(log)
    expect(text.endsWith('\n')).toBe(true)
    expect(parseNdjson(text)).toEqual(log)
  })

  test('empty journal serializes to an empty string', () => {
    expect(serializeNdjson([])).toBe('')
    expect(parseNdjson('')).toEqual([])
  })
})

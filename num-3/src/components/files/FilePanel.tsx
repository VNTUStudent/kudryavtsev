'use client'

import { useRef } from 'react'
import { toast } from 'sonner'
import { Download, FileUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  browserLogFileTransport,
} from '@/lib/files/browser-log-file-transport'
import { parseScenario } from '@/lib/files/scenario-codec'
import { JOURNAL_FILE_NAME } from '@/lib/sim/constants'
import { serializeNdjson } from '@/lib/sim/logging/ndjson-codec'
import { useSimStore } from '@/lib/sim/store'

export function FilePanel() {
  const fileInput = useRef<HTMLInputElement>(null)
  const journal = useSimStore((state) => state.journal)
  const importScenario = useSimStore((state) => state.importScenario)

  const onPickFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await browserLogFileTransport.readText(file)
      importScenario(parseScenario(text))
      toast.success('Сценарій завантажено', { description: file.name })
    } catch (error) {
      toast.error('Сценарій відхилено', {
        description: error instanceof Error ? error.message : 'Невідома помилка',
      })
    } finally {
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const onDownloadJournal = () => {
    browserLogFileTransport.writeText(JOURNAL_FILE_NAME, serializeNdjson(journal))
    toast.success('Журнал збережено', { description: JOURNAL_FILE_NAME })
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Файли</CardTitle>
        <CardDescription>Сценарій гри та журнал подій (NDJSON)</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            void onPickFile(event.target.files?.[0])
          }}
        />
        <Button
          size="sm"
          variant="outline"
          disabled={journal[0]?.kind === undefined}
          onClick={() => fileInput.current?.click()}
        >
          <FileUp data-icon="inline-start" />
          Імпортувати сценарій
        </Button>
        <Button size="sm" variant="outline" onClick={onDownloadJournal}>
          <Download data-icon="inline-start" />
          Завантажити журнал ({journal.length})
        </Button>
      </CardContent>
    </Card>
  )
}

import type { ILogFileTransport } from './log-file-transport'

export class BrowserLogFileTransport implements ILogFileTransport {
  public readText(file: File): Promise<string> {
    return file.text()
  }

  public writeText(fileName: string, contents: string): void {
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/x-ndjson' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.click()
    URL.revokeObjectURL(url)
  }
}

export const browserLogFileTransport: ILogFileTransport = new BrowserLogFileTransport()

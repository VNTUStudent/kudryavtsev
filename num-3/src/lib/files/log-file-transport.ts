export interface ILogFileTransport {
  readText(file: File): Promise<string>
  writeText(fileName: string, contents: string): void
}

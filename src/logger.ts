import { OutputChannel } from 'vscode'

export interface Logger {
    information(message: string): void
    error(message: string): void
}

export const logger = (channel: OutputChannel): Logger => ({
    information: (message: string) => channel.appendLine(`[info] ${message}`),
    error: (message: string) => channel.appendLine(`[error] ${message}`),
})

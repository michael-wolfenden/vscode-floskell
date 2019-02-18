'use strict'

import * as vscode from 'vscode'

import { getFloskellVersion } from './floskell'
import { logger, Logger } from './logger'

import HaskellDocumentFormattingEditProvider from './HaskellDocumentFormattingEditProvider'

const haskellDocumentSelector: vscode.DocumentSelector = {
    language: 'haskell',
    scheme: 'file',
}

export const activate = (ctx: vscode.ExtensionContext) => {
    const cwd = vscode.workspace.rootPath || process.cwd()

    const channel = vscode.window.createOutputChannel('vscode-floskell')
    ctx.subscriptions.push(channel)

    const log = logger(channel)
    log.information('Activating extension')

    getFloskellVersion(cwd).fork(errorMessage => {
        log.error(errorMessage)
        vscode.window.showErrorMessage(errorMessage)
    }, registerFormatterProvider(ctx, cwd, log))
}

const registerFormatterProvider = (
    ctx: vscode.ExtensionContext,
    workingDirectory: string,
    logger: Logger,
) => (brittanyVersion: string) => {
    logger.information(
        `Registering document formatting provider using formatter:\n${brittanyVersion}`,
    )

    ctx.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            haskellDocumentSelector,
            new HaskellDocumentFormattingEditProvider(workingDirectory, logger),
        ),
    )

    ctx.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider(
            haskellDocumentSelector,
            new HaskellDocumentFormattingEditProvider(workingDirectory, logger),
        ),
    )
}

export function deactivate() {}

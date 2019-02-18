'use strict'

import * as vscode from 'vscode'
import * as Future from 'fluture'

import { formatCodeWithFloskell } from './floskell'
import { Logger } from './logger'

const formatDocumentRange = (cwd: string, log: Logger) => (
    document: vscode.TextDocument,
    range: vscode.Range,
) =>
    Future.resolve<string, void>(
        log.information(
            `Formatting lines ${range.start.line} to ${
                range.end.line
            } of document ${document.fileName}`,
        ),
    )
        .chain(() => formatCodeWithFloskell(cwd, document.getText(range)))
        .bimap(log.error, formattedCode => [
            new vscode.TextEdit(range, formattedCode),
        ])

const fullRange = (document: vscode.TextDocument) =>
    document.validateRange(
        new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE),
    )

export default class HaskellDocumentFormattingEditProvider
    implements
        vscode.DocumentFormattingEditProvider,
        vscode.DocumentRangeFormattingEditProvider {
    formatDocumentRange: (
        document: vscode.TextDocument,
        range: vscode.Range,
    ) => Future.FutureInstance<void, vscode.TextEdit[]>

    constructor(cwd: string, log: Logger) {
        this.formatDocumentRange = formatDocumentRange(cwd, log)
    }

    provideDocumentRangeFormattingEdits = (
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> =>
        new Promise<vscode.TextEdit[]>((resolve, reject) => {
            var cancel = this.formatDocumentRange(document, range).fork(
                reject,
                resolve,
            )

            token.onCancellationRequested(() => cancel())
        })

    provideDocumentFormattingEdits = (
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken,
    ) =>
        new Promise<vscode.TextEdit[]>((resolve, reject) => {
            var cancel = this.formatDocumentRange(
                document,
                fullRange(document),
            ).fork(reject, resolve)

            token.onCancellationRequested(() => cancel())
        })
}

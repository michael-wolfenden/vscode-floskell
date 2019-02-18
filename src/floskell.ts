'use strict'

import { stackExec, mapFailureToFriendlyMessage } from './stack'

const EXECUTABLE_NAME = 'floskell'

const firstLine = (lines: string) => lines.split('\n', 1)[0]

export const getFloskellVersion = (cwd: string) =>
    stackExec(EXECUTABLE_NAME, ['--version'], {
        cwd,
    }).bimap(mapFailureToFriendlyMessage(EXECUTABLE_NAME), firstLine)

export const formatCodeWithFloskell = (cwd: string, code: string) =>
    stackExec(EXECUTABLE_NAME, [], {
        cwd,
        input: code,
    }).mapRej(mapFailureToFriendlyMessage(EXECUTABLE_NAME))

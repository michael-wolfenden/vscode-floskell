'use strict'

import { Future } from 'fluture'
import * as execa from 'execa'

const execaFuture = (
    file: string,
    args?: ReadonlyArray<string>,
    options?: execa.Options,
) =>
    Future<execa.ExecaError, execa.ExecaReturns>((rej, res) => {
        const childProcess = execa(file, args, options)
        childProcess.then(res).catch(rej)

        return () => childProcess.kill()
    })

export const stackExec = (
    file: string,
    args: ReadonlyArray<string>,
    options?: execa.Options,
) =>
    execaFuture('stack', ['exec', '--', file, ...args], options).map(
        response => response.stdout,
    )

export const mapFailureToFriendlyMessage = (executableName: string) => (
    rejection: execa.ExecaError,
) =>
    rejection.stderr.startsWith(
        `Executable named ${executableName} not found on path`,
    )
        ? `'${executableName}' was not found. Run 'stack build ${executableName}' to add '${executableName}' to your stack project.`
        : rejection.stderr

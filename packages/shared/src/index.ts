import { alias } from './alias';
import { devConfig } from './config';
import { createCompilationPromise, logMessage } from './utilities/compiler-promise';
import { ensureDirectoryExistence } from './utilities/ensure-directory-existence';
import { getEnv } from './utilities/env';
import { getDefaultMode } from './utilities/get-default-mode';
import { lookup, manifestHelper } from './utilities/manifest-helper';
import { normalizePath, removeDoubleSlash } from './utilities/normalize-path';
import run, { format } from './utilities/run';

export * from './utilities/polyfills';

export {
    devConfig,
    run,
    format,
    logMessage,
    createCompilationPromise,
    removeDoubleSlash,
    normalizePath,
    manifestHelper,
    lookup,
    getDefaultMode,
    alias,
    getEnv,
    ensureDirectoryExistence,
};

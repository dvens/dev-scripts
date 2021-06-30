import { alias } from './alias';
import { devConfig, projectDirectory } from './config';
import { createCompilationPromise, logMessage } from './utilities/compiler-promise';
import { ensureDirectoryExistence } from './utilities/ensure-directory-existence';
import { getEnv } from './utilities/env';
import { findSupportedBrowsers } from './utilities/get-browser-list';
import { getDefaultMode } from './utilities/get-default-mode';
import getWorkboxConfig from './utilities/get-workbox-config';
import { lookup, manifestHelper } from './utilities/manifest-helper';
import { normalizePath, removeDoubleSlash } from './utilities/normalize-path';
import run, { format } from './utilities/run';
import { getScripts } from './utilities/scripts';

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
    findSupportedBrowsers,
    projectDirectory,
    getWorkboxConfig,
    getScripts,
};

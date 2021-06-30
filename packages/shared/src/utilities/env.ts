import { existsSync, realpathSync } from 'fs';
import { delimiter, isAbsolute, resolve } from 'path';

import { devConfig } from '../config';

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
    `${devConfig.dotenv}.${process.env.NODE_ENV}.local`,
    `${devConfig.dotenv}.${process.env.NODE_ENV}`,
    process.env.NODE_ENV !== 'test' && `${devConfig.dotenv}.local`,
    devConfig.dotenv,
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
    if (dotenvFile && existsSync(dotenvFile)) {
        require('dotenv').config({
            path: dotenvFile,
        });
    }
});

const appDirectory = realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
    .split(delimiter)
    .filter((folder) => folder && !isAbsolute(folder))
    .map((folder) => resolve(appDirectory, folder))
    .join(delimiter);

export const getEnv = () => {
    const raw = {
        PORT: process.env.PORT || 3000,
        NODE_ENV: process.env.NODE_ENV || 'development',
        HOST: process.env.HOST || 'http://localhost',
        ASSET_PREFIX: process.env.ASSET_PREFIX || '',
    };

    // Stringify all values so we can feed into Webpack DefinePlugin
    const stringified = {
        'process.env': Object.keys(raw).reduce((env: any, key) => {
            const typedKey = key as keyof typeof raw;
            env[typedKey] = JSON.stringify(raw[typedKey]);
            return env;
        }, {}),
    };

    return {
        raw,
        stringified,
    };
};

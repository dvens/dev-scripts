import { devConfig, getDefaultMode, normalizePath } from '@dev-scripts/shared';
// utilities
import { join } from 'path';

// Loaders
import fontsLoader from '../loaders/fonts-loader';
import imageLoader from '../loaders/image-loader';
import configureBabelLoader from '../loaders/javascript-typescript';
import configureStyleLoader from '../loaders/style-loader';
// Plugins
import { getPlugins } from '../plugins/plugins';
import { sharedConfig } from '../shared-config';

// Config files
const isProduction = getDefaultMode() === 'production';

export interface ClientBase {
    legacy?: boolean;
    includedPackages?: string[] | RegExp[];
    manifestSharedSeed?: any;
}

export const createClientBaseConfig = (options: ClientBase) => {
    const contenthash = isProduction && devConfig.contenthash ? '.[contenthash]' : '';
    const outputFilename = `${devConfig.jsOutputPath}[name]${contenthash}.js`;
    const outputChunkFilename = `${devConfig.jsOutputPath}${
        options.legacy ? `chunks/${devConfig.legacyPrefix}` : 'chunks/'
    }[name]${contenthash}.js`;

    const entry = options.legacy
        ? {
              [`${devConfig.legacyPrefix}main`]: devConfig.clientEntry,
          }
        : {
              main: devConfig.clientEntry,
          };

    const config = {
        ...sharedConfig,
        target: false,
        name: options.legacy ? 'legacy-client' : 'client',
        entry,
        plugins: [...getPlugins(true, options.manifestSharedSeed)],
        module: {
            rules: [
                // Javascript/Typescript
                ...configureBabelLoader({
                    includedPackages: options.includedPackages,
                    legacy: options.legacy,
                }),

                //CSS/SASS
                ...configureStyleLoader(),

                //Assets
                imageLoader(),
                fontsLoader(),
            ],
        },
        output: {
            filename: normalizePath(outputFilename),
            chunkFilename: normalizePath(outputChunkFilename),
            path: join(devConfig.clientDist, devConfig.publicPath),
            publicPath: devConfig.publicPath,
        },
    };

    return config;
};

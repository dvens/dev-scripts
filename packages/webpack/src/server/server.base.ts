import { devConfig, normalizePath } from '@dev-scripts/shared';
import * as nodeExternals from 'webpack-node-externals';

// Loaders
import fontsLoader from '../loaders/fonts-loader';
import imageLoader from '../loaders/image-loader';
import configureBabelLoader from '../loaders/javascript-typescript';
import configureStyleLoader from '../loaders/style-loader';
// Plugins
import { getPlugins } from '../plugins/plugins';
import { sharedConfig } from '../shared-config';

export interface ServerBase {
    includedPackages?: string[];
}

export const createServerBaseConfig = (options: ServerBase) => {
    const outputFilename = `server.js`;

    const config = {
        ...sharedConfig,
        target: 'node',
        name: 'server',
        entry: {
            server: devConfig.serverEntry,
        },
        plugins: [...getPlugins(false)],
        module: {
            rules: [
                // Javascript/Typescript
                ...configureBabelLoader({
                    includedPackages: options.includedPackages,
                    legacy: false,
                }),

                //CSS/SASS
                ...configureStyleLoader({
                    isClient: false,
                }),

                //Assets
                imageLoader(false),
                fontsLoader(false),
            ],
        },
        output: {
            filename: normalizePath(outputFilename),
            libraryTarget: 'commonjs2',
            path: devConfig.serverDist,
            publicPath: devConfig.publicPath,
        },
        node: {
            __filename: false,
            __dirname: false,
        },
        externals: ['./asset-manifest.json', './polyfills-manifest.json', nodeExternals()],
    };

    return config;
};

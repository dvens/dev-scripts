import { devConfig, getDefaultMode, getEnv, normalizePath } from '@dev-scripts/shared';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as SassLintPlugin from 'sass-lint-webpack';
import { DefinePlugin } from 'webpack';

const ESLintPlugin = require('eslint-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const env = getEnv();

const mode = getDefaultMode();
const isDevelopment = mode === 'development';

export const getPlugins = (isClient: boolean = true, manifestSharedSeed = {}) =>
    [
        isClient && new SassLintPlugin(),
        isClient && devConfig.copy && new CopyPlugin(devConfig.copy as any),
        isClient &&
            new ESLintPlugin({
                emitWarning: true,
                failOnError: true,
            }),
        isClient &&
            new MiniCssExtractPlugin({
                filename: normalizePath(
                    `${devConfig.cssOutputPath}${
                        isDevelopment ? '[name].css' : '[name].[contenthash].css'
                    }`,
                ),
                chunkFilename: normalizePath(
                    `${devConfig.cssOutputPath}${
                        isDevelopment ? '[id].css' : '[id].[contenthash].css'
                    }`,
                ),
            }),
        isClient &&
            new WebpackManifestPlugin({
                fileName: 'asset-manifest.json',
                seed: manifestSharedSeed,
                writeToFileEmit: true,
            }),

        new DefinePlugin(env.stringified),
        new DefinePlugin({
            __SERVER__: !isClient,
            __BROWSER__: isClient,
        }),
    ].filter(Boolean);

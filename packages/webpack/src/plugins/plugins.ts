import { devConfig, getDefaultMode, getEnv, normalizePath } from '@dev-scripts/shared';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SassLintPlugin from 'sass-lint-webpack';
import webpack from 'webpack';
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

        new webpack.DefinePlugin(env.stringified),
        new webpack.DefinePlugin({
            __SERVER__: !isClient,
            __BROWSER__: isClient,
        }),
    ].filter(Boolean);
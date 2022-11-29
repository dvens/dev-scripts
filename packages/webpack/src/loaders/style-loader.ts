import { getDefaultMode } from '@dev-scripts/shared';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = getDefaultMode() === 'development';

const cssRegex = /\.(css|scss)$/;
const cssModuleRegex = /\.module\.(css|scss)$/;
const cssClientRegex = /\.client\.(css|scss)$/;

const configureStyleLoader = (options = {}) => {
    const defaultOptions = Object.assign(
        {},
        {
            isClient: true,
        },
        options,
    );

    const cssModulesRules = {
        test: cssModuleRegex,
        use: getStyleLoaders(
            {
                modules: {
                    localIdentName: '[local]',
                    exportGlobals: true,
                    // Used for CSS modules to export the same class names as the ones used in the CSS files we generated for the client.
                    exportOnlyLocals: !defaultOptions.isClient,
                },
            },

            defaultOptions.isClient,
        ),
    };

    const cssRules = {
        test: cssRegex,
        exclude: [cssModuleRegex, cssClientRegex],
        use: getStyleLoaders(
            {
                modules: false,
            },
            defaultOptions.isClient,
        ),
    };

    const cssClientRules = {
        test: cssClientRegex,
        use: getStyleLoaders(
            {
                modules: false,
                esModule: false,
            },
            false,
        ),
    };

    cssClientRules.use.unshift('to-string-loader');

    return [cssModulesRules, cssRules, cssClientRules];
};

function getStyleLoaders(cssLoaderOptions = {}, extract: boolean): any {
    const sourceMap = isDevelopment;
    const styleLoaders = [
        extract &&
            !isDevelopment && {
                loader: MiniCssExtractPlugin.loader,
            },
        extract &&
            isDevelopment && {
                loader: 'style-loader',
            },
        {
            loader: 'css-loader',
            options: {
                sourceMap,
                importLoaders: 2,
                ...cssLoaderOptions,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap,
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap,
            },
        },
    ].filter(Boolean);

    return styleLoaders;
}

export default configureStyleLoader;

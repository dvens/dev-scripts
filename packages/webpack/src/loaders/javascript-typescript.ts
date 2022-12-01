import { findSupportedBrowsers, getDefaultMode, projectDirectory } from '@dev-scripts/shared';
import { existsSync } from 'fs';

const extendFilePath = `${projectDirectory}/babel.extend.js`;
const hasExtendFile = existsSync(extendFilePath);

const configureBabelLoader = ({ includedPackages = [] }: { includedPackages?: any[] }) => {
    let options = {
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
            [
                '@babel/plugin-transform-react-jsx',
                {
                    throwIfNamespace: false,
                    runtime: 'automatic',
                    importSource: '@atomify',
                },
            ],
        ],
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: findSupportedBrowsers(),
                    useBuiltIns: 'entry',
                    corejs: '3.6',
                },
            ],
            [
                '@babel/preset-typescript',
                { isTSX: true, allExtensions: true, jsxPragma: 'h', jsxPragmaFrag: 'Fragment' },
            ],
        ],
        cacheDirectory: getDefaultMode() === 'development',
    };

    if (hasExtendFile) {
        options = require(extendFilePath)(options);
    }

    return [
        {
            test: /\.(ts|tsx)?$/,
            exclude: includedPackages,
            use: [
                {
                    loader: 'babel-loader',
                    options,
                },
            ],
        },
        {
            test: /\.(js|jsx)?$/,
            exclude: includedPackages,
            use: [
                {
                    loader: 'babel-loader',
                    options,
                },
            ],
        },
    ];
};

export default configureBabelLoader;

import { findSupportedBrowsers, getDefaultMode, projectDirectory } from '@dev-scripts/shared';
import { existsSync } from 'fs';

const extendFilePath = `${projectDirectory}/babel.extend.js`;
const hasExtendFile = existsSync(extendFilePath);

const configureBabelLoader = ({
    includedPackages = [],
    legacy = false,
}: {
    includedPackages?: any[];
    legacy?: boolean;
}) => {
    let options = {
        plugins: [
            '@babel/syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
        ],
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: legacy ? ['ie 11'] : findSupportedBrowsers(),
                    useBuiltIns: false,
                    modules: false,
                    debug: false,
                },
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
                {
                    loader: 'ts-loader',
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

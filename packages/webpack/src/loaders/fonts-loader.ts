import { devConfig, normalizePath } from '@dev-scripts/shared';
const fontsLoader = (isClient = true) => {
    const defaultOptions = {
        name: devConfig.contenthash ? '[name].[contenthash].[ext]' : '[name].[ext]',
        outputPath: normalizePath(devConfig.fontsOutputPath),
        emitFile: isClient,
    };

    return {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
            {
                loader: 'file-loader',
                options: defaultOptions,
            },
        ],
    };
};

export default fontsLoader;

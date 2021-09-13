import { devConfig, removeDoubleSlash } from '@dev-scripts/shared';
const fontsLoader = (isClient = true) => {
    const defaultOptions = {
        name: '[name].[ext]',
        publicPath: removeDoubleSlash(`${devConfig.publicPath}${devConfig.fontsOutputPath}`),
        outputPath: removeDoubleSlash(`${devConfig.publicPath}${devConfig.fontsOutputPath}`),
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

import { devConfig, getDefaultMode, normalizePath } from '@dev-scripts/shared';
const isDevelopment = getDefaultMode() === 'development';

const imageLoader = (isClient = true) => {
    const defaultOptions = {
        name: devConfig.contenthash ? '[name].[contenthash].[ext]' : '[name].[ext]',
        outputPath: normalizePath(devConfig.imagesOutputPath),
        emitFile: isClient,
    };

    const imageWebpackLoaderOptions = {
        disable: isDevelopment,
        mozjpeg: {
            progressive: true,
            quality: 65,
        },
        optipng: {
            enabled: false,
        },
        pngquant: {
            quality: [0.65, 0.9],
            speed: 4,
        },
        gifsicle: {
            interlaced: false,
        },
    };

    return {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
            {
                loader: 'file-loader',
                options: defaultOptions,
            },
            {
                loader: 'image-webpack-loader',
                options: imageWebpackLoaderOptions,
            },
        ],
    };
};

export default imageLoader;
